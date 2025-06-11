import React, { useState, useEffect } from 'react';
import BreadHeader from './components/BreadHeader';
import BreadAddAttemptForm from './components/BreadAddAttemptForm';
import BreadViewAttempts from './components/BreadViewAttempts';
import BreadSummaryTable from './components/BreadSummaryTable';
import BreadAIRecommendations from './components/BreadAIRecommendations';
import BreadUserSelector from './components/BreadUserSelector';
import { supabase } from './supabaseClient';

const App = () => {
  const [currentPage, setCurrentPage] = useState('userSelection');
  const [attempts, setAttempts] = useState([]);
  const [users, setUsers] = useState([]); // array of strings (user names)
  const [selectedUser, setSelectedUser] = useState(null);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [loadingAttempts, setLoadingAttempts] = useState(false);

  // Fetch distinct user_names from bread_attempts
  useEffect(() => {
    const fetchUsers = async () => {
      setLoadingUsers(true);
      const { data, error } = await supabase
        .from('bread_attempts')
        .select('user_name', { count: 'exact', head: false })
        .neq('user_name', null);

      if (error) {
        console.error('Error fetching users:', error);
        setUsers([]);
      } else {
        // Extract unique user names
        const uniqueUsers = [...new Set(data.map(a => a.user_name))];
        setUsers(uniqueUsers);

        // Load selected user from localStorage
        const storedUser = localStorage.getItem('selectedBreadUserName');
        if (storedUser && uniqueUsers.includes(storedUser)) {
          setSelectedUser(storedUser);
          setCurrentPage('addAttempt');
        }
      }
      setLoadingUsers(false);
    };
    fetchUsers();
  }, []);

  // Fetch attempts for selected user_name
  useEffect(() => {
    if (!selectedUser) {
      setAttempts([]);
      localStorage.removeItem('selectedBreadUserName');
      return;
    }

    const fetchAttempts = async () => {
      setLoadingAttempts(true);
      const { data, error } = await supabase
        .from('bread_attempts')
        .select('*')
        .eq('user_name', selectedUser)
        .order('date', { ascending: false });

      if (error) {
        console.error('Error fetching attempts:', error);
        setAttempts([]);
      } else {
        setAttempts(data);
        localStorage.setItem('selectedBreadUserName', selectedUser);
      }
      setLoadingAttempts(false);
    };

    fetchAttempts();
  }, [selectedUser]);

  // Add new user by just setting the selectedUser (no users table)
  const handleAddUser = (userName) => {
    if (!users.includes(userName)) {
      setUsers([...users, userName]);
    }
    setSelectedUser(userName);
    setCurrentPage('addAttempt');
  };

  const handleSelectUser = (userName) => {
    if (users.includes(userName)) {
      setSelectedUser(userName);
      setCurrentPage('addAttempt');
    }
  };

  // Add a new attempt for the selected user_name
  const handleAddAttempt = async (newAttempt) => {
    if (!selectedUser) return;

    const attemptToInsert = {
      ...newAttempt,
      user_name: selectedUser,
    };

    const { data, error } = await supabase
      .from('bread_attempts')
      .insert([attemptToInsert])
      .select()
      .single();

    if (error) {
      console.error('Error adding attempt:', error);
      return;
    }

    setAttempts(prev => [data, ...prev]);
    setCurrentPage('viewAttempts');
  };

  // Edit attempt score
  const handleEditAttempt = async (id, newScore) => {
    const { data, error } = await supabase
      .from('bread_attempts')
      .update({ score: newScore })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating attempt:', error);
      return;
    }

    setAttempts(attempts.map(attempt =>
      attempt.id === id ? data : attempt
    ));
  };

  const handleBackToUserSelection = () => {
    setSelectedUser(null);
    setCurrentPage('userSelection');
  };

  const bestAttempt = attempts.length > 0
    ? attempts.reduce((prev, current) => (prev.score > current.score ? prev : current))
    : null;

  const lastAttempt = attempts.length > 0
    ? attempts.reduce((prev, current) => (new Date(prev.date) > new Date(current.date) ? prev : current))
    : null;

  if (loadingUsers) {
    return <div className="text-center p-6">Loading users...</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 via-pink-100 to-yellow-100 font-sans antialiased flex flex-col items-center justify-start p-6">
      <div className="w-full max-w-3xl bg-white rounded-xl shadow-lg p-6">
        {!selectedUser && (
          <BreadUserSelector
            users={users}
            selectedUser={selectedUser}
            onSelectUser={handleSelectUser}
            onAddUser={handleAddUser}
          />
        )}

        {selectedUser && (
          <>
            <div className="flex justify-between items-center mb-4">
              <BreadHeader currentPage={currentPage} setCurrentPage={setCurrentPage} />
              <button
                onClick={handleBackToUserSelection}
                className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition"
              >
                Canviar Usuari
              </button>
            </div>

            <main className="min-h-[60vh]">
              {loadingAttempts ? (
                <div>Loading attempts...</div>
              ) : (
                <>
                  {currentPage === 'addAttempt' && (
                    <BreadAddAttemptForm onAddAttempt={handleAddAttempt} />
                  )}

                  {currentPage === 'viewAttempts' && (
                    <BreadViewAttempts attempts={attempts} onEditAttempt={handleEditAttempt} />
                  )}

                  {currentPage === 'summary' && (
                    <>
                      <BreadSummaryTable attempts={attempts} />
                      <BreadAIRecommendations bestAttempt={bestAttempt} lastAttempt={lastAttempt} />
                    </>
                  )}
                </>
              )}
            </main>
          </>
        )}
      </div>
    </div>
  );
};

export default App;

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
  const [users, setUsers] = useState([]); // array of user_name strings
  const [selectedUser, setSelectedUser] = useState(null);
  const [attempts, setAttempts] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [loadingAttempts, setLoadingAttempts] = useState(false);

  // 1. Carregar usuaris únics de Supabase
  useEffect(() => {
    async function fetchUsers() {
      setLoadingUsers(true);
      const { data, error } = await supabase
        .from('bread_attempts')
        .select('user_name', { count: 'exact', head: false })
        .neq('user_name', null);

      if (error) {
        console.error('Error fetching users:', error);
        setUsers([]);
      } else {
        const uniqueUsers = [...new Set(data.map(item => item.user_name))];
        setUsers(uniqueUsers);

        // Si tenim usuari guardat a localStorage i existeix, seleccionar-lo
        const storedUser = localStorage.getItem('selectedBreadUserName');
        if (storedUser && uniqueUsers.includes(storedUser)) {
          setSelectedUser(storedUser);
          setCurrentPage('addAttempt');
        }
      }
      setLoadingUsers(false);
    }
    fetchUsers();
  }, []);

  // 2. Carregar intents per usuari seleccionat
  useEffect(() => {
    if (!selectedUser) {
      setAttempts([]);
      localStorage.removeItem('selectedBreadUserName');
      return;
    }

    async function fetchAttempts() {
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
    }
    fetchAttempts();
  }, [selectedUser]);

  // Afegir usuari (simplement afegim el nom i el seleccionem)
  const handleAddUser = (userName) => {
    if (!users.includes(userName)) {
      setUsers([...users, userName]);
    }
    setSelectedUser(userName);
    setCurrentPage('addAttempt');
  };

  // Seleccionar usuari existent
  const handleSelectUser = (userName) => {
    if (users.includes(userName)) {
      setSelectedUser(userName);
      setCurrentPage('addAttempt');
    }
  };

  // Afegir un nou intent a Supabase
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

  // Editar score d’un intent a Supabase
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

    setAttempts(attempts.map(attempt => attempt.id === id ? data : attempt));
  };

  const handleBackToUserSelection = () => {
    setSelectedUser(null);
    setCurrentPage('userSelection');
  };

  const bestAttempt = attempts.length > 0
    ? attempts.reduce((prev, curr) => prev.score > curr.score ? prev : curr)
    : null;

  const lastAttempt = attempts.length > 0
    ? attempts.reduce((prev, curr) => new Date(prev.date) > new Date(curr.date) ? prev : curr)
    : null;

  if (loadingUsers) {
    return <div className="text-center p-6">Carregant usuaris...</div>;
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
                <div>Carregant intents...</div>
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

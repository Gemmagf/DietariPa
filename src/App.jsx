import React, { useState, useEffect } from 'react';
import BreadHeader from './components/BreadHeader';
import BreadAddAttemptForm from './components/BreadAddAttemptForm';
import BreadViewAttempts from './components/BreadViewAttempts';
import BreadSummaryTable from './components/BreadSummaryTable';
import BreadAIRecommendations from './components/BreadAIRecommendations';
import BreadUserSelector from './components/BreadUserSelector'; // Importar el nuevo componente
import { supabase } from './utils/supabaseClient'// 

const App = () => {
  const [currentPage, setCurrentPage] = useState('userSelection'); // Estado inicial para la selección de usuario
  const [attempts, setAttempts] = useState([]);
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      const { data, error } = await supabase
        .from('bread_attempts')
        .select('user_name');

      if (error) {
        console.error('Error loading users from Supabase:', error);
        return;
      }

      const uniqueUserNames = [...new Set(data.map(item => item.user_name))];
      const usersList = uniqueUserNames.map((name, index) => ({ id: index + 1, name }));
      setUsers(usersList);

      // Recuperar usuari anterior guardat al navegador (opcional)
      const lastUserName = localStorage.getItem('selectedBreadUser');
      if (lastUserName) {
        const user = usersList.find(u => u.name === lastUserName);
        if (user) {
          setSelectedUser(user);
          setCurrentPage('addAttempt');
        }
      }
    };

    fetchUsers();
  }, []);
  

  useEffect(() => {
    if (!selectedUser) {
      setAttempts([]);
      return;
    }

    const fetchAttempts = async () => {
      const { data, error } = await supabase
        .from('bread_attempts')
        .select('*')
        .eq('user_name', selectedUser.name)
        .order('date', { ascending: true });

      if (error) {
        console.error('Error loading attempts from Supabase:', error);
        return;
      }

      setAttempts(data);
      localStorage.setItem('selectedBreadUser', selectedUser.name);
    };

    fetchAttempts();
  }, [selectedUser]);
  
  const handleAddUser = (userName) => {
    const newUser = {
      id: users.length + 1,
      name: userName
    };
    setUsers([...users, newUser]);
    setSelectedUser(newUser);
    setCurrentPage('addAttempt');
  };

  const handleSelectUser = (userId) => {
    const user = users.find(u => u.id === userId);
    setSelectedUser(user);
    setCurrentPage('addAttempt');
  };

  const handleAddAttempt = async (newAttempt) => {
    const attemptToInsert = {
      ...newAttempt,
      user_name: selectedUser.name,
    };

    const { data, error } = await supabase
      .from('bread_attempts')
      .insert([attemptToInsert])
      .select();

    if (error) {
      console.error('Error saving attempt:', error);
      return;
    }

    setAttempts([...attempts, data[0]]);
    setCurrentPage('viewAttempts');
  };

  const handleEditAttempt = async (id, newScore) => {
    const { data, error } = await supabase
      .from('bread_attempts')
      .update({ score: newScore })
      .eq('id', id)
      .select();

    if (error) {
      console.error('Error updating attempt score:', error);
      return;
    }

    setAttempts(attempts.map(attempt =>
      attempt.id === id ? data[0] : attempt
    ));
  };

  const bestAttempt = attempts.length > 0
    ? attempts.reduce((prev, current) => (prev.score > current.score ? prev : current))
    : null;

  const lastAttempt = attempts.length > 0
    ? attempts.reduce((prev, current) => (new Date(prev.date) > new Date(current.date) ? prev : current))
    : null;

  return (
    <div className="min-h-screen bg-gray-100 font-sans antialiased">
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
          <BreadHeader currentPage={currentPage} setCurrentPage={setCurrentPage} />
          <main className="container mx-auto p-4">
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
          </main>
        </>
      )}
    </div>
  );
};

export default App;


// DONE
import React, { useState, useEffect } from 'react';
import BreadHeader from './components/BreadHeader';
import BreadAddAttemptForm from './components/BreadAddAttemptForm';
import BreadViewAttempts from './components/BreadViewAttempts';
import BreadSummaryTable from './components/BreadSummaryTable';
import BreadAIRecommendations from './components/BreadAIRecommendations';
import BreadUserSelector from './components/BreadUserSelector';
import { getStorage, setStorage, getNextId } from './utils/storage';

const App = () => {
  const [currentPage, setCurrentPage] = useState('userSelection');
  const [attempts, setAttempts] = useState([]);
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {
    const storedUsers = getStorage('breadUsers', []);
    setUsers(storedUsers);

    const storedSelectedUserId = getStorage('selectedBreadUserId', null);
    if (storedSelectedUserId) {
      const user = storedUsers.find(u => u.id === storedSelectedUserId);
      if (user) {
        setSelectedUser(user);
        setCurrentPage('addAttempt');
      }
    }
  }, []);

  useEffect(() => {
    if (selectedUser) {
      const storedAttempts = getStorage(`breadAttempts_user_${selectedUser.id}`, []);
      setAttempts(storedAttempts);
      setStorage('selectedBreadUserId', selectedUser.id);
    } else {
      setAttempts([]);
      setStorage('selectedBreadUserId', null);
    }
  }, [selectedUser]);

  useEffect(() => {
    if (selectedUser) {
      setStorage(`breadAttempts_user_${selectedUser.id}`, attempts);
    }
  }, [attempts, selectedUser]);

  useEffect(() => {
    setStorage('breadUsers', users);
  }, [users]);

  const handleAddUser = (userName) => {
    const newUserId = getNextId(users);
    const newUser = { id: newUserId, name: userName };
    setUsers([...users, newUser]);
    setSelectedUser(newUser);
    setCurrentPage('addAttempt');
  };

  const handleSelectUser = (userId) => {
    const user = users.find(u => u.id === userId);
    setSelectedUser(user);
    setCurrentPage('addAttempt');
  };

  const handleAddAttempt = (newAttempt) => {
    const id = getNextId(attempts);
    setAttempts([...attempts, { ...newAttempt, id, userId: selectedUser.id }]);
    setCurrentPage('viewAttempts');
  };

  const handleEditAttempt = (id, newScore) => {
    setAttempts(
      attempts.map(attempt =>
        attempt.id === id ? { ...attempt, score: newScore } : attempt
      )
    );
  };

  const handleBackToUserSelection = () => {
    setSelectedUser(null);
    setCurrentPage('userSelection');
  };

  const bestAttempt =
    attempts.length > 0
      ? attempts.reduce((prev, current) =>
          prev.score > current.score ? prev : current
        )
      : null;

  const lastAttempt =
    attempts.length > 0
      ? attempts.reduce((prev, current) =>
          new Date(prev.date) > new Date(current.date) ? prev : current
        )
      : null;

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
    </div>
  );
};

export default App;

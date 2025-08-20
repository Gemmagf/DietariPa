import React, { useState, useEffect } from 'react';
import BreadHeader from './components/BreadHeader';
import BreadAddAttemptForm from './components/BreadAddAttemptForm';
import BreadViewAttempts from './components/BreadViewAttempts';
import BreadSummaryTable from './components/BreadSummaryTable';
import BreadAIRecommendations from './components/BreadAIRecommendations';
import BreadUserSelector from './components/BreadUserSelector';
import { getStorage, setStorage, getNextId } from './utils/storage';

const defaultUsers = [
  { id: 1, name: 'Gemma Gardela' },
  { id: 2, name: 'Alex Bevilacqua' },
];

const defaultAttempts = [
  // Gemma Gardela
  {
    id: 1,
    userId: 1,
    date: '2025-02-08',
    title: 'Primer Intent - Pa rodó de mig',
    recipe: '500 g de farina (50% espelta, 50% blat)\n325 g d’aigua...\n10 g de sal\n1 cullerada de massa mare',
    process: 'Autòlisi (1h)... No vaig preescalfar l’olla.',
    result: 'Bon gust, però pa molt pla i sense volum.',
    score: 1,
  },
  {
    id: 2,
    userId: 1,
    date: '2025-02-10',
    title: 'Segon Intent - Amb olives',
    recipe: 'Mateixa recepta amb meitat quantitats i olives.',
    process: 'Massa fluixa, no vaig preescalfar.',
    result: 'Bon gust, però pa molt pla de nou.',
    score: 2,
  },
  {
    id: 3,
    userId: 1,
    date: '2025-02-10',
    title: 'Tercer Intent - Pa de 125 g',
    recipe: '125 g farina, 80 g aigua, 2 g sal, 10 g massa mare',
    process: 'Autòlisi 30min, fermentació bloc, shaping i nevera',
    result: 'Forats grans a dalt, dens a baix. Cal millor shaping.',
    score: 2,
  },
  {
    id: 4,
    userId: 1,
    date: '2025-02-11',
    title: 'Quart Intent - Pa de 250 g',
    recipe: 'Mateixa recepta anterior',
    process: 'Fermentació bloc i freda, cocció amb cassola preescalfada',
    result: 'Molla irregular, textura humida.',
    score: 2,
  },
  {
    id: 5,
    userId: 1,
    date: '2025-02-14',
    title: 'Cinquè intent - Pa rodó de mig',
    recipe: '250 g farina, 145 g aigua, 4 g sal, 20 g massa mare',
    process: 'Fermentació 4h + freda 23h + forn 250°C',
    result: 'Molla densa amb forats grans centrals.',
    score: 4,
  },
  {
    id: 6,
    userId: 1,
    date: '2025-02-15',
    title: 'Setè Intent - Pa de 500 g + Antonia',
    recipe: '250 g farina, 170 g aigua, 4 g sal, 3 cullerades massa mare',
    process: 'Fermentació bloc, shaping correcte, massa a la nevera.',
    result: 'Encara a la nevera. Prometedor.',
    score: 4,
  },
  {
    id: 7,
    userId: 1,
    date: '2025-02-17',
    title: 'Vuitè Intent - Pa de Massa Mare (ABC News)',
    recipe: '175 g farina, 25 g integral, 22.5 g massa mare, 150 g aigua, 4 g sal',
    process: '2 dies, fermentació a temperatura ambient i forn amb vapor',
    result: 'Bona expansió, molla densa amb forats grans irregulars.',
    score: 5,
  },
  {
    id: 8,
    userId: 1,
    date: '2025-02-20',
    title: 'Desè Intent - Versió ajustada (Pa de 300 g)',
    recipe: '300 g farina, 110 g massa mare, 210 g aigua, 10 g oli, 3.5 g sal',
    process: 'Autòlisi, plegats, fermentació i forn Dutch oven',
    result: 'Crosta daurada, molla uniforme. Molt bon resultat.',
    score: 5,
  },
  // Alex Bevilacqua
  {
    id: 9,
    userId: 2,
    date: '2025-03-01',
    title: 'Primer Intent - Pa rústic ràpid',
    recipe: '200 g farina, 130 g aigua, 4 g sal, 15 g massa mare',
    process: 'Tot barrejat ràpid, fermentació curta',
    result: 'Massa poc fermentada, gust pla.',
    score: 2,
  },
  {
    id: 10,
    userId: 2,
    date: '2025-03-03',
    title: 'Segon Intent - Millora fermentació',
    recipe: '200 g farina, 135 g aigua, 4 g sal, 20 g massa mare',
    process: 'Reposat llarg, bon shaping i forn preescalfat',
    result: 'Molla airejada i crosta cruixent. Molt satisfactori.',
    score: 5,
  },
  {
  id: 11,
  userId: 2,
  date: '2025-03-05',
  title: 'Tercer Intent - Pa integral',
  recipe: '200 g farina integral, 130 g aigua, 4 g sal, 15 g massa mare',
  process: 'Fermentació llarga 12h, forn preescalfat',
  result: 'Bona molla i crosta cruixent',
  score: 4
}


];

const App = () => {
  const [currentPage, setCurrentPage] = useState('userSelection');
  const [attempts, setAttempts] = useState([]);
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);

  // Carrega inicial d'usuaris i intents si no existeixen
  useEffect(() => {
    let storedUsers = getStorage('breadUsers', []);
    if (storedUsers.length === 0) {
      storedUsers = defaultUsers;
      setStorage('breadUsers', storedUsers);
    }
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

  // Carrega intents d’usuari o inicialitza si cal
  useEffect(() => {
    if (selectedUser) {
      const key = `breadAttempts_user_${selectedUser.id}`;
      let storedAttempts = getStorage(key, []);
      if (storedAttempts.length === 0) {
        const defaultForUser = defaultAttempts.filter(a => a.userId === selectedUser.id);
        setStorage(key, defaultForUser);
        storedAttempts = defaultForUser;
      }
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
    setAttempts(attempts.map(attempt =>
      attempt.id === id ? { ...attempt, score: newScore } : attempt
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

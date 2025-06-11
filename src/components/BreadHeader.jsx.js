import React from 'react';

const BreadHeader = ({ currentPage, setCurrentPage }) => {
  const getButtonClass = (pageName) => {
    return `px-4 py-2 rounded-lg transition-all duration-300 ${
      currentPage === pageName
        ? 'bg-black text-white shadow-lg'
        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
    }`;
  };

  return (
    <header className="w-full p-4 bg-white shadow-md flex flex-col md:flex-row justify-between items-center sticky top-0 z-10">
      <h1 className="text-3xl font-bold text-gray-800 mb-4 md:mb-0">🍞 Dietari de Pa</h1>
      <nav className="flex flex-wrap justify-center gap-3">
        <button
          onClick={() => setCurrentPage('addAttempt')}
          className={getButtonClass('addAttempt')}
        >
          📥 Afegir Intent
        </button>
        <button
          onClick={() => setCurrentPage('viewAttempts')}
          className={getButtonClass('viewAttempts')}
        >
          📜 Consultar Intents
        </button>
        <button
          onClick={() => setCurrentPage('summary')}
          className={getButtonClass('summary')}
        >
          📊 Resum
        </button>
      </nav>
    </header>
  );
};

export default BreadHeader;
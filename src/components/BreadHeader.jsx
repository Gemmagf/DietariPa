import React from 'react';

const BreadHeader = ({ currentPage, setCurrentPage }) => (
  <header className="bg-white shadow p-4 mb-4 flex justify-between">
    <h1 className="text-xl font-bold">Dietari de Pa</h1>
    <nav>
      <button onClick={() => setCurrentPage('addAttempt')}>Nou Intent</button>
      <button onClick={() => setCurrentPage('viewAttempts')}>Veure</button>
      <button onClick={() => setCurrentPage('summary')}>Resum</button>
    </nav>
  </header>
);

export default BreadHeader;
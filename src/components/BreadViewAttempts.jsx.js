import React from 'react';
import BreadAttemptCard from './BreadAttemptCard';
import BreadStarRating from './BreadStarRating';

const BreadViewAttempts = ({ attempts, onEditAttempt }) => {
  const sortedAttempts = [...attempts].sort((a, b) => new Date(b.date) - new Date(a.date));
  const bestAttempt = attempts.length > 0
    ? attempts.reduce((prev, current) => (prev.score > current.score ? prev : current))
    : null;

  return (
    <div className="p-6 max-w-3xl mx-auto my-8">
      <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">📜 Els teus intents de pa</h2>

      {bestAttempt && (
        <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-800 p-4 rounded-lg shadow-md mb-6">
          <h3 className="font-bold text-xl mb-2">🏆 Millor Pa: {bestAttempt.name}</h3>
          <div className="flex items-center mb-2">
            <BreadStarRating rating={bestAttempt.score} editable={false} />
            <span className="ml-2 text-lg">({bestAttempt.date})</span>
          </div>
          <p className="text-sm">Ingredients: {bestAttempt.ingredients}</p>
          <p className="text-sm">Tècniques: {bestAttempt.techniques}</p>
        </div>
      )}

      {sortedAttempts.length === 0 ? (
        <p className="text-center text-gray-600 text-lg">Encara no hi ha intents registrats. Afegeix el teu primer pa!</p>
      ) : (
        <div className="space-y-4">
          {sortedAttempts.map((attempt) => (
            <BreadAttemptCard key={attempt.id} attempt={attempt} onEditAttempt={onEditAttempt} />
          ))}
        </div>
      )}
    </div>
  );
};

export default BreadViewAttempts;
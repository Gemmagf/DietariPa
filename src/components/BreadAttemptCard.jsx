import React from 'react';
import BreadStarRating from './BreadStarRating';

const BreadAttemptCard = ({ attempt, onEditAttempt }) => {
  return (
    <div className="border p-4 rounded-lg shadow-sm bg-white">
      <h4 className="font-semibold text-lg mb-1">{attempt.title}</h4>
      <div className="flex items-center mb-2">
        <BreadStarRating
          rating={attempt.score}
          editable={true}
          onChange={(newScore) => onEditAttempt(attempt.id, newScore)}
        />
        <span className="ml-2 text-sm text-gray-600">{attempt.date}</span>
      </div>
      <p className="text-sm"><strong>Ingredients:</strong> {attempt.recipe}</p>
      <p className="text-sm"><strong>Tècniques:</strong> {attempt.process}</p>
      <p className="text-sm"><strong>Resultat:</strong> {attempt.result}</p>
    </div>
  );
};

export default BreadAttemptCard;

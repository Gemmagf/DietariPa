import React from 'react';

const BreadAIRecommendations = ({ bestAttempt, lastAttempt }) => (
  <div>
    <h3 className="text-md font-semibold">Suggeriments</h3>
    {bestAttempt && (
      <p><strong>Millor Intent:</strong> {bestAttempt.date} amb puntuació {bestAttempt.score}</p>
    )}
    {lastAttempt && (
      <p><strong>Últim Intent:</strong> {lastAttempt.date} amb puntuació {lastAttempt.score}</p>
    )}
  </div>
);

export default BreadAIRecommendations;
import React from 'react';

const BreadViewAttempts = ({ attempts, onEditAttempt }) => (
  <div>
    <h2 className="text-lg font-bold mb-2">Intents Anteriors</h2>
    {attempts.map(attempt => (
      <div key={attempt.id} className="border p-2 mb-2">
        <p><strong>Data:</strong> {attempt.date}</p>
        <p><strong>Recepta:</strong> {attempt.recipe}</p>
        <p><strong>Observacions:</strong> {attempt.notes}</p>
        <p><strong>Puntuació:</strong> {attempt.score}</p>
      </div>
    ))}
  </div>
);

export default BreadViewAttempts;
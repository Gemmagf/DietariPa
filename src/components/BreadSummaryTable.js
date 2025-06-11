import React from 'react';
import BreadStarRating from './BreadStarRating';

const BreadSummaryTable = ({ attempts }) => {
  return (
    <div className="p-6 bg-white rounded-xl shadow-lg max-w-4xl mx-auto my-8 overflow-x-auto">
      <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">📊 Resum de tots els intents</h2>
      {attempts.length === 0 ? (
        <p className="text-center text-gray-600 text-lg">No hi ha dades per mostrar al resum.</p>
      ) : (
        <table className="min-w-full bg-white border border-gray-200 rounded-lg">
          <thead>
            <tr className="bg-gray-100 text-left text-gray-600 uppercase text-sm leading-normal">
              <th className="py-3 px-6 border-b border-gray-200">Data</th>
              <th className="py-3 px-6 border-b border-gray-200">Nom</th>
              <th className="py-3 px-6 border-b border-gray-200">Ingredients</th>
              <th className="py-3 px-6 border-b border-gray-200">Tècniques</th>
              <th className="py-3 px-6 border-b border-gray-200">Puntuació</th>
            </tr>
          </thead>
          <tbody className="text-gray-700 text-sm font-light">
            {attempts.map((attempt) => (
              <tr key={attempt.id} className="border-b border-gray-200 hover:bg-gray-50">
                <td className="py-3 px-6 whitespace-nowrap">{attempt.date}</td>
                <td className="py-3 px-6">{attempt.name}</td>
                <td className="py-3 px-6 max-w-xs overflow-hidden text-ellipsis whitespace-nowrap">{attempt.ingredients}</td>
                <td className="py-3 px-6 max-w-xs overflow-hidden text-ellipsis whitespace-nowrap">{attempt.techniques}</td>
                <td className="py-3 px-6">
                  <BreadStarRating rating={attempt.score} editable={false} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default BreadSummaryTable;
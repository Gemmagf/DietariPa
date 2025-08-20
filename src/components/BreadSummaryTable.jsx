import React from 'react';

const BreadSummaryTable = ({ attempts }) => {
  if (attempts.length === 0) return <p className="text-center text-gray-600">Encara no hi ha intents per mostrar.</p>;

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white border rounded-lg shadow-sm">
        <thead className="bg-gray-100">
          <tr>
            <th className="py-2 px-4 border-b">Data</th>
            <th className="py-2 px-4 border-b">Títol</th>
            <th className="py-2 px-4 border-b">Ingredients</th>
            <th className="py-2 px-4 border-b">Tècniques</th>
            <th className="py-2 px-4 border-b">Resultat</th>
            <th className="py-2 px-4 border-b">Puntuació</th>
          </tr>
        </thead>
        <tbody>
          {attempts.map((a) => (
            <tr key={a.id} className="text-center">
              <td className="py-2 px-4 border-b">{a.date}</td>
              <td className="py-2 px-4 border-b">{a.title}</td>
              <td className="py-2 px-4 border-b">{a.recipe}</td>
              <td className="py-2 px-4 border-b">{a.process}</td>
              <td className="py-2 px-4 border-b">{a.result}</td>
              <td className="py-2 px-4 border-b">{a.score}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default BreadSummaryTable;

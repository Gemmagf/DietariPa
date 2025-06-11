import React from 'react';

const BreadSummaryTable = ({ attempts }) => (
  <table className="w-full border">
    <thead>
      <tr>
        <th>Data</th>
        <th>Score</th>
      </tr>
    </thead>
    <tbody>
      {attempts.map(a => (
        <tr key={a.id}>
          <td>{a.date}</td>
          <td>{a.score}</td>
        </tr>
      ))}
    </tbody>
  </table>
);

export default BreadSummaryTable;
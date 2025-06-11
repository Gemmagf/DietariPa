import React, { useState } from 'react';

const BreadUserSelector = ({ users, onSelectUser, onAddUser }) => {
  const [newUser, setNewUser] = useState('');

  return (
    <div className="p-4">
      <h2>Selecciona o crea un usuari</h2>
      <ul>
        {users.map(user => (
          <li key={user.id}>
            <button onClick={() => onSelectUser(user.id)}>{user.name}</button>
          </li>
        ))}
      </ul>
      <input
        type="text"
        value={newUser}
        onChange={(e) => setNewUser(e.target.value)}
        placeholder="Nom nou"
      />
      <button onClick={() => onAddUser(newUser)}>Afegir usuari</button>
    </div>
  );
};

export default BreadUserSelector;
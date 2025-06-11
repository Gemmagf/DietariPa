import React from 'react';

const BreadUserSelector = ({ users, selectedUser, onSelectUser, onAddUser }) => {
  const [newUserName, setNewUserName] = React.useState('');

  const handleAddUser = () => {
    if (newUserName.trim()) {
      onAddUser(newUserName.trim());
      setNewUserName('');
    }
  };

  return (
    <div className="p-6 bg-white rounded-xl shadow-lg max-w-md mx-auto my-8">
      <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">👨‍🍳 Selecciona el teu perfil de panader</h2>
      
      <div className="mb-4">
        <label htmlFor="user-select" className="block text-gray-700 font-medium mb-2">Usuari existent:</label>
        <select
          id="user-select"
          value={selectedUser ? selectedUser.id : ''}
          onChange={(e) => onSelectUser(parseInt(e.target.value))}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:outline-none transition"
        >
          <option value="">Selecciona un usuari</option>
          {users.map(user => (
            <option key={user.id} value={user.id}>{user.name}</option>
          ))}
        </select>
      </div>

      <div className="mb-6">
        <label htmlFor="new-user" className="block text-gray-700 font-medium mb-2">O crea un nou usuari:</label>
        <div className="flex gap-2">
          <input
            type="text"
            id="new-user"
            value={newUserName}
            onChange={(e) => setNewUserName(e.target.value)}
            placeholder="Nom del nou usuari"
            className="flex-grow px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:outline-none transition"
          />
          <button
            onClick={handleAddUser}
            className="bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors"
          >
            Crear
          </button>
        </div>
      </div>

      {selectedUser && (
        <p className="text-center text-lg text-gray-700 font-semibold">
          Usuari seleccionat: <span className="text-black">{selectedUser.name}</span>
        </p>
      )}
    </div>
  );
};

export default BreadUserSelector;
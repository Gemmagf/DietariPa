import React, { useState } from 'react';
import BreadStarRating from './BreadStarRating';

const BreadAddAttemptForm = ({ onAddAttempt }) => {
  const [date, setDate] = useState('');
  const [name, setName] = useState('');
  const [ingredients, setIngredients] = useState('');
  const [techniques, setTechniques] = useState('');
  const [score, setScore] = useState(0);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!date || !name || !ingredients || !techniques || score === 0) {
      alert('Por favor, rellena todos los campos y asigna una puntuación.');
      return;
    }
    onAddAttempt({ date, name, ingredients, techniques, score });
    setDate('');
    setName('');
    setIngredients('');
    setTechniques('');
    setScore(0);
  };

  return (
    <div className="p-6 bg-white rounded-xl shadow-lg max-w-2xl mx-auto my-8">
      <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">📥 Afegir un nou intent de pa</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="date" className="block text-gray-700 font-medium mb-1">Data:</label>
          <input
            type="date"
            id="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:outline-none transition"
            required
          />
        </div>
        <div>
          <label htmlFor="name" className="block text-gray-700 font-medium mb-1">Nom del pa:</label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Ex: Pa de massa mare amb sèsam"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:outline-none transition"
            required
          />
        </div>
        <div>
          <label htmlFor="ingredients" className="block text-gray-700 font-medium mb-1">Ingredients:</label>
          <textarea
            id="ingredients"
            value={ingredients}
            onChange={(e) => setIngredients(e.target.value)}
            rows="3"
            placeholder="Ex: Farina de força, aigua, sal, massa mare, sèsam"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:outline-none transition resize-none"
            required
          ></textarea>
        </div>
        <div>
          <label htmlFor="techniques" className="block text-gray-700 font-medium mb-1">Tècniques:</label>
          <textarea
            id="techniques"
            value={techniques}
            onChange={(e) => setTechniques(e.target.value)}
            rows="3"
            placeholder="Ex: Autòlisi, plegats, fermentació en fred 24h, cocció en forn de llenya"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:outline-none transition resize-none"
            required
          ></textarea>
        </div>
        <div>
          <label className="block text-gray-700 font-medium mb-1">Puntuació:</label>
          <BreadStarRating rating={score} setRating={setScore} editable={true} />
        </div>
        <button
          type="submit"
          className="w-full bg-black text-white py-3 rounded-lg hover:bg-gray-800 transition-colors duration-300 text-lg font-semibold shadow-md"
        >
          Guardar Intent
        </button>
      </form>
    </div>
  );
};

export default BreadAddAttemptForm;
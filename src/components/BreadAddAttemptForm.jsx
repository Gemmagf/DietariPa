import React, { useState } from 'react';

const BreadAddAttemptForm = ({ onAddAttempt }) => {
  const [form, setForm] = useState({ date: '', recipe: '', notes: '', score: 0 });

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    onAddAttempt(form);
    setForm({ date: '', recipe: '', notes: '', score: 0 });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input name="date" type="date" value={form.date} onChange={handleChange} required />
      <textarea name="recipe" placeholder="Recepta" value={form.recipe} onChange={handleChange} required />
      <textarea name="notes" placeholder="Observacions" value={form.notes} onChange={handleChange} />
      <input name="score" type="number" min="0" max="10" value={form.score} onChange={handleChange} />
      <button type="submit">Afegir Intent</button>
    </form>
  );
};

export default BreadAddAttemptForm;
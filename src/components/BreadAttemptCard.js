import React, { useState } from 'react';
import BreadStarRating from './BreadStarRating';

const BreadAttemptCard = ({ attempt, onEditAttempt }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedScore, setEditedScore] = useState(attempt.score);

  const handleSaveEdit = () => {
    onEditAttempt(attempt.id, editedScore);
    setIsEditing(false);
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 mb-4 transition-all duration-300 hover:shadow-xl">
      <div className="flex justify-between items-center cursor-pointer" onClick={() => setIsExpanded(!isExpanded)}>
        <h3 className="text-xl font-semibold text-gray-800">{attempt.name}</h3>
        <div className="flex items-center">
          {isEditing ? (
            <BreadStarRating rating={editedScore} setRating={setEditedScore} editable={true} />
          ) : (
            <BreadStarRating rating={attempt.score} editable={false} />
          )}
          <span className="ml-4 text-gray-500 text-sm">({attempt.date})</span>
          <span className="ml-4 text-gray-500 text-2xl transform transition-transform duration-300">
            {isExpanded ? '▲' : '▼'}
          </span>
        </div>
      </div>

      {isExpanded && (
        <div className="mt-4 pt-4 border-t border-gray-200 space-y-3">
          <div>
            <p className="font-medium text-gray-700">Ingredients:</p>
            <p className="text-gray-600 whitespace-pre-wrap">{attempt.ingredients}</p>
          </div>
          <div>
            <p className="font-medium text-gray-700">Tècniques:</p>
            <p className="text-gray-600 whitespace-pre-wrap">{attempt.techniques}</p>
          </div>

          {isEditing ? (
            <div className="flex justify-end gap-2 mt-4">
              <button
                onClick={handleSaveEdit}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                Guardar
              </button>
              <button
                onClick={() => {
                  setIsEditing(false);
                  setEditedScore(attempt.score); // Reset score if cancelled
                }}
                className="px-4 py-2 bg-gray-400 text-white rounded-lg hover:bg-gray-500 transition-colors"
              >
                Cancel·lar
              </button>
            </div>
          ) : (
            <div className="flex justify-end mt-4">
              <button
                onClick={() => setIsEditing(true)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                ✏️ Editar Puntuació
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default BreadAttemptCard;
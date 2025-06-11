import React from 'react';

const BreadStarRating = ({ rating, setRating, editable = false }) => {
  const stars = [1, 2, 3, 4, 5];

  return (
    <div className="flex items-center">
      {stars.map((star) => (
        <span
          key={star}
          className={`text-3xl cursor-pointer transition-colors duration-200 ${
            star <= rating ? 'text-yellow-400' : 'text-gray-300'
          } ${editable ? 'hover:text-yellow-500' : ''}`}
          onClick={() => editable && setRating(star)}
        >
          ★
        </span>
      ))}
    </div>
  );
};

export default BreadStarRating;
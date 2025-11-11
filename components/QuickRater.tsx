import React, { useState } from 'react';
import StarIcon from './icons/StarIcon';

interface QuickRaterProps {
  songId: string;
  onRateSong: (songId: string, rating: number) => void;
  currentUserRating?: number;
}

const QuickRater: React.FC<QuickRaterProps> = ({ songId, onRateSong, currentUserRating }) => {
  const [hoverRating, setHoverRating] = useState(0);

  return (
    <div>
      <p className="text-xs text-gray-500 mb-1 h-4">
        {currentUserRating ? (
          <span className="text-cyan-400 font-medium">Your rating: {currentUserRating}</span>
        ) : 'Rate this track:'}
      </p>
      <div className="flex items-center" onMouseLeave={() => setHoverRating(0)}>
        {[...Array(10)].map((_, index) => {
          const ratingValue = index + 1;
          const isSelected = ratingValue <= (currentUserRating || 0);
          const isHovering = ratingValue <= hoverRating;

          return (
            <button
              key={ratingValue}
              onClick={() => onRateSong(songId, ratingValue)}
              onMouseEnter={() => setHoverRating(ratingValue)}
              className="p-0.5"
              aria-label={`Rate ${ratingValue} out of 10`}
            >
              <StarIcon 
                filled={isHovering || isSelected} 
                className={`w-4 h-4 transition-colors ${
                  isSelected && !isHovering ? '!text-cyan-500' : ''
                }`}
              />
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default QuickRater;
import React from 'react';
import StarIcon from './icons/StarIcon';

interface StarRatingDisplayProps {
  rating: number;
  totalStars?: number;
}

const StarRatingDisplay: React.FC<StarRatingDisplayProps> = ({ rating, totalStars = 5 }) => {
  const stars = [];
  for (let i = 1; i <= totalStars; i++) {
    let fillPercentage = 0;
    if (i <= rating) {
      fillPercentage = 100;
    } else if (i - 1 < rating && i > rating) {
      fillPercentage = (rating % 1) * 100;
    }

    stars.push(
      <div key={i} className="relative">
        <StarIcon filled={false} className="w-4 h-4 text-gray-600" />
        <div className="absolute top-0 left-0 h-full overflow-hidden" style={{ width: `${fillPercentage}%` }}>
          <StarIcon filled={true} className="w-4 h-4 text-yellow-400" />
        </div>
      </div>
    );
  }

  return <div className="flex">{stars}</div>;
};

export default StarRatingDisplay;

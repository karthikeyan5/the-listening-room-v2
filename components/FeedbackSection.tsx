import React from 'react';
import { Feedback } from '../types';

interface FeedbackSectionProps {
  feedback: Feedback[];
}

const FeedbackSection: React.FC<FeedbackSectionProps> = ({ feedback }) => {
  if (!feedback || feedback.length === 0) {
    return (
      <div className="mt-8 p-6 bg-slate-800/50 backdrop-blur-sm rounded-lg">
        <h3 className="text-xl font-bold mb-2 text-white">Expert Feedback</h3>
        <p className="text-gray-400">No feedback has been submitted for this track yet.</p>
      </div>
    );
  }

  const averageRating = feedback.reduce((acc, f) => acc + f.rating, 0) / feedback.length;

  return (
    <div className="mt-8 p-6 bg-slate-800/50 backdrop-blur-sm rounded-lg">
      <h3 className="text-xl font-bold mb-4 text-white">Expert Feedback ({feedback.length})</h3>
      
      <div className="flex items-center justify-between gap-2 mb-6 p-4 bg-slate-900/50 rounded-md">
        <span className="text-lg font-semibold">Average Rating:</span>
        <div className="flex items-baseline gap-1">
          <span className="text-3xl font-bold text-yellow-400">{averageRating.toFixed(1)}</span>
          <span className="text-base text-gray-400">/ 10</span>
        </div>
      </div>

      <div className="space-y-4 max-h-72 overflow-y-auto pr-2">
        {feedback.map((item, index) => (
          <div key={index} className="bg-slate-700/70 p-4 rounded-lg shadow">
            <div className="flex justify-between items-start">
              <p className="font-bold text-white">{item.expertName || 'Anonymous'}</p>
              <div className="flex items-baseline gap-1 font-semibold text-yellow-400">
                <span className="text-lg">{item.rating}</span>
                <span className="text-xs text-gray-400">/10</span>
              </div>
            </div>
            <p className="mt-2 text-gray-300 italic">"{item.comment}"</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FeedbackSection;
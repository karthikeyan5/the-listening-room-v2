import React, { useRef, useMemo } from 'react';
import { Song } from '../types';

interface FeedbackReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  songs: Song[];
}

const FeedbackReportModal: React.FC<FeedbackReportModalProps> = ({ isOpen, onClose, songs }) => {
  const modalRef = useRef<HTMLDivElement>(null);

  const allFeedback = useMemo(() => {
    if (!isOpen) return [];
    // FIX: Safely access optional 'feedback' property to prevent runtime errors.
    const feedbackWithSongTitle = songs.flatMap(song =>
      (song.feedback || []).map(f => ({ ...f, songTitle: song.title }))
    );
    // Sort by most recent timestamp first
    feedbackWithSongTitle.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
    return feedbackWithSongTitle;
  }, [songs, isOpen]);

  if (!isOpen) return null;

  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={handleOverlayClick}
    >
      <div
        ref={modalRef}
        className="bg-slate-800 rounded-lg shadow-xl w-full max-w-4xl p-6 border border-slate-700 flex flex-col h-[80vh]"
      >
        <h2 className="text-2xl font-bold text-white mb-4 flex-shrink-0">Expert Feedback Report</h2>
        
        <div className="flex-1 overflow-y-auto relative border border-slate-700 rounded-lg">
          {allFeedback.length > 0 ? (
            <table className="w-full text-sm text-left text-gray-300">
              <thead className="text-xs text-gray-400 uppercase bg-slate-900/70 sticky top-0 backdrop-blur-sm">
                <tr>
                  <th scope="col" className="px-6 py-3">Song Title</th>
                  <th scope="col" className="px-6 py-3">Expert Name</th>
                  <th scope="col" className="px-6 py-3">Rating</th>
                  <th scope="col" className="px-6 py-3">Comment</th>
                  <th scope="col" className="px-6 py-3">Date</th>
                </tr>
              </thead>
              <tbody>
                {allFeedback.map((feedback, index) => (
                  <tr key={`${feedback.id}-${index}`} className="border-b border-slate-700 hover:bg-slate-700/50">
                    <th scope="row" className="px-6 py-4 font-medium text-white whitespace-nowrap">{feedback.songTitle}</th>
                    <td className="px-6 py-4">{feedback.expertName}</td>
                    <td className="px-6 py-4 text-yellow-400 font-semibold">{feedback.rating}/10</td>
                    <td className="px-6 py-4">{feedback.comment}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{feedback.timestamp.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="text-gray-400 text-center p-8">No feedback has been collected yet.</p>
          )}
        </div>
        
        <div className="flex justify-end pt-6 flex-shrink-0">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-cyan-600 text-white rounded-md hover:bg-cyan-500 transition"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};

export default FeedbackReportModal;
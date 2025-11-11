
import React, { useRef } from 'react';
import { Song } from '../types';
import TrashIcon from './icons/TrashIcon';
import EyeIcon from './icons/EyeIcon';
import EyeOffIcon from './icons/EyeOffIcon';

interface ManageSongsModalProps {
  isOpen: boolean;
  onClose: () => void;
  songs: Song[];
  // FIX: Argument of type 'string' is not assignable to parameter of type 'number'. Changed songId to string.
  onDeleteSong: (songId: string) => void;
  // FIX: Argument of type 'string' is not assignable to parameter of type 'number'. Changed songId to string.
  onToggleVisibility: (songId: string) => void;
}

const ManageSongsModal: React.FC<ManageSongsModalProps> = ({ isOpen, onClose, songs, onDeleteSong, onToggleVisibility }) => {
  const modalRef = useRef<HTMLDivElement>(null);

  if (!isOpen) return null;

  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
      onClose();
    }
  };

  // FIX: Argument of type 'string' is not assignable to parameter of type 'number'. Changed songId to string.
  const handleDelete = (songId: string) => {
    if (window.confirm('Are you sure you want to permanently delete this track?')) {
        onDeleteSong(songId);
    }
  }

  return (
    <div
      className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={handleOverlayClick}
    >
      <div
        ref={modalRef}
        className="bg-slate-800 rounded-lg shadow-xl w-full max-w-lg p-6 border border-slate-700 flex flex-col"
      >
        <h2 className="text-2xl font-bold text-white mb-4">Manage Songs</h2>
        
        <div className="flex-1 overflow-y-auto max-h-[60vh] pr-2 space-y-2">
            {songs.length > 0 ? (
                songs.map(song => (
                    <div key={song.id} className="group flex items-center justify-between p-3 bg-slate-900/50 rounded-lg">
                        <div className="flex items-center gap-4 truncate">
                            <img src={song.coverArtUrl} alt={song.title} className="w-10 h-10 object-cover rounded-md flex-shrink-0" />
                            <div className="truncate">
                                <p className="font-semibold text-white truncate">{song.title}</p>
                                <p className="text-sm text-gray-400">{song.isUploaded ? 'Uploaded' : 'Default'}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-1 flex-shrink-0">
                            <button
                                onClick={() => onToggleVisibility(song.id)}
                                className={`p-2 rounded-full bg-slate-800/50 transition-all opacity-0 group-hover:opacity-100 ${
                                    song.isVisible 
                                    ? 'text-cyan-400 hover:bg-cyan-500/20' 
                                    : 'text-gray-500 hover:bg-gray-500/20'
                                }`}
                                aria-label={song.isVisible ? `Hide ${song.title}` : `Show ${song.title}`}
                                title={song.isVisible ? 'Visible (Click to hide)' : 'Hidden (Click to show)'}
                            >
                                {song.isVisible ? <EyeIcon /> : <EyeOffIcon />}
                            </button>

                            {song.isUploaded ? (
                            <button
                                    onClick={() => handleDelete(song.id)}
                                    className="p-2 rounded-full text-gray-400 bg-slate-800/50 hover:bg-red-500/30 hover:text-red-400 transition-all opacity-0 group-hover:opacity-100"
                                    aria-label={`Delete ${song.title}`}
                                >
                                    <TrashIcon />
                                </button>
                            ) : (
                                <button
                                    disabled
                                    className="p-2 rounded-full text-gray-600 cursor-not-allowed transition-all opacity-0 group-hover:opacity-100"
                                    title="Default songs cannot be deleted."
                                    aria-label="Cannot delete default song"
                                >
                                    <TrashIcon />
                                </button>
                            )}
                        </div>
                    </div>
                ))
            ) : (
                <p className="text-gray-400 text-center py-8">No songs in the library.</p>
            )}
        </div>
        
        <div className="flex justify-end pt-6">
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

export default ManageSongsModal;

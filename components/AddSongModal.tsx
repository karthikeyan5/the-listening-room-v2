
import React, { useRef } from 'react';
import { GDRIVE_SONG_FOLDER_NAME } from '../config';

interface AddSongModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AddSongModal: React.FC<AddSongModalProps> = ({ isOpen, onClose }) => {
  const modalRef = useRef<HTMLDivElement>(null);

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
        className="bg-slate-800 rounded-lg shadow-xl w-full max-w-lg p-6 border border-slate-700"
      >
        <h2 className="text-2xl font-bold text-white mb-4">How to Add Songs</h2>
        <div className="space-y-4 text-gray-300">
            <p>Your unreleased tracks are managed directly from Google Drive. Follow these steps to add new music to The Listening Room:</p>
            
            <ol className="list-decimal list-inside space-y-3 bg-slate-900/50 p-4 rounded-md">
                <li>
                    In your Google Drive, create a new folder named exactly: <br/>
                    <strong className="text-cyan-400 font-mono p-1 rounded">{GDRIVE_SONG_FOLDER_NAME}</strong>
                </li>
                <li>
                    Upload your audio files (e.g., <code className="text-gray-400">Starlight Static.mp3</code>) and their corresponding cover art (e.g., <code className="text-gray-400">Starlight Static.png</code>) into this folder. The names must match.
                </li>
                <li>
                    <span className="font-bold text-yellow-400">Most Important:</span> Right-click the folder, select "Share", and change the access to <strong className="text-white">"Anyone with the link"</strong>. This allows the app to securely read the files.
                </li>
                <li>
                    Once your files are uploaded and the folder is shared, they will appear here automatically. You may need to sign out and sign back in to see the changes.
                </li>
            </ol>
            
            <p className="text-xs text-gray-500 text-center pt-2">
              Managing your music is as simple as managing a folder. To remove a song, just delete it from your Google Drive folder.
            </p>
        </div>
          <div className="flex justify-end gap-3 pt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-cyan-600 text-white rounded-md hover:bg-cyan-500 transition"
            >
              Got it
            </button>
          </div>
      </div>
    </div>
  );
};

export default AddSongModal;
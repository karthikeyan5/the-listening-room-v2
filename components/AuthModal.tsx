
import React, { useState, useRef, useEffect } from 'react';
import LockIcon from './icons/LockIcon';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAuthenticate: (password: string) => boolean;
  authAction: 'add' | 'manage' | 'viewFeedback' | 'viewAnalytics' | null;
}

const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, onAuthenticate, authAction }) => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const modalRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      // Defer focus to allow for modal transition
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!password) {
      setError('Password is required.');
      return;
    }
    const success = onAuthenticate(password);
    if (!success) {
      setError('Incorrect password. Please try again.');
      setPassword(''); // Clear password field on failure
    } else {
      handleClose(); // On success, parent will open next modal
    }
  };

  const handleClose = () => {
    setPassword('');
    setError('');
    onClose();
  };

  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
      handleClose();
    }
  };

  const getActionText = () => {
    switch (authAction) {
      case 'add':
        return 'add a new track';
      case 'manage':
        return 'manage existing songs';
      case 'viewFeedback':
        return 'view the feedback report';
      case 'viewAnalytics':
        return 'view the analytics dashboard';
      default:
        return 'proceed';
    }
  };

  return (
    <div 
      className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={handleOverlayClick}
    >
      <div 
        ref={modalRef}
        className="bg-slate-800 rounded-lg shadow-xl w-full max-w-sm p-6 border border-slate-700"
      >
        <div className="flex flex-col items-center text-center">
          <div className="p-3 bg-slate-700 rounded-full mb-4">
            <LockIcon />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Admin Access</h2>
          <p className="text-gray-400 mb-6">Enter the password to {getActionText()}.</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="password-input" className="sr-only">Password</label>
            <input
              ref={inputRef}
              type="password"
              id="password-input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-slate-700 border border-slate-600 rounded-md py-2 px-3 text-white text-center placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500"
              placeholder="••••••••"
            />
          </div>
          
          {error && <p className="text-red-400 text-sm text-center h-5">{error}</p>}

          <div className="flex flex-col gap-3 pt-2">
            <button
              type="submit"
              className="w-full px-4 py-2 bg-cyan-600 text-white rounded-md hover:bg-cyan-500 transition disabled:bg-slate-500 disabled:cursor-not-allowed"
              disabled={!password}
            >
              Unlock
            </button>
            <button
              type="button"
              onClick={handleClose}
              className="w-full px-4 py-2 text-gray-300 rounded-md hover:bg-slate-700 transition"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AuthModal;

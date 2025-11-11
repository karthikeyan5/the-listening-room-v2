
import React from 'react';
import { signIn, signOut } from '../services/googleDriveService';
import GoogleIcon from './icons/GoogleIcon';

interface GoogleAuthProps {
  isLoaded: boolean;
  isAuthAvailable: boolean;
  isSignedIn: boolean;
  user: any;
  onSetupClick: () => void;
}

const GoogleAuth: React.FC<GoogleAuthProps> = ({ isLoaded, isAuthAvailable, isSignedIn, user, onSetupClick }) => {
  if (!isLoaded) {
    return (
      <div className="bg-slate-700/50 text-sm text-gray-300 px-4 py-2 rounded-full animate-pulse">
        Loading...
      </div>
    );
  }

  if (!isAuthAvailable) {
    return (
      <button 
        className="flex items-center gap-2 bg-slate-700/50 text-white px-4 py-2 rounded-full cursor-pointer hover:bg-slate-600/70" 
        title="Click to configure Google Drive integration."
        onClick={onSetupClick}
      >
        <GoogleIcon />
        <span className="text-sm font-medium text-gray-400">Setup Required</span>
      </button>
    );
  }

  if (isSignedIn && user) {
    const profile = user.getBasicProfile();
    return (
      <div className="flex items-center gap-3">
        <img
          src={profile.getImageUrl()}
          alt="User profile"
          className="w-8 h-8 rounded-full"
        />
        <button
          onClick={signOut}
          className="bg-slate-700/50 text-sm text-gray-300 px-4 py-2 rounded-full hover:bg-slate-600/70 transition"
        >
          Sign Out
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={signIn}
      className="flex items-center gap-2 bg-slate-700/50 text-white px-4 py-2 rounded-full hover:bg-slate-600/70 transition"
    >
      <GoogleIcon />
      <span className="text-sm font-medium">Sign in with Google</span>
    </button>
  );
};

export default GoogleAuth;

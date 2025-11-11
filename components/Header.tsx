import React from 'react';
import { ARTIST_NAME } from '../constants';

interface HeaderProps {
  albumTitle: string;
}

const Header: React.FC<HeaderProps> = ({ albumTitle }) => {
  return (
    <header className="bg-black/20 backdrop-blur-sm sticky top-0 z-10">
      <div className="container mx-auto px-4 md:px-8 py-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tighter text-white">
            {ARTIST_NAME} <span className="text-cyan-400">/ {albumTitle || ''}</span>
          </h1>
          <p className="text-gray-400">The Listening Room</p>
        </div>
      </div>
    </header>
  );
};

export default Header;

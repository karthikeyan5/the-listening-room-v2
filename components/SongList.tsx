
import React from 'react';
import { Song } from '../types';

interface SongListProps {
  songs: Song[];
  onSelectSong: (song: Song) => void;
  selectedSongId?: string | null;
  isLoading: boolean;
}

const SongList: React.FC<SongListProps> = ({ songs, onSelectSong, selectedSongId, isLoading }) => {
  if (isLoading) {
    return (
      <div className="space-y-3">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="w-full p-3 rounded-lg bg-slate-800/50 animate-pulse">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-slate-700 rounded-md"></div>
              <div>
                <div className="h-4 w-32 bg-slate-700 rounded"></div>
                <div className="h-3 w-24 bg-slate-700 rounded mt-2"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {songs.map(song => {
        return (
          <div
            key={song.id}
            onClick={() => onSelectSong(song)}
            className={`relative group w-full text-left p-3 rounded-lg transition-all duration-200 cursor-pointer ${
              selectedSongId === song.id 
                ? 'bg-cyan-500/20 ring-2 ring-cyan-400' 
                : 'bg-slate-800/50 backdrop-blur-sm hover:bg-slate-700/70'
            }`}
          >
            <div className="flex items-center gap-4">
              <img src={song.coverArtUrl} alt={song.title} className="w-12 h-12 object-cover rounded-md flex-shrink-0" />
              <div>
                <p className="font-semibold text-white">{song.title}</p>
                <p className="text-sm text-gray-400">{song.artist}</p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default SongList;
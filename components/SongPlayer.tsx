

import React, { useRef, useEffect, useState } from 'react';
import { Song } from '../types';
import PlayIcon from './icons/PlayIcon';
import PauseIcon from './icons/PauseIcon';
import PreviousIcon from './icons/PreviousIcon';
import NextIcon from './icons/NextIcon';

interface SongPlayerProps {
  song: Song;
  isPlaying: boolean;
  onPlayPause: () => void;
  onNextSong: () => void;
  onPreviousSong: () => void;
  songCount: number;
}

const SongPlayer: React.FC<SongPlayerProps> = ({ song, isPlaying, onPlayPause, onNextSong, onPreviousSong, songCount }) => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  // Format time from seconds to MM:SS
  const formatTime = (timeInSeconds: number): string => {
    if (isNaN(timeInSeconds) || timeInSeconds === 0) return '0:00';
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = Math.floor(timeInSeconds % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };
  
  // Effect for handling play/pause logic.
  // This is now robustly handles the race condition of playing a song before it's loaded.
  useEffect(() => {
    const audioElement = audioRef.current;
    if (!audioElement) return;

    const playAudio = () => {
      const playPromise = audioElement.play();
      if (playPromise !== undefined) {
        playPromise.catch(error => {
          // Ignore AbortError which can happen if user pauses before playback starts
          if (error.name !== 'AbortError') {
            console.error("Audio playback failed:", error);
          }
        });
      }
    };

    if (isPlaying) {
      // If the audio is already in a state where it can play, play it.
      // readyState 3 is HAVE_FUTURE_DATA, 4 is HAVE_ENOUGH_DATA
      if (audioElement.readyState >= 3) {
        playAudio();
      } else {
        // Otherwise, wait for the 'canplay' event.
        const handleCanPlay = () => playAudio();
        audioElement.addEventListener('canplay', handleCanPlay, { once: true });
        
        // Cleanup in case the component unmounts or song changes before 'canplay' fires.
        return () => {
          audioElement.removeEventListener('canplay', handleCanPlay);
        };
      }
    } else {
      audioElement.pause();
    }
  }, [isPlaying, song.id]);


  // Effect for updating time, duration, and handling the end of a song
  useEffect(() => {
    const audioElement = audioRef.current;
    if (!audioElement) return;

    const handleTimeUpdate = () => setCurrentTime(audioElement.currentTime);
    const handleLoadedMetadata = () => setDuration(audioElement.duration);
    
    // Reset state for new song
    setCurrentTime(0);
    setDuration(0);

    audioElement.addEventListener('timeupdate', handleTimeUpdate);
    audioElement.addEventListener('loadedmetadata', handleLoadedMetadata);
    audioElement.addEventListener('ended', onNextSong);

    // Clean up listeners
    return () => {
      audioElement.removeEventListener('timeupdate', handleTimeUpdate);
      audioElement.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audioElement.removeEventListener('ended', onNextSong);
    };
  }, [song.id, onNextSong]);

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (audioRef.current) {
      const newTime = Number(e.target.value);
      audioRef.current.currentTime = newTime;
      setCurrentTime(newTime);
    }
  };

  return (
    <div className="bg-slate-800/50 backdrop-blur-sm rounded-lg shadow-lg overflow-hidden p-6 flex flex-col sm:flex-row items-center gap-6">
      <audio 
        key={song.id} 
        ref={audioRef} 
        src={song.audioUrl} 
        preload="auto"
      />
      <img 
        src={song.coverArtUrl} 
        alt={`${song.title} cover art`} 
        className="w-32 h-32 sm:w-40 sm:h-40 object-cover rounded-md shadow-md flex-shrink-0"
      />
      <div className="flex-1 flex flex-col items-center sm:items-start text-center sm:text-left w-full">
        <h3 className="text-2xl font-bold text-white">{song.title}</h3>
        <p className="text-lg text-gray-400">{song.artist}</p>
        
        <div className="w-full mt-4 space-y-2">
           <input
            type="range"
            value={currentTime}
            max={duration || 0}
            onChange={handleSeek}
            className="w-full h-1 bg-gray-600 rounded-lg appearance-none cursor-pointer accent-cyan-500"
            aria-label="Song progress"
          />
          <div className="flex justify-between text-xs text-gray-400">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(duration)}</span>
          </div>

          <div className="flex items-center justify-center gap-6 pt-2">
            <button
              onClick={onPreviousSong}
              disabled={songCount <= 1}
              className="text-gray-300 hover:text-white transition disabled:text-gray-600 disabled:cursor-not-allowed"
              aria-label="Previous song"
            >
              <PreviousIcon />
            </button>

            <button
              onClick={onPlayPause}
              className="bg-cyan-500 hover:bg-cyan-600 text-white rounded-full p-4 transition-transform transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-cyan-400"
              aria-label={isPlaying ? 'Pause song' : 'Play song'}
            >
              {isPlaying ? <PauseIcon /> : <PlayIcon />}
            </button>

            <button
              onClick={onNextSong}
              disabled={songCount <= 1}
              className="text-gray-300 hover:text-white transition disabled:text-gray-600 disabled:cursor-not-allowed"
              aria-label="Next song"
            >
              <NextIcon />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SongPlayer;
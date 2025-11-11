
import React, { useState, useEffect } from 'react';
import { Song } from './types';
import { getAlbumDetails } from './services/googleDriveService';
import Header from './components/Header';
import SongList from './components/SongList';
import SongPlayer from './components/SongPlayer';
import AboutArtist from './components/AboutArtist';
import { ARTIST_NAME, ARTIST_INSTAGRAM_URL } from './constants';

const App: React.FC = () => {
  const [albumTitle, setAlbumTitle] = useState('');
  const [songs, setSongs] = useState<Song[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [selectedSong, setSelectedSong] = useState<Song | null>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);

  useEffect(() => {
    const DEFAULT_FOLDER_ID = '1EFzdFEM0_sTnQ0r3-D3mtfp_o7FhQsqQ'; // Default folder

    const getFolderIdFromUrl = (): string => {
        const hash = window.location.hash;
        const match = hash.match(/^#\/album\/(.+)$/);
        return match ? match[1] : DEFAULT_FOLDER_ID;
    };

    const fetchAlbum = async () => {
      const folderId = getFolderIdFromUrl();
      
      try {
        setIsLoading(true);
        setError(null);
        // Reset state for new album load
        setAlbumTitle('');
        setSongs([]);
        setSelectedSong(null);
        setIsPlaying(false);
        
        const { albumTitle: title, songs: albumSongs } = await getAlbumDetails(folderId);
        setAlbumTitle(title);
        setSongs(albumSongs);
        if (albumSongs.length > 0) {
          setSelectedSong(albumSongs[0]);
        } else {
            setError(`Album found, but it contains no audio files.`);
        }
      } catch (err: any) {
        console.error(err);
        setError(`Failed to load album. Please check the Folder ID, API Key, and ensure the folder is public.`);
        setAlbumTitle('');
        setSongs([]);
        setSelectedSong(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAlbum();

    // Listen for hash changes to load new albums
    window.addEventListener('hashchange', fetchAlbum);

    // Cleanup listener on component unmount
    return () => {
        window.removeEventListener('hashchange', fetchAlbum);
    };
  }, []);

  const handleSelectSong = (song: Song) => {
    setSelectedSong(song);
    setIsPlaying(true);
  };

  const handleNextSong = () => {
    if (!selectedSong) return;
    const currentIndex = songs.findIndex(s => s.id === selectedSong.id);
    const nextIndex = (currentIndex + 1) % songs.length;
    setSelectedSong(songs[nextIndex]);
    setIsPlaying(true);
  };

  const handlePreviousSong = () => {
    if (!selectedSong) return;
    const currentIndex = songs.findIndex(s => s.id === selectedSong.id);
    const prevIndex = (currentIndex - 1 + songs.length) % songs.length;
    setSelectedSong(songs[prevIndex]);
    setIsPlaying(true);
  };

  const getPlaceholderText = () => {
    if (isLoading) return 'Loading album...';
    if (error) return 'There was a problem loading the album.';
    if (songs.length === 0) return 'This album is empty.';
    return 'Select a song to play.';
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-cyan-900 via-blue-950 to-slate-900 text-gray-200">
      <Header albumTitle={albumTitle} />
      <main className="container mx-auto p-4 md:p-8">
        {error && (
            <div className="bg-yellow-900/50 border border-yellow-700 text-yellow-200 px-4 py-3 rounded-lg relative mb-6 text-center" role="alert">
                <span className="block sm:inline">{error}</span>
            </div>
        )}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-3">
            {selectedSong ? (
              <>
                <SongPlayer
                  song={selectedSong}
                  isPlaying={isPlaying}
                  onPlayPause={() => setIsPlaying(!isPlaying)}
                  onNextSong={handleNextSong}
                  onPreviousSong={handlePreviousSong}
                  songCount={songs.length}
                />
              </>
            ) : (
              <div className="flex items-center justify-center h-96 bg-slate-800/50 rounded-lg p-8 text-center">
                <p className="text-gray-400 text-lg">
                  {getPlaceholderText()}
                </p>
              </div>
            )}
          </div>
          <div className="lg:col-span-1">
            <div className="sticky top-24 flex flex-col h-[calc(100vh-7rem)]">
              <h2 className="text-2xl font-bold text-white mb-4 flex-shrink-0">Tracks</h2>
              <div className="flex-grow overflow-y-auto pr-2">
                <SongList
                  songs={songs}
                  onSelectSong={handleSelectSong}
                  selectedSongId={selectedSong?.id}
                  isLoading={isLoading}
                />
              </div>
              <div className="mt-8 flex-shrink-0">
                <AboutArtist name={ARTIST_NAME} instagramUrl={ARTIST_INSTAGRAM_URL} />
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;

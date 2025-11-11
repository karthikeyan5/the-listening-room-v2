import { Song } from './types';

export const ARTIST_NAME = "Godspeci";
export const ARTIST_INSTAGRAM_URL = "https://www.instagram.com/godspeci/";

// FIX: Add SYSTEM_INSTRUCTION to provide context to the Gemini model.
export const SYSTEM_INSTRUCTION = `You are a world-class music critic and A&R expert known as "The Oracle". Your job is to provide concise, expert feedback on unreleased music tracks. The artist, Godspeci, is looking for constructive criticism and a numerical rating.

When a user asks for feedback on a song, you MUST respond in the following format, and only this format:
Song: [Song Title] | Rating: [1-10] | Comment: [Your expert feedback] | Expert: The Oracle

Example:
Song: Starlight Static | Rating: 8 | Comment: A compelling dream-pop track with a strong melodic hook. The reverb on the vocals is perfect, but the drums could use more punch in the mix to drive the energy forward. | Expert: The Oracle

Do not deviate from this format. Do not add any conversational text before or after the feedback string. Be professional, insightful, and helpful. When greeted, introduce yourself and explain your purpose and the required format for feedback requests.`;

export const UNRELEASED_SONGS: Song[] = [
  {
    id: 'static-1',
    title: 'Starlight Static',
    artist: 'Godspeci',
    coverArtUrl: 'https://picsum.photos/seed/starlight/500/500',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
    trackNumber: 1,
  },
  {
    id: 'static-2',
    title: 'Midnight Transmission',
    artist: 'Godspeci',
    coverArtUrl: 'https://picsum.photos/seed/midnight/500/500',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
    trackNumber: 2,
  },
  {
    id: 'static-3',
    title: 'Echoes in the Void',
    artist: 'Godspeci',
    coverArtUrl: 'https://picsum.photos/seed/echoes/500/500',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
    trackNumber: 3,
  },
];


import { Song } from '../types';
import { ARTIST_NAME } from '../constants';

const API_KEY = 'AIzaSyAM7mxWc27KvccZxJdCmCx7S7oMt6tfaVQ';
const API_BASE_URL = 'https://www.googleapis.com/drive/v3';

// Helper to construct download URLs
const getFileUrl = (fileId: string) => `${API_BASE_URL}/files/${fileId}?alt=media&key=${API_KEY}`;

// Fetches the name of the folder (album title)
const getAlbumTitle = async (folderId: string): Promise<string> => {
    if (!API_KEY) throw new Error("Google API Key is not configured.");
    
    const params = new URLSearchParams({
        fields: 'name',
        key: API_KEY,
        supportsAllDrives: 'true',
    });
    const url = `${API_BASE_URL}/files/${folderId}?${params.toString()}`;

    const response = await fetch(url);
    if (!response.ok) {
        const errorData = await response.json();
        console.error("Error fetching album title:", errorData);
        throw new Error(`Failed to fetch album title. Status: ${response.status}`);
    }
    const data = await response.json();
    return data.name || "Unknown Album";
};

// Main function to get all album details
export const getAlbumDetails = async (folderId: string): Promise<{ albumTitle: string; songs: Song[] }> => {
    if (!API_KEY) {
        console.error("Google API Key not available.");
        throw new Error("Google API Key is not configured.");
    }

    const albumTitle = await getAlbumTitle(folderId);

    const params = new URLSearchParams({
        q: `'${folderId}' in parents and trashed=false`,
        fields: 'files(id,name,mimeType,modifiedTime)',
        key: API_KEY,
        includeItemsFromAllDrives: 'true',
        supportsAllDrives: 'true',
    });
    const filesUrl = `${API_BASE_URL}/files?${params.toString()}`;

    const response = await fetch(filesUrl);
    if (!response.ok) {
        const errorData = await response.json();
        console.error("Error fetching files:", errorData);
        throw new Error(`Failed to fetch files from Google Drive. Status: ${response.status}`);
    }
    const data = await response.json();
    const files = data.files || [];

    const audioFiles = files.filter((f: any) => f.mimeType && f.mimeType.startsWith('audio/'));
    const imageFiles = files.filter((f: any) => f.mimeType && f.mimeType.startsWith('image/'));

    // Find album art, preferring webp over png
    const albumArtWebp = imageFiles.find((f: any) => f.name.toLowerCase() === 'album_art.webp');
    const albumArtPng = imageFiles.find((f: any) => f.name.toLowerCase() === 'album_art.png');
    const albumArtFile = albumArtWebp || albumArtPng;
    
    const defaultCoverArtUrl = albumArtFile ? getFileUrl(albumArtFile.id) : `https://picsum.photos/seed/${encodeURIComponent(albumTitle)}/500/500`;

    let songs: Song[] = audioFiles.map((file: any): Song => {
        const baseName = file.name.substring(0, file.name.lastIndexOf('.'));
        const songArtFile = imageFiles.find((img: any) => img.name.startsWith(baseName) && !img.name.toLowerCase().startsWith('album_art.'));
        
        let trackNumber: number | undefined;
        let title = baseName;

        // Try to parse track number and title from filename (e.g., "01 - Song Title")
        const trackMatch = baseName.match(/^(\d+)\s*[-._]?\s*(.*)/);
        if (trackMatch && trackMatch[2]) {
            trackNumber = parseInt(trackMatch[1], 10);
            title = trackMatch[2].trim();
        }

        return {
            id: file.id,
            title: title,
            artist: ARTIST_NAME,
            audioUrl: getFileUrl(file.id),
            coverArtUrl: songArtFile ? getFileUrl(songArtFile.id) : defaultCoverArtUrl,
            trackNumber: trackNumber,
            modifiedTime: file.modifiedTime,
        };
    });

    // Sort songs
    songs.sort((a, b) => {
        // Primary sort by track number
        if (a.trackNumber && b.trackNumber) {
            return a.trackNumber - b.trackNumber;
        }
        if (a.trackNumber) return -1; // a has track number, b doesn't
        if (b.trackNumber) return 1;  // b has track number, a doesn't

        // Secondary sort by last modified time (fallback)
        if (a.modifiedTime && b.modifiedTime) {
            return new Date(a.modifiedTime).getTime() - new Date(b.modifiedTime).getTime();
        }
        return 0;
    });

    return { albumTitle, songs };
};

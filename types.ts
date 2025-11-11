export interface Song {
  id: string;
  title: string;
  artist: string;
  coverArtUrl: string;
  audioUrl: string;
  trackNumber?: number;
  modifiedTime?: string;
  isUploaded?: boolean;
  isVisible?: boolean;
}

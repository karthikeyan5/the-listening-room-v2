
// FIX: Added Feedback interface to be used across feedback-related components.
export interface Feedback {
  id: string;
  rating: number;
  comment: string;
  expertName: string;
  timestamp: Date;
}

// FIX: Added ChatMessage interface for the chat assistant component.
export interface ChatMessage {
  role: 'user' | 'model';
  content: string;
}

export interface Song {
  id: string;
  title: string;
  artist: string;
  coverArtUrl: string;
  audioUrl: string;
  trackNumber?: number;
  modifiedTime?: string;
  // FIX: Added optional properties to fix type errors in various components.
  // These properties are used in ManageSongsModal, FeedbackReportModal, and AnalyticsDashboardModal.
  feedback?: Feedback[];
  isUploaded?: boolean;
  isVisible?: boolean;
}

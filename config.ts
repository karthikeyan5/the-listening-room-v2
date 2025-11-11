// These credentials should be set up in your hosting environment's environment variables.
// The application will not work without them.
export const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY;
export const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;

// The scope for the Google Drive API. We only need read-only access.
export const GOOGLE_DRIVE_SCOPE = "https://www.googleapis.com/auth/drive.readonly";

// The name of the folder in Google Drive where the app will look for songs.
export const GDRIVE_SONG_FOLDER_NAME = "The Listening Room - Unreleased";
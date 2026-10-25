export interface Song {
  id: string;
  title: string;
  artist: string;
  artistId?: string;
  album: string;
  albumId?: string;
  duration: number; // in seconds
  durationFormatted: string;
  artworkUrl: string;
  audioUrl: string;
  genre: string;
  year?: number;
  playCount: number;
  isLiked?: boolean;
  lrcLyrics?: string;
  isLocal?: boolean;
}

export interface Artist {
  id: string;
  name: string;
  avatarUrl: string;
  heroUrl?: string;
  monthlyListeners: string;
  bio: string;
  topTrackIds: string[];
  albumIds: string[];
}

export interface Album {
  id: string;
  title: string;
  artist: string;
  artistId: string;
  year: number;
  artworkUrl: string;
  trackIds: string[];
}

export interface Playlist {
  id: string;
  title: string;
  description: string;
  coverUrl: string;
  trackIds: string[];
  isSystem?: boolean;
  createdAt: string;
}

export interface LyricsLine {
  time: number; // in seconds
  text: string;
  translation?: string;
  romanized?: string;
}

export interface EqualizerSettings {
  bass: number; // -12 to 12 dB
  lowMid: number;
  mid: number;
  highMid: number;
  treble: number;
  bassBoost: number; // 0 to 100
  normalization: boolean;
  preset: string;
}

export type PlayerStyle = 'm3_expressive' | 'vinyl' | 'glass' | 'card' | 'minimal';
export type AppThemeColor = 'indigo' | 'fuchsia' | 'emerald' | 'amber' | 'rose' | 'sky' | 'dynamic';
export type RepeatMode = 'off' | 'all' | 'one';
export type NavigationTab = 'home' | 'search' | 'library' | 'stats' | 'settings';

export interface HistoryItem {
  songId: string;
  playedAt: number; // timestamp
}

export interface ListeningStats {
  totalMinutes: number;
  totalPlays: number;
  topSongIds: string[];
  weeklyHours: { [day: string]: number };
}

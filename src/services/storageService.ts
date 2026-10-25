import { Playlist, Song, EqualizerSettings, PlayerStyle, AppThemeColor, HistoryItem, ListeningStats } from '../types/music';
import { INITIAL_PLAYLISTS, INITIAL_SONGS } from '../data/mockData';

const KEYS = {
  LIKED_SONGS: 'starbeetune_liked_ids',
  PLAYLISTS: 'starbeetune_playlists',
  HISTORY: 'starbeetune_history',
  STATS: 'starbeetune_stats',
  EQ: 'starbeetune_eq_settings',
  PLAYER_STYLE: 'starbeetune_player_style',
  THEME_COLOR: 'starbeetune_theme_color',
  OLED_MODE: 'starbeetune_oled_mode',
  LOCAL_SONGS: 'starbeetune_local_songs'
};

export const DEFAULT_EQ: EqualizerSettings = {
  bass: 0,
  lowMid: 0,
  mid: 0,
  highMid: 0,
  treble: 0,
  bassBoost: 0,
  normalization: true,
  preset: 'Flat'
};

export const EQ_PRESETS: { [name: string]: Partial<EqualizerSettings> } = {
  Flat: { bass: 0, lowMid: 0, mid: 0, highMid: 0, treble: 0, bassBoost: 0 },
  'Bass Boost': { bass: 7, lowMid: 4, mid: 0, highMid: -1, treble: 1, bassBoost: 45 },
  'Treble Boost': { bass: -2, lowMid: 0, mid: 2, highMid: 6, treble: 8, bassBoost: 0 },
  Electronic: { bass: 6, lowMid: 3, mid: -1, highMid: 4, treble: 5, bassBoost: 30 },
  Vocal: { bass: -2, lowMid: 1, mid: 6, highMid: 4, treble: 1, bassBoost: 0 },
  Acoustic: { bass: 3, lowMid: 2, mid: 1, highMid: 3, treble: 4, bassBoost: 10 },
  Rock: { bass: 5, lowMid: 3, mid: -2, highMid: 3, treble: 5, bassBoost: 20 },
  Classical: { bass: 3, lowMid: 1, mid: -1, highMid: 2, treble: 4, bassBoost: 0 }
};

export class StorageService {
  static getLikedSongIds(): Set<string> {
    try {
      const data = localStorage.getItem(KEYS.LIKED_SONGS);
      if (!data) {
        // Defaults from initial liked songs
        const initial = INITIAL_SONGS.filter(s => s.isLiked).map(s => s.id);
        return new Set(initial);
      }
      return new Set(JSON.parse(data));
    } catch {
      return new Set();
    }
  }

  static toggleLikedSong(songId: string): boolean {
    const set = this.getLikedSongIds();
    const isLikedNow = !set.has(songId);
    if (isLikedNow) {
      set.add(songId);
    } else {
      set.delete(songId);
    }
    localStorage.setItem(KEYS.LIKED_SONGS, JSON.stringify(Array.from(set)));
    return isLikedNow;
  }

  static getPlaylists(): Playlist[] {
    try {
      const data = localStorage.getItem(KEYS.PLAYLISTS);
      if (!data) {
        localStorage.setItem(KEYS.PLAYLISTS, JSON.stringify(INITIAL_PLAYLISTS));
        return INITIAL_PLAYLISTS;
      }
      return JSON.parse(data);
    } catch {
      return INITIAL_PLAYLISTS;
    }
  }

  static savePlaylists(playlists: Playlist[]): void {
    localStorage.setItem(KEYS.PLAYLISTS, JSON.stringify(playlists));
  }

  static createPlaylist(title: string, description: string, coverUrl?: string): Playlist {
    const playlists = this.getPlaylists();
    const newPlaylist: Playlist = {
      id: `playlist-${Date.now()}`,
      title,
      description: description || 'User created playlist on StarbeeTune',
      coverUrl: coverUrl || 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=600&auto=format&fit=crop',
      trackIds: [],
      createdAt: new Date().toISOString().split('T')[0]
    };
    playlists.push(newPlaylist);
    this.savePlaylists(playlists);
    return newPlaylist;
  }

  static addSongToPlaylist(playlistId: string, songId: string): boolean {
    const playlists = this.getPlaylists();
    const pl = playlists.find(p => p.id === playlistId);
    if (pl && !pl.trackIds.includes(songId)) {
      pl.trackIds.push(songId);
      this.savePlaylists(playlists);
      return true;
    }
    return false;
  }

  static removeSongFromPlaylist(playlistId: string, songId: string): void {
    const playlists = this.getPlaylists();
    const pl = playlists.find(p => p.id === playlistId);
    if (pl) {
      pl.trackIds = pl.trackIds.filter(id => id !== songId);
      this.savePlaylists(playlists);
    }
  }

  static deletePlaylist(playlistId: string): void {
    const playlists = this.getPlaylists().filter(p => p.id !== playlistId && !p.isSystem);
    this.savePlaylists(playlists);
  }

  static getHistory(): HistoryItem[] {
    try {
      const data = localStorage.getItem(KEYS.HISTORY);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  }

  static recordSongPlay(songId: string, durationSeconds: number): void {
    try {
      const history = this.getHistory();
      history.unshift({ songId, playedAt: Date.now() });
      if (history.length > 50) history.pop();
      localStorage.setItem(KEYS.HISTORY, JSON.stringify(history));

      // Update stats
      const stats = this.getStats();
      stats.totalPlays += 1;
      stats.totalMinutes += Math.round(durationSeconds / 60);
      
      const dayName = new Date().toLocaleDateString('en-US', { weekday: 'short' });
      stats.weeklyHours[dayName] = (stats.weeklyHours[dayName] || 0) + (durationSeconds / 3600);
      
      if (!stats.topSongIds.includes(songId)) {
        stats.topSongIds.unshift(songId);
        if (stats.topSongIds.length > 10) stats.topSongIds.pop();
      }
      localStorage.setItem(KEYS.STATS, JSON.stringify(stats));
    } catch {
      // Storage error ignored
    }
  }

  static getStats(): ListeningStats {
    try {
      const data = localStorage.getItem(KEYS.STATS);
      if (data) return JSON.parse(data);
    } catch {
      // fallback
    }
    return {
      totalMinutes: 342,
      totalPlays: 98,
      topSongIds: ['song-1', 'song-2', 'song-3', 'song-4', 'song-8'],
      weeklyHours: { Mon: 1.2, Tue: 1.8, Wed: 0.9, Thu: 2.1, Fri: 2.7, Sat: 3.4, Sun: 2.5 }
    };
  }

  static getEqualizer(): EqualizerSettings {
    try {
      const data = localStorage.getItem(KEYS.EQ);
      return data ? JSON.parse(data) : DEFAULT_EQ;
    } catch {
      return DEFAULT_EQ;
    }
  }

  static saveEqualizer(settings: EqualizerSettings): void {
    localStorage.setItem(KEYS.EQ, JSON.stringify(settings));
  }

  static getPlayerStyle(): PlayerStyle {
    return (localStorage.getItem(KEYS.PLAYER_STYLE) as PlayerStyle) || 'm3_expressive';
  }

  static savePlayerStyle(style: PlayerStyle): void {
    localStorage.setItem(KEYS.PLAYER_STYLE, style);
  }

  static getThemeColor(): AppThemeColor {
    return (localStorage.getItem(KEYS.THEME_COLOR) as AppThemeColor) || 'indigo';
  }

  static saveThemeColor(color: AppThemeColor): void {
    localStorage.setItem(KEYS.THEME_COLOR, color);
  }

  static getOledMode(): boolean {
    return localStorage.getItem(KEYS.OLED_MODE) === 'true';
  }

  static saveOledMode(enabled: boolean): void {
    localStorage.setItem(KEYS.OLED_MODE, String(enabled));
  }

  static getLocalSongs(): Song[] {
    try {
      const data = localStorage.getItem(KEYS.LOCAL_SONGS);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  }

  static saveLocalSongs(songs: Song[]): void {
    localStorage.setItem(KEYS.LOCAL_SONGS, JSON.stringify(songs));
  }

  static exportBackup(): string {
    const backup = {
      version: '15.1.0',
      exportedAt: new Date().toISOString(),
      likedSongIds: Array.from(this.getLikedSongIds()),
      playlists: this.getPlaylists(),
      stats: this.getStats(),
      eq: this.getEqualizer(),
      playerStyle: this.getPlayerStyle(),
      themeColor: this.getThemeColor()
    };
    return JSON.stringify(backup, null, 2);
  }

  static importBackup(jsonString: string): boolean {
    try {
      const data = JSON.parse(jsonString);
      if (data.likedSongIds) localStorage.setItem(KEYS.LIKED_SONGS, JSON.stringify(data.likedSongIds));
      if (data.playlists) this.savePlaylists(data.playlists);
      if (data.eq) this.saveEqualizer(data.eq);
      if (data.playerStyle) this.savePlayerStyle(data.playerStyle);
      if (data.themeColor) this.saveThemeColor(data.themeColor);
      return true;
    } catch {
      return false;
    }
  }
}

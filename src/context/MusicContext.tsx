import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { Song, Playlist, EqualizerSettings, PlayerStyle, AppThemeColor, RepeatMode, NavigationTab, Artist, Album } from '../types/music';
import { INITIAL_SONGS, INITIAL_ARTISTS, INITIAL_ALBUMS } from '../data/mockData';
import { StorageService, DEFAULT_EQ } from '../services/storageService';
import { AudioEngine } from '../services/audioEngine';

interface MusicContextType {
  // Current playback
  currentSong: Song | null;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  isMuted: boolean;
  repeatMode: RepeatMode;
  isShuffled: boolean;
  playbackRate: number;
  
  // Queue
  queue: Song[];
  queueIndex: number;

  // Actions
  playSong: (song: Song, newQueue?: Song[]) => void;
  togglePlayPause: () => void;
  seekTo: (seconds: number) => void;
  playNext: () => void;
  playPrevious: () => void;
  toggleShuffle: () => void;
  toggleRepeat: () => void;
  setVolume: (vol: number) => void;
  toggleMute: () => void;
  setPlaybackRate: (rate: number) => void;
  addToQueue: (song: Song) => void;
  removeFromQueue: (index: number) => void;
  clearQueue: () => void;

  // Liked & Playlists
  likedSongIds: Set<string>;
  toggleLike: (songId: string) => void;
  playlists: Playlist[];
  createPlaylist: (title: string, desc?: string, coverUrl?: string) => Playlist;
  addSongToPlaylist: (playlistId: string, songId: string) => boolean;
  removeSongFromPlaylist: (playlistId: string, songId: string) => void;
  deletePlaylist: (playlistId: string) => void;

  // Equalizer & Theme
  equalizer: EqualizerSettings;
  updateEqualizer: (eq: EqualizerSettings) => void;
  playerStyle: PlayerStyle;
  setPlayerStyle: (style: PlayerStyle) => void;
  themeColor: AppThemeColor;
  setThemeColor: (color: AppThemeColor) => void;
  oledMode: boolean;
  setOledMode: (val: boolean) => void;

  // Modals & Sheets
  isFullPlayerOpen: boolean;
  setIsFullPlayerOpen: (open: boolean) => void;
  isEqModalOpen: boolean;
  setIsEqModalOpen: (open: boolean) => void;
  isSleepTimerOpen: boolean;
  setIsSleepTimerOpen: (open: boolean) => void;
  isAddToPlaylistOpen: boolean;
  setIsAddToPlaylistOpen: (open: boolean) => void;
  selectedSongForPlaylist: Song | null;
  openAddToPlaylist: (song: Song) => void;

  // Navigation
  activeTab: NavigationTab;
  setActiveTab: (tab: NavigationTab) => void;
  activeArtist: Artist | null;
  setActiveArtist: (artist: Artist | null) => void;
  activeAlbum: Album | null;
  setActiveAlbum: (album: Album | null) => void;
  activePlaylist: Playlist | null;
  setActivePlaylist: (playlist: Playlist | null) => void;
  activeGenre: string | null;
  setActiveGenre: (genre: string | null) => void;

  // Sleep Timer
  sleepTimerMinutes: number | null;
  setSleepTimer: (minutes: number | null) => void;

  // Local song imports
  localSongs: Song[];
  importLocalFiles: (files: FileList) => Promise<void>;
  
  // Visualizer data
  getVisualizerData: () => Uint8Array;
}

const MusicContext = createContext<MusicContextType | null>(null);

export const MusicProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [songs] = useState<Song[]>(INITIAL_SONGS);
  const [localSongs, setLocalSongs] = useState<Song[]>(() => StorageService.getLocalSongs());
  const [currentSong, setCurrentSong] = useState<Song | null>(INITIAL_SONGS[0]);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(INITIAL_SONGS[0].duration);
  const [volume, setVolumeState] = useState<number>(0.85);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [repeatMode, setRepeatMode] = useState<RepeatMode>('off');
  const [isShuffled, setIsShuffled] = useState<boolean>(false);
  const [playbackRate, setPlaybackRateState] = useState<number>(1.0);

  const [queue, setQueue] = useState<Song[]>(INITIAL_SONGS);
  const [queueIndex, setQueueIndex] = useState<number>(0);

  const [likedSongIds, setLikedSongIds] = useState<Set<string>>(() => StorageService.getLikedSongIds());
  const [playlists, setPlaylists] = useState<Playlist[]>(() => StorageService.getPlaylists());

  const [equalizer, setEqualizer] = useState<EqualizerSettings>(() => StorageService.getEqualizer());
  const [playerStyle, setPlayerStyleState] = useState<PlayerStyle>(() => StorageService.getPlayerStyle());
  const [themeColor, setThemeColorState] = useState<AppThemeColor>(() => StorageService.getThemeColor());
  const [oledMode, setOledModeState] = useState<boolean>(() => StorageService.getOledMode());

  const [isFullPlayerOpen, setIsFullPlayerOpen] = useState<boolean>(false);
  const [isEqModalOpen, setIsEqModalOpen] = useState<boolean>(false);
  const [isSleepTimerOpen, setIsSleepTimerOpen] = useState<boolean>(false);
  const [isAddToPlaylistOpen, setIsAddToPlaylistOpen] = useState<boolean>(false);
  const [selectedSongForPlaylist, setSelectedSongForPlaylist] = useState<Song | null>(null);

  const [activeTab, setActiveTab] = useState<NavigationTab>('home');
  const [activeArtist, setActiveArtist] = useState<Artist | null>(null);
  const [activeAlbum, setActiveAlbum] = useState<Album | null>(null);
  const [activePlaylist, setActivePlaylist] = useState<Playlist | null>(null);
  const [activeGenre, setActiveGenre] = useState<string | null>(null);

  const [sleepTimerMinutes, setSleepTimerMinutes] = useState<number | null>(null);
  const sleepTimerRef = useRef<number | null>(null);

  const audioEngine = useRef(AudioEngine.getInstance());

  // Setup audio callbacks
  useEffect(() => {
    audioEngine.current.setCallbacks({
      onTimeUpdate: (cur, dur) => {
        setCurrentTime(cur);
        if (dur > 0) setDuration(dur);
      },
      onPlay: () => setIsPlaying(true),
      onPause: () => setIsPlaying(false),
      onEnded: () => handleTrackEnded(),
      onError: () => {}
    });

    audioEngine.current.setVolume(volume);
    audioEngine.current.applyEqualizer(equalizer);
  }, []);

  const handleTrackEnded = () => {
    if (repeatMode === 'one' && currentSong) {
      audioEngine.current.seek(0);
      audioEngine.current.playSong(currentSong);
      return;
    }
    playNext();
  };

  const playSong = (song: Song, newQueue?: Song[]) => {
    if (newQueue && newQueue.length > 0) {
      setQueue(newQueue);
      const idx = newQueue.findIndex(s => s.id === song.id);
      setQueueIndex(idx !== -1 ? idx : 0);
    } else {
      // If song not in queue, insert it
      const existingIdx = queue.findIndex(s => s.id === song.id);
      if (existingIdx !== -1) {
        setQueueIndex(existingIdx);
      } else {
        const updated = [...queue, song];
        setQueue(updated);
        setQueueIndex(updated.length - 1);
      }
    }

    setCurrentSong(song);
    setDuration(song.duration);
    setCurrentTime(0);
    audioEngine.current.playSong(song);

    // Record stats
    StorageService.recordSongPlay(song.id, song.duration);
  };

  const togglePlayPause = () => {
    if (isPlaying) {
      audioEngine.current.pause();
    } else {
      if (currentSong) {
        audioEngine.current.resume();
      } else if (queue.length > 0) {
        playSong(queue[0]);
      }
    }
  };

  const seekTo = (seconds: number) => {
    setCurrentTime(seconds);
    audioEngine.current.seek(seconds);
  };

  const playNext = () => {
    if (queue.length === 0) return;
    let nextIdx = queueIndex + 1;
    if (nextIdx >= queue.length) {
      if (repeatMode === 'all') {
        nextIdx = 0;
      } else {
        return; // Stopped at end
      }
    }
    setQueueIndex(nextIdx);
    const nextSong = queue[nextIdx];
    setCurrentSong(nextSong);
    setDuration(nextSong.duration);
    setCurrentTime(0);
    audioEngine.current.playSong(nextSong);
    StorageService.recordSongPlay(nextSong.id, nextSong.duration);
  };

  const playPrevious = () => {
    if (currentTime > 4) {
      seekTo(0);
      return;
    }
    if (queue.length === 0) return;
    let prevIdx = queueIndex - 1;
    if (prevIdx < 0) {
      prevIdx = queue.length - 1;
    }
    setQueueIndex(prevIdx);
    const prevSong = queue[prevIdx];
    setCurrentSong(prevSong);
    setDuration(prevSong.duration);
    setCurrentTime(0);
    audioEngine.current.playSong(prevSong);
  };

  const toggleShuffle = () => {
    setIsShuffled(prev => !prev);
    if (!isShuffled && queue.length > 1) {
      // Shuffle queue while keeping current song at current index
      const remaining = queue.filter((_, i) => i !== queueIndex);
      const shuffled = [...remaining].sort(() => Math.random() - 0.5);
      if (currentSong) {
        setQueue([currentSong, ...shuffled]);
        setQueueIndex(0);
      }
    }
  };

  const toggleRepeat = () => {
    setRepeatMode(prev => {
      if (prev === 'off') return 'all';
      if (prev === 'all') return 'one';
      return 'off';
    });
  };

  const setVolume = (vol: number) => {
    setVolumeState(vol);
    setIsMuted(vol === 0);
    audioEngine.current.setVolume(vol);
  };

  const toggleMute = () => {
    if (isMuted) {
      setIsMuted(false);
      audioEngine.current.setVolume(volume || 0.85);
    } else {
      setIsMuted(true);
      audioEngine.current.setVolume(0);
    }
  };

  const setPlaybackRate = (rate: number) => {
    setPlaybackRateState(rate);
    audioEngine.current.setPlaybackRate(rate);
  };

  const addToQueue = (song: Song) => {
    setQueue(prev => [...prev, song]);
  };

  const removeFromQueue = (index: number) => {
    setQueue(prev => prev.filter((_, i) => i !== index));
    if (index < queueIndex) {
      setQueueIndex(prev => prev - 1);
    }
  };

  const clearQueue = () => {
    if (currentSong) {
      setQueue([currentSong]);
      setQueueIndex(0);
    }
  };

  const toggleLike = (songId: string) => {
    const isLiked = StorageService.toggleLikedSong(songId);
    setLikedSongIds(new Set(StorageService.getLikedSongIds()));
    
    // Also sync liked songs system playlist
    const playlistsUpdated = StorageService.getPlaylists();
    const favPl = playlistsUpdated.find(p => p.id === 'playlist-favorites');
    if (favPl) {
      if (isLiked && !favPl.trackIds.includes(songId)) {
        favPl.trackIds.push(songId);
      } else if (!isLiked) {
        favPl.trackIds = favPl.trackIds.filter(id => id !== songId);
      }
      StorageService.savePlaylists(playlistsUpdated);
      setPlaylists([...playlistsUpdated]);
    }
  };

  const createPlaylist = (title: string, desc?: string, coverUrl?: string) => {
    const pl = StorageService.createPlaylist(title, desc || '', coverUrl);
    setPlaylists([...StorageService.getPlaylists()]);
    return pl;
  };

  const addSongToPlaylist = (playlistId: string, songId: string) => {
    const res = StorageService.addSongToPlaylist(playlistId, songId);
    if (res) {
      setPlaylists([...StorageService.getPlaylists()]);
    }
    return res;
  };

  const removeSongFromPlaylist = (playlistId: string, songId: string) => {
    StorageService.removeSongFromPlaylist(playlistId, songId);
    setPlaylists([...StorageService.getPlaylists()]);
  };

  const deletePlaylist = (playlistId: string) => {
    StorageService.deletePlaylist(playlistId);
    setPlaylists([...StorageService.getPlaylists()]);
    if (activePlaylist?.id === playlistId) {
      setActivePlaylist(null);
    }
  };

  const updateEqualizer = (eq: EqualizerSettings) => {
    setEqualizer(eq);
    StorageService.saveEqualizer(eq);
    audioEngine.current.applyEqualizer(eq);
  };

  const setPlayerStyle = (style: PlayerStyle) => {
    setPlayerStyleState(style);
    StorageService.savePlayerStyle(style);
  };

  const setThemeColor = (color: AppThemeColor) => {
    setThemeColorState(color);
    StorageService.saveThemeColor(color);
  };

  const setOledMode = (val: boolean) => {
    setOledModeState(val);
    StorageService.saveOledMode(val);
  };

  const openAddToPlaylist = (song: Song) => {
    setSelectedSongForPlaylist(song);
    setIsAddToPlaylistOpen(true);
  };

  const setSleepTimer = (minutes: number | null) => {
    setSleepTimerMinutes(minutes);
    if (sleepTimerRef.current) {
      clearTimeout(sleepTimerRef.current);
      sleepTimerRef.current = null;
    }
    if (minutes !== null && minutes > 0) {
      sleepTimerRef.current = window.setTimeout(() => {
        audioEngine.current.pause();
        setSleepTimerMinutes(null);
      }, minutes * 60 * 1000);
    }
  };

  const importLocalFiles = async (files: FileList) => {
    const newSongs: Song[] = [];
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (!file.type.startsWith('audio/') && !file.name.match(/\.(mp3|wav|ogg|m4a|flac)$/i)) continue;

      const url = URL.createObjectURL(file);
      const cleanName = file.name.replace(/\.[^/.]+$/, '');
      const parts = cleanName.split(' - ');
      const artist = parts.length > 1 ? parts[0].trim() : 'Local Artist';
      const title = parts.length > 1 ? parts[1].trim() : cleanName;

      const song: Song = {
        id: `local-${Date.now()}-${i}`,
        title,
        artist,
        album: 'Local Storage',
        duration: 210, // estimated
        durationFormatted: '3:30',
        artworkUrl: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=600&auto=format&fit=crop',
        audioUrl: url,
        genre: 'Local Audio',
        playCount: 1,
        isLocal: true
      };
      newSongs.push(song);
    }

    if (newSongs.length > 0) {
      const updated = [...localSongs, ...newSongs];
      setLocalSongs(updated);
      StorageService.saveLocalSongs(updated);
      setQueue(prev => [...prev, ...newSongs]);
    }
  };

  const getVisualizerData = () => {
    return audioEngine.current.getVisualizerData();
  };

  return (
    <MusicContext.Provider
      value={{
        currentSong,
        isPlaying,
        currentTime,
        duration,
        volume,
        isMuted,
        repeatMode,
        isShuffled,
        playbackRate,
        queue,
        queueIndex,
        playSong,
        togglePlayPause,
        seekTo,
        playNext,
        playPrevious,
        toggleShuffle,
        toggleRepeat,
        setVolume,
        toggleMute,
        setPlaybackRate,
        addToQueue,
        removeFromQueue,
        clearQueue,
        likedSongIds,
        toggleLike,
        playlists,
        createPlaylist,
        addSongToPlaylist,
        removeSongFromPlaylist,
        deletePlaylist,
        equalizer,
        updateEqualizer,
        playerStyle,
        setPlayerStyle,
        themeColor,
        setThemeColor,
        oledMode,
        setOledMode,
        isFullPlayerOpen,
        setIsFullPlayerOpen,
        isEqModalOpen,
        setIsEqModalOpen,
        isSleepTimerOpen,
        setIsSleepTimerOpen,
        isAddToPlaylistOpen,
        setIsAddToPlaylistOpen,
        selectedSongForPlaylist,
        openAddToPlaylist,
        activeTab,
        setActiveTab,
        activeArtist,
        setActiveArtist,
        activeAlbum,
        setActiveAlbum,
        activePlaylist,
        setActivePlaylist,
        activeGenre,
        setActiveGenre,
        sleepTimerMinutes,
        setSleepTimer,
        localSongs,
        importLocalFiles,
        getVisualizerData
      }}
    >
      {children}
    </MusicContext.Provider>
  );
};

export const useMusic = () => {
  const context = useContext(MusicContext);
  if (!context) throw new Error('useMusic must be used within MusicProvider');
  return context;
};

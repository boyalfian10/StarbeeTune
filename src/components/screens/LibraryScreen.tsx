import React, { useState, useRef } from 'react';
import { useMusic } from '../../context/MusicContext';
import { INITIAL_SONGS } from '../../data/mockData';
import { StorageService } from '../../services/storageService';
import {
  Bookmark,
  Heart,
  History,
  FolderOpen,
  Plus,
  Play,
  Shuffle,
  Trash2,
  Music,
  Upload,
  Clock,
  MoreVertical
} from 'lucide-react';
import { Playlist, Song } from '../../types/music';

export const LibraryScreen: React.FC = () => {
  const {
    playlists,
    createPlaylist,
    deletePlaylist,
    setActivePlaylist,
    playSong,
    likedSongIds,
    toggleLike,
    openAddToPlaylist,
    localSongs,
    importLocalFiles,
    themeColor
  } = useMusic();

  const [activeTab, setActiveTab] = useState<'playlists' | 'likes' | 'history' | 'local'>('playlists');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const historyItems = StorageService.getHistory();
  const likedSongsList = INITIAL_SONGS.filter(s => likedSongIds.has(s.id));

  // Compute total duration of liked songs
  const totalLikedSeconds = likedSongsList.reduce((acc, s) => acc + s.duration, 0);
  const totalLikedMins = Math.round(totalLikedSeconds / 60);

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    createPlaylist(newTitle.trim(), newDesc.trim());
    setNewTitle('');
    setNewDesc('');
    setShowCreateModal(false);
  };

  const handleFilesUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      await importLocalFiles(e.target.files);
    }
  };

  const themeAccentClass = {
    indigo: 'bg-indigo-600 text-white',
    fuchsia: 'bg-fuchsia-600 text-white',
    emerald: 'bg-emerald-600 text-white',
    amber: 'bg-amber-600 text-white',
    rose: 'bg-rose-600 text-white',
    sky: 'bg-sky-600 text-white',
    dynamic: 'bg-indigo-600 text-white'
  }[themeColor];

  return (
    <div className="pb-36 pt-2 px-4 max-w-md sm:max-w-xl mx-auto space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between pt-2">
        <h1 className="text-2xl font-extrabold text-white tracking-tight font-['Poppins']">
          Your Library
        </h1>

        {activeTab === 'playlists' && (
          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-white/10 hover:bg-white/15 text-xs font-semibold text-white border border-white/10 active:scale-95 transition-all"
          >
            <Plus className="w-4 h-4 text-indigo-400" />
            <span>New Playlist</span>
          </button>
        )}

        {activeTab === 'local' && (
          <button
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-indigo-600 hover:bg-indigo-500 text-xs font-semibold text-white active:scale-95 transition-all shadow-md"
          >
            <Upload className="w-3.5 h-3.5" />
            <span>Import Audio</span>
          </button>
        )}
      </div>

      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept="audio/*,.mp3,.wav,.ogg,.m4a,.flac"
        onChange={handleFilesUpload}
        className="hidden"
      />

      {/* Library Sub-Tabs */}
      <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-zinc-900 border border-white/5">
        <button
          onClick={() => setActiveTab('playlists')}
          className={`flex-1 py-1.5 rounded-xl text-xs font-semibold transition-all ${
            activeTab === 'playlists' ? themeAccentClass : 'text-zinc-400 hover:text-white'
          }`}
        >
          Playlists
        </button>
        <button
          onClick={() => setActiveTab('likes')}
          className={`flex-1 py-1.5 rounded-xl text-xs font-semibold transition-all ${
            activeTab === 'likes' ? themeAccentClass : 'text-zinc-400 hover:text-white'
          }`}
        >
          Liked ({likedSongsList.length})
        </button>
        <button
          onClick={() => setActiveTab('history')}
          className={`flex-1 py-1.5 rounded-xl text-xs font-semibold transition-all ${
            activeTab === 'history' ? themeAccentClass : 'text-zinc-400 hover:text-white'
          }`}
        >
          History
        </button>
        <button
          onClick={() => setActiveTab('local')}
          className={`flex-1 py-1.5 rounded-xl text-xs font-semibold transition-all ${
            activeTab === 'local' ? themeAccentClass : 'text-zinc-400 hover:text-white'
          }`}
        >
          Local Files
        </button>
      </div>

      {/* TAB 1: PLAYLISTS */}
      {activeTab === 'playlists' && (
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            {playlists.map((pl) => (
              <div
                key={pl.id}
                onClick={() => setActivePlaylist(pl)}
                className="p-3 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/5 cursor-pointer group active:scale-[0.98] transition-all relative overflow-hidden"
              >
                <div className="w-full aspect-square rounded-xl overflow-hidden mb-2 bg-zinc-800 shadow-md">
                  <img src={pl.coverUrl} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                </div>
                <h4 className="text-xs font-bold text-white truncate">{pl.title}</h4>
                <p className="text-[11px] text-zinc-400 truncate mt-0.5">{pl.trackIds.length} tracks</p>

                {!pl.isSystem && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      if (confirm(`Delete playlist "${pl.title}"?`)) {
                        deletePlaylist(pl.id);
                      }
                    }}
                    className="absolute top-4 right-4 w-7 h-7 rounded-full bg-black/60 hover:bg-rose-600 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                    title="Delete playlist"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 2: LIKED SONGS */}
      {activeTab === 'likes' && (
        <div className="space-y-3">
          {/* Header Action */}
          <div className="flex items-center justify-between p-4 rounded-2xl bg-gradient-to-r from-rose-950/40 to-purple-950/40 border border-rose-500/20">
            <div>
              <p className="text-xs font-bold text-rose-300">Favorites Collection</p>
              <h3 className="text-lg font-extrabold text-white">Your Liked Songs</h3>
              <p className="text-xs text-zinc-400 mt-0.5">{likedSongsList.length} tracks • {totalLikedMins} mins</p>
            </div>
            {likedSongsList.length > 0 && (
              <button
                onClick={() => playSong(likedSongsList[0], likedSongsList)}
                className="w-11 h-11 rounded-full bg-rose-600 hover:bg-rose-500 text-white flex items-center justify-center shadow-lg shadow-rose-600/30 active:scale-95 transition-all"
              >
                <Play className="w-5 h-5 fill-white stroke-none ml-0.5" />
              </button>
            )}
          </div>

          <div className="space-y-1.5">
            {likedSongsList.map((song) => (
              <div
                key={song.id}
                onClick={() => playSong(song, likedSongsList)}
                className="flex items-center justify-between p-2.5 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/5 cursor-pointer transition-all"
              >
                <div className="flex items-center gap-3 overflow-hidden">
                  <img src={song.artworkUrl} alt="" className="w-10 h-10 rounded-xl object-cover" />
                  <div className="overflow-hidden">
                    <p className="text-xs font-bold text-white truncate">{song.title}</p>
                    <p className="text-[11px] text-zinc-400 truncate">{song.artist}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                  <button
                    onClick={() => toggleLike(song.id)}
                    className="p-1.5 text-rose-500 hover:scale-110 active:scale-90 transition-all"
                  >
                    <Heart className="w-4 h-4 fill-rose-500" />
                  </button>
                  <button
                    onClick={() => openAddToPlaylist(song)}
                    className="p-1.5 text-zinc-400 hover:text-white"
                  >
                    <MoreVertical className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: PLAYBACK HISTORY */}
      {activeTab === 'history' && (
        <div className="space-y-2">
          {historyItems.length === 0 ? (
            <div className="py-16 text-center text-zinc-500">
              <History className="w-8 h-8 mx-auto mb-2 opacity-40" />
              <p className="text-sm font-semibold">No playback history yet</p>
              <p className="text-xs mt-1 text-zinc-600">Start playing songs from Home or Search!</p>
            </div>
          ) : (
            historyItems.map((item, idx) => {
              const song = INITIAL_SONGS.find(s => s.id === item.songId);
              if (!song) return null;
              const dateStr = new Date(item.playedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

              return (
                <div
                  key={`${item.songId}-${idx}`}
                  onClick={() => playSong(song)}
                  className="flex items-center justify-between p-2.5 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/5 cursor-pointer transition-all"
                >
                  <div className="flex items-center gap-3 overflow-hidden">
                    <img src={song.artworkUrl} alt="" className="w-10 h-10 rounded-xl object-cover" />
                    <div className="overflow-hidden">
                      <p className="text-xs font-bold text-white truncate">{song.title}</p>
                      <p className="text-[11px] text-zinc-400 truncate">{song.artist}</p>
                    </div>
                  </div>
                  <span className="text-[11px] text-zinc-500 flex-shrink-0 font-medium">
                    {dateStr}
                  </span>
                </div>
              );
            })
          )}
        </div>
      )}

      {/* TAB 4: LOCAL FILES */}
      {activeTab === 'local' && (
        <div className="space-y-3">
          <div
            onClick={() => fileInputRef.current?.click()}
            className="p-6 rounded-2xl border-2 border-dashed border-white/15 hover:border-indigo-500/50 bg-white/5 cursor-pointer flex flex-col items-center justify-center text-center gap-2 group transition-all"
          >
            <div className="w-12 h-12 rounded-full bg-indigo-500/10 text-indigo-400 flex items-center justify-center group-hover:scale-110 transition-transform">
              <FolderOpen className="w-6 h-6" />
            </div>
            <h4 className="text-xs font-bold text-white">Import Device Audio Files</h4>
            <p className="text-[11px] text-zinc-400 max-w-xs">
              Supports MP3, FLAC, WAV, M4A and OGG files with zero upload to cloud.
            </p>
          </div>

          <div className="space-y-1.5">
            {localSongs.map((song) => (
              <div
                key={song.id}
                onClick={() => playSong(song)}
                className="flex items-center justify-between p-2.5 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/5 cursor-pointer transition-all"
              >
                <div className="flex items-center gap-3 overflow-hidden">
                  <div className="w-10 h-10 rounded-xl bg-indigo-950/60 border border-indigo-500/30 flex items-center justify-center text-indigo-400 flex-shrink-0">
                    <Music className="w-5 h-5" />
                  </div>
                  <div className="overflow-hidden">
                    <p className="text-xs font-bold text-white truncate">{song.title}</p>
                    <p className="text-[11px] text-zinc-400 truncate">{song.artist}</p>
                  </div>
                </div>
                <Play className="w-4 h-4 text-zinc-400" />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Create Playlist Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
          <form
            onSubmit={handleCreateSubmit}
            className="w-full max-w-sm rounded-3xl bg-zinc-900 border border-white/10 shadow-2xl p-5 space-y-4"
          >
            <h3 className="font-bold text-base text-white font-['Poppins']">Create New Playlist</h3>
            <div>
              <label className="text-xs font-semibold text-zinc-400 block mb-1">Title</label>
              <input
                type="text"
                autoFocus
                placeholder="My Awesome Playlist..."
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/10 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-indigo-500"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-zinc-400 block mb-1">Description (Optional)</label>
              <input
                type="text"
                placeholder="Vibes and feelings..."
                value={newDesc}
                onChange={(e) => setNewDesc(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/10 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-indigo-500"
              />
            </div>
            <div className="flex gap-2 pt-2">
              <button
                type="submit"
                className="flex-1 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs transition-all shadow-md"
              >
                Create
              </button>
              <button
                type="button"
                onClick={() => setShowCreateModal(false)}
                className="px-4 py-2 rounded-xl bg-white/10 text-zinc-300 font-semibold text-xs hover:bg-white/15"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

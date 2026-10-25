import React, { useState } from 'react';
import { useMusic } from '../../context/MusicContext';
import { X, Plus, Check, ListMusic } from 'lucide-react';

export const AddToPlaylistModal: React.FC = () => {
  const {
    isAddToPlaylistOpen,
    setIsAddToPlaylistOpen,
    selectedSongForPlaylist,
    playlists,
    addSongToPlaylist,
    createPlaylist
  } = useMusic();

  const [isCreating, setIsCreating] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [successId, setSuccessId] = useState<string | null>(null);

  if (!isAddToPlaylistOpen || !selectedSongForPlaylist) return null;

  const handleAdd = (playlistId: string) => {
    addSongToPlaylist(playlistId, selectedSongForPlaylist.id);
    setSuccessId(playlistId);
    setTimeout(() => {
      setIsAddToPlaylistOpen(false);
      setSuccessId(null);
    }, 600);
  };

  const handleCreateAndAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    const pl = createPlaylist(newTitle.trim());
    addSongToPlaylist(pl.id, selectedSongForPlaylist.id);
    setIsAddToPlaylistOpen(false);
    setIsCreating(false);
    setNewTitle('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="w-full max-w-sm rounded-3xl bg-zinc-900 border border-white/10 shadow-2xl p-5 flex flex-col gap-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ListMusic className="w-5 h-5 text-indigo-400" />
            <div>
              <h3 className="font-bold text-base text-white font-['Poppins']">Add to Playlist</h3>
              <p className="text-[11px] text-zinc-400 truncate max-w-[200px]">
                {selectedSongForPlaylist.title}
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsAddToPlaylistOpen(false)}
            className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-white/10 text-zinc-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Create New Toggle */}
        {!isCreating ? (
          <button
            onClick={() => setIsCreating(true)}
            className="w-full py-2.5 px-3 rounded-xl border border-dashed border-white/20 hover:border-indigo-400 text-xs font-semibold text-zinc-300 hover:text-white flex items-center justify-center gap-2 transition-all hover:bg-white/5"
          >
            <Plus className="w-4 h-4 text-indigo-400" />
            <span>Create New Playlist</span>
          </button>
        ) : (
          <form onSubmit={handleCreateAndAdd} className="space-y-2">
            <input
              type="text"
              autoFocus
              placeholder="Playlist name..."
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-black/40 border border-indigo-500/50 text-xs text-white placeholder-zinc-500 focus:outline-none"
            />
            <div className="flex gap-2">
              <button
                type="submit"
                className="flex-1 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold"
              >
                Create & Add
              </button>
              <button
                type="button"
                onClick={() => setIsCreating(false)}
                className="px-3 py-1.5 rounded-lg bg-white/10 text-zinc-400 text-xs font-medium"
              >
                Cancel
              </button>
            </div>
          </form>
        )}

        {/* Existing Playlists */}
        <div className="max-h-56 overflow-y-auto space-y-1.5">
          {playlists.map((pl) => {
            const alreadyHas = pl.trackIds.includes(selectedSongForPlaylist.id);
            const isJustAdded = successId === pl.id;

            return (
              <button
                key={pl.id}
                onClick={() => handleAdd(pl.id)}
                disabled={alreadyHas}
                className={`w-full p-2.5 rounded-xl flex items-center justify-between text-left transition-all ${
                  alreadyHas
                    ? 'opacity-50 cursor-not-allowed bg-white/5'
                    : isJustAdded
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                    : 'hover:bg-white/5 text-zinc-200'
                }`}
              >
                <div className="flex items-center gap-3 overflow-hidden">
                  <img src={pl.coverUrl} alt="" className="w-9 h-9 rounded-lg object-cover" />
                  <div className="overflow-hidden">
                    <p className="text-xs font-semibold truncate">{pl.title}</p>
                    <p className="text-[10px] text-zinc-400">{pl.trackIds.length} songs</p>
                  </div>
                </div>

                {isJustAdded ? (
                  <Check className="w-4 h-4 text-emerald-400" />
                ) : alreadyHas ? (
                  <span className="text-[10px] font-semibold text-zinc-500">Added</span>
                ) : (
                  <Plus className="w-4 h-4 text-zinc-400" />
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

import React from 'react';
import { useMusic } from '../../context/MusicContext';
import { INITIAL_SONGS } from '../../data/mockData';
import { ChevronDown, Play, Heart, Disc, Clock } from 'lucide-react';

export const AlbumModal: React.FC = () => {
  const {
    activeAlbum,
    setActiveAlbum,
    playSong,
    likedSongIds,
    toggleLike
  } = useMusic();

  if (!activeAlbum) return null;

  const albumSongs = INITIAL_SONGS.filter(s =>
    activeAlbum.trackIds.includes(s.id) || s.album === activeAlbum.title
  );

  return (
    <div className="fixed inset-0 z-40 bg-zinc-950 flex flex-col overflow-y-auto animate-in slide-in-from-bottom duration-200 pb-36 text-white">
      {/* Top Header */}
      <div className="p-4 flex items-center justify-between">
        <button
          onClick={() => setActiveAlbum(null)}
          className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/15 flex items-center justify-center text-white active:scale-90 transition-all"
        >
          <ChevronDown className="w-6 h-6" />
        </button>
        <span className="text-xs font-bold uppercase tracking-wider text-zinc-400">Album</span>
        <div className="w-10" />
      </div>

      <div className="px-4 space-y-6 max-w-md sm:max-w-xl mx-auto w-full">
        {/* Album Artwork & Details */}
        <div className="flex flex-col items-center text-center">
          <div className="w-52 h-52 rounded-3xl overflow-hidden shadow-2xl border border-white/10 mb-4">
            <img src={activeAlbum.artworkUrl} alt={activeAlbum.title} className="w-full h-full object-cover" />
          </div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-white font-['Poppins']">
            {activeAlbum.title}
          </h1>
          <p className="text-sm font-semibold text-indigo-400 mt-1">{activeAlbum.artist}</p>
          <p className="text-xs text-zinc-500 mt-0.5">{activeAlbum.year} • {albumSongs.length} tracks</p>

          {albumSongs.length > 0 && (
            <button
              onClick={() => playSong(albumSongs[0], albumSongs)}
              className="mt-4 px-6 py-2.5 rounded-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-indigo-600/30 active:scale-95 transition-all"
            >
              <Play className="w-4 h-4 fill-white stroke-none" />
              <span>Play Album</span>
            </button>
          )}
        </div>

        {/* Tracklist */}
        <div className="space-y-1.5 pt-2">
          {albumSongs.map((song, idx) => {
            const isLiked = likedSongIds.has(song.id);
            return (
              <div
                key={song.id}
                onClick={() => playSong(song, albumSongs)}
                className="flex items-center justify-between p-2.5 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/5 cursor-pointer transition-all"
              >
                <div className="flex items-center gap-3 overflow-hidden">
                  <span className="text-xs font-bold text-zinc-500 w-4 text-center">{idx + 1}</span>
                  <div className="overflow-hidden">
                    <p className="text-xs font-bold text-white truncate">{song.title}</p>
                    <p className="text-[11px] text-zinc-400 truncate">{song.artist}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                  <button
                    onClick={() => toggleLike(song.id)}
                    className="p-1.5 text-zinc-400 hover:text-rose-400"
                  >
                    <Heart className={`w-4 h-4 ${isLiked ? 'text-rose-500 fill-rose-500' : ''}`} />
                  </button>
                  <span className="text-xs text-zinc-400">{song.durationFormatted}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

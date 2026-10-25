import React from 'react';
import { useMusic } from '../../context/MusicContext';
import { INITIAL_SONGS, INITIAL_ALBUMS } from '../../data/mockData';
import { ChevronDown, Play, Heart, Radio, Disc } from 'lucide-react';

export const ArtistModal: React.FC = () => {
  const {
    activeArtist,
    setActiveArtist,
    playSong,
    likedSongIds,
    toggleLike,
    setActiveAlbum
  } = useMusic();

  if (!activeArtist) return null;

  const artistSongs = INITIAL_SONGS.filter(s =>
    activeArtist.topTrackIds.includes(s.id) || s.artist === activeArtist.name
  );

  const artistAlbums = INITIAL_ALBUMS.filter(a =>
    activeArtist.albumIds.includes(a.id) || a.artist === activeArtist.name
  );

  return (
    <div className="fixed inset-0 z-40 bg-zinc-950 flex flex-col overflow-y-auto animate-in slide-in-from-bottom duration-200 pb-36 text-white">
      {/* Hero Banner */}
      <div className="relative w-full h-64 sm:h-80 flex-shrink-0">
        <img
          src={activeArtist.heroUrl || activeArtist.avatarUrl}
          alt={activeArtist.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/40 to-transparent" />

        <button
          onClick={() => setActiveArtist(null)}
          className="absolute top-4 left-4 w-10 h-10 rounded-full bg-black/50 hover:bg-black/70 flex items-center justify-center text-white backdrop-blur-md active:scale-90 transition-all"
        >
          <ChevronDown className="w-6 h-6" />
        </button>

        <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-400">Verified Artist</span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white font-['Poppins']">
              {activeArtist.name}
            </h1>
            <p className="text-xs text-zinc-300 mt-1">{activeArtist.monthlyListeners} monthly listeners</p>
          </div>

          {artistSongs.length > 0 && (
            <button
              onClick={() => playSong(artistSongs[0], artistSongs)}
              className="w-12 h-12 rounded-full bg-indigo-600 hover:bg-indigo-500 text-white flex items-center justify-center shadow-xl shadow-indigo-600/30 active:scale-95 transition-all flex-shrink-0"
            >
              <Play className="w-6 h-6 fill-white stroke-none ml-0.5" />
            </button>
          )}
        </div>
      </div>

      <div className="px-4 py-4 space-y-6 max-w-md sm:max-w-xl mx-auto w-full">
        {/* Bio */}
        <div className="p-4 rounded-2xl bg-white/5 border border-white/5">
          <p className="text-xs text-zinc-300 leading-relaxed">{activeArtist.bio}</p>
        </div>

        {/* Popular Tracks */}
        <div className="space-y-3">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider">Top Tracks</h3>
          <div className="space-y-1.5">
            {artistSongs.map((song, idx) => {
              const isLiked = likedSongIds.has(song.id);
              return (
                <div
                  key={song.id}
                  onClick={() => playSong(song, artistSongs)}
                  className="flex items-center justify-between p-2.5 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/5 cursor-pointer transition-all"
                >
                  <div className="flex items-center gap-3 overflow-hidden">
                    <span className="text-xs font-bold text-zinc-500 w-4 text-center">{idx + 1}</span>
                    <img src={song.artworkUrl} alt="" className="w-10 h-10 rounded-xl object-cover" />
                    <div className="overflow-hidden">
                      <p className="text-xs font-bold text-white truncate">{song.title}</p>
                      <p className="text-[11px] text-zinc-400 truncate">{song.album}</p>
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

        {/* Discography / Albums */}
        {artistAlbums.length > 0 && (
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">Albums & Releases</h3>
            <div className="grid grid-cols-2 gap-3">
              {artistAlbums.map((album) => (
                <div
                  key={album.id}
                  onClick={() => {
                    setActiveAlbum(album);
                    setActiveArtist(null);
                  }}
                  className="p-3 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/5 cursor-pointer group transition-all"
                >
                  <img src={album.artworkUrl} alt="" className="w-full aspect-square rounded-xl object-cover mb-2" />
                  <p className="text-xs font-bold text-white truncate">{album.title}</p>
                  <p className="text-[10px] text-zinc-400 mt-0.5">{album.year} • Album</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

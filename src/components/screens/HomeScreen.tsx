import React, { useState } from 'react';
import { useMusic } from '../../context/MusicContext';
import { INITIAL_SONGS, INITIAL_ARTISTS, INITIAL_PLAYLISTS, MOOD_TAGS } from '../../data/mockData';
import { Play, Heart, MoreVertical, Flame, Sparkles, Disc, Radio, Clock, ChevronRight } from 'lucide-react';

export const HomeScreen: React.FC = () => {
  const {
    currentSong,
    isPlaying,
    playSong,
    toggleLike,
    likedSongIds,
    openAddToPlaylist,
    setActiveArtist,
    setActivePlaylist,
    themeColor
  } = useMusic();

  const [activeMood, setActiveMood] = useState<string>('All');

  // Filter songs based on mood chip
  const filteredSongs = activeMood === 'All'
    ? INITIAL_SONGS
    : INITIAL_SONGS.filter(s => {
        if (activeMood === 'Relax') return s.genre.includes('Lo-Fi') || s.genre.includes('Piano');
        if (activeMood === 'Focus') return s.genre.includes('Lo-Fi') || s.genre.includes('Classical');
        if (activeMood === 'Workout') return s.genre.includes('Synthwave');
        if (activeMood === 'Party') return s.genre.includes('Synthwave') || s.genre.includes('Anime');
        if (activeMood === 'Romance') return s.genre.includes('R&B') || s.genre.includes('Dream');
        return true;
      });

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  const themePillClass = {
    indigo: 'bg-indigo-600 text-white',
    fuchsia: 'bg-fuchsia-600 text-white',
    emerald: 'bg-emerald-600 text-white',
    amber: 'bg-amber-600 text-white',
    rose: 'bg-rose-600 text-white',
    sky: 'bg-sky-600 text-white',
    dynamic: 'bg-indigo-600 text-white'
  }[themeColor];

  return (
    <div className="pb-36 pt-2 px-4 max-w-md sm:max-w-xl mx-auto space-y-6">
      {/* Greeting Banner */}
      <div className="flex items-center justify-between pt-2">
        <div>
          <p className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">StarbeeTune Player</p>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight font-['Poppins']">
            {getGreeting()}
          </h1>
        </div>
        <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-indigo-500 to-fuchsia-500 p-0.5 shadow-lg shadow-indigo-500/20">
          <div className="w-full h-full rounded-full bg-zinc-900 flex items-center justify-center font-bold text-xs text-white">
            ST
          </div>
        </div>
      </div>

      {/* Mood Filter Chips */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
        {MOOD_TAGS.map((mood) => {
          const isActive = activeMood === mood;
          return (
            <button
              key={mood}
              onClick={() => setActiveMood(mood)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all duration-200 active:scale-95 ${
                isActive
                  ? `${themePillClass} shadow-md`
                  : 'bg-white/5 hover:bg-white/10 text-zinc-300 border border-white/5'
              }`}
            >
              {mood}
            </button>
          );
        })}
      </div>

      {/* Quick Picks 4x2 Grid */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-white tracking-tight flex items-center gap-2 font-['Poppins']">
            <Sparkles className="w-4 h-4 text-indigo-400" />
            <span>Quick Picks</span>
          </h2>
          <span className="text-xs text-zinc-400 font-medium">Listen Again</span>
        </div>

        <div className="grid grid-cols-2 gap-2.5">
          {INITIAL_SONGS.slice(0, 4).map((song) => {
            const isCurrent = currentSong?.id === song.id;
            return (
              <div
                key={song.id}
                onClick={() => playSong(song)}
                className={`flex items-center gap-2.5 p-2 rounded-2xl cursor-pointer transition-all duration-200 group border active:scale-[0.98] ${
                  isCurrent
                    ? 'bg-indigo-500/20 border-indigo-500/30 text-white'
                    : 'bg-white/5 hover:bg-white/10 border-white/5 text-zinc-200'
                }`}
              >
                <div className="relative w-12 h-12 rounded-xl overflow-hidden flex-shrink-0 bg-zinc-800 shadow-md">
                  <img src={song.artworkUrl} alt="" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                    <Play className="w-5 h-5 fill-white stroke-none" />
                  </div>
                </div>
                <div className="overflow-hidden min-w-0 pr-1">
                  <p className="text-xs font-bold truncate tracking-tight">{song.title}</p>
                  <p className="text-[11px] text-zinc-400 truncate mt-0.5">{song.artist}</p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Featured Playlists Carousel */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-white tracking-tight flex items-center gap-2 font-['Poppins']">
            <Disc className="w-4 h-4 text-fuchsia-400" />
            <span>Curated Playlists</span>
          </h2>
        </div>

        <div className="flex gap-3.5 overflow-x-auto no-scrollbar pb-1">
          {INITIAL_PLAYLISTS.map((pl) => (
            <div
              key={pl.id}
              onClick={() => setActivePlaylist(pl)}
              className="w-36 flex-shrink-0 cursor-pointer group active:scale-95 transition-transform"
            >
              <div className="relative w-36 h-36 rounded-2xl overflow-hidden shadow-lg border border-white/10 mb-2">
                <img
                  src={pl.coverUrl}
                  alt={pl.title}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-2.5">
                  <span className="text-[10px] font-bold text-zinc-300 bg-black/50 px-2 py-0.5 rounded-md backdrop-blur-sm">
                    {pl.trackIds.length} tracks
                  </span>
                </div>
              </div>
              <h4 className="text-xs font-bold text-white truncate">{pl.title}</h4>
              <p className="text-[11px] text-zinc-400 truncate mt-0.5">{pl.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Trending Tracks */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-white tracking-tight flex items-center gap-2 font-['Poppins']">
            <Flame className="w-4 h-4 text-rose-400" />
            <span>Trending Tracks</span>
          </h2>
          <span className="text-xs text-zinc-400">Top 8</span>
        </div>

        <div className="space-y-1.5">
          {filteredSongs.map((song, idx) => {
            const isCurrent = currentSong?.id === song.id;
            const isLiked = likedSongIds.has(song.id);

            return (
              <div
                key={song.id}
                onClick={() => playSong(song, filteredSongs)}
                className={`flex items-center justify-between p-2.5 rounded-2xl cursor-pointer transition-all border ${
                  isCurrent
                    ? 'bg-indigo-500/15 border-indigo-500/30'
                    : 'bg-white/5 hover:bg-white/10 border-white/5'
                }`}
              >
                <div className="flex items-center gap-3 overflow-hidden min-w-0">
                  <span className={`text-xs font-extrabold w-4 text-center ${idx < 3 ? 'text-indigo-400' : 'text-zinc-500'}`}>
                    {idx + 1}
                  </span>
                  <div className="relative w-11 h-11 rounded-xl overflow-hidden flex-shrink-0 bg-zinc-800">
                    <img src={song.artworkUrl} alt="" className="w-full h-full object-cover" />
                    {isCurrent && isPlaying && (
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                        <span className="w-2 h-2 rounded-full bg-indigo-400 animate-ping" />
                      </div>
                    )}
                  </div>
                  <div className="overflow-hidden min-w-0">
                    <h4 className={`text-xs font-bold truncate ${isCurrent ? 'text-indigo-300' : 'text-white'}`}>
                      {song.title}
                    </h4>
                    <p className="text-[11px] text-zinc-400 truncate mt-0.5">
                      {song.artist}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 flex-shrink-0" onClick={(e) => e.stopPropagation()}>
                  <button
                    onClick={() => toggleLike(song.id)}
                    className="p-1.5 text-zinc-400 hover:text-rose-400 active:scale-90 transition-all rounded-full"
                  >
                    <Heart
                      className={`w-4 h-4 ${
                        isLiked ? 'text-rose-500 fill-rose-500' : ''
                      }`}
                    />
                  </button>

                  <button
                    onClick={() => openAddToPlaylist(song)}
                    className="p-1.5 text-zinc-400 hover:text-white active:scale-90 transition-all rounded-full"
                  >
                    <MoreVertical className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Featured Artists */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-white tracking-tight flex items-center gap-2 font-['Poppins']">
            <Radio className="w-4 h-4 text-emerald-400" />
            <span>Artists to Follow</span>
          </h2>
        </div>

        <div className="flex gap-4 overflow-x-auto no-scrollbar pb-1">
          {INITIAL_ARTISTS.map((artist) => (
            <div
              key={artist.id}
              onClick={() => setActiveArtist(artist)}
              className="flex flex-col items-center cursor-pointer group active:scale-95 transition-transform flex-shrink-0 w-24 text-center"
            >
              <div className="w-20 h-20 rounded-full overflow-hidden shadow-lg border-2 border-transparent group-hover:border-indigo-400 transition-all mb-1.5">
                <img src={artist.avatarUrl} alt={artist.name} className="w-full h-full object-cover" />
              </div>
              <p className="text-xs font-bold text-white truncate w-full">{artist.name}</p>
              <p className="text-[10px] text-zinc-400 truncate w-full">Artist</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

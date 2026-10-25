import React from 'react';
import { useMusic } from '../../context/MusicContext';
import { Play, Pause, SkipForward, Heart } from 'lucide-react';

export const MiniPlayer: React.FC = () => {
  const {
    currentSong,
    isPlaying,
    currentTime,
    duration,
    togglePlayPause,
    playNext,
    likedSongIds,
    toggleLike,
    setIsFullPlayerOpen,
    themeColor,
    oledMode
  } = useMusic();

  if (!currentSong) return null;

  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;
  const isLiked = likedSongIds.has(currentSong.id);

  const themeGlowClass = {
    indigo: 'shadow-indigo-500/10 border-indigo-500/20',
    fuchsia: 'shadow-fuchsia-500/10 border-fuchsia-500/20',
    emerald: 'shadow-emerald-500/10 border-emerald-500/20',
    amber: 'shadow-amber-500/10 border-amber-500/20',
    rose: 'shadow-rose-500/10 border-rose-500/20',
    sky: 'shadow-sky-500/10 border-sky-500/20',
    dynamic: 'shadow-indigo-500/10 border-indigo-500/20'
  }[themeColor];

  const themeFillClass = {
    indigo: 'bg-indigo-500',
    fuchsia: 'bg-fuchsia-500',
    emerald: 'bg-emerald-500',
    amber: 'bg-amber-500',
    rose: 'bg-rose-500',
    sky: 'bg-sky-500',
    dynamic: 'bg-indigo-500'
  }[themeColor];

  return (
    <div className="fixed bottom-[68px] left-0 right-0 z-20 px-3 pointer-events-none">
      <div
        onClick={() => setIsFullPlayerOpen(true)}
        className={`max-w-md mx-auto pointer-events-auto cursor-pointer rounded-2xl overflow-hidden backdrop-blur-xl border shadow-xl transition-all duration-200 active:scale-[0.99] group ${themeGlowClass} ${
          oledMode ? 'bg-zinc-950/95' : 'bg-[#161722]/95'
        }`}
      >
        {/* Progress Bar Top */}
        <div className="w-full h-1 bg-white/10 overflow-hidden relative">
          <div
            className={`h-full transition-all duration-150 ${themeFillClass}`}
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        <div className="p-2.5 flex items-center justify-between gap-3">
          {/* Artwork & Info */}
          <div className="flex items-center gap-3 overflow-hidden min-w-0">
            <div className="relative w-12 h-12 rounded-xl overflow-hidden flex-shrink-0 bg-zinc-800 shadow-md">
              <img
                src={currentSong.artworkUrl}
                alt={currentSong.title}
                className={`w-full h-full object-cover transition-transform duration-500 ${isPlaying ? 'scale-105' : 'scale-100'}`}
              />
              {isPlaying && (
                <div className="absolute inset-0 bg-black/30 flex items-center justify-center gap-0.5 backdrop-blur-[1px]">
                  <span className="w-1 h-3.5 bg-white rounded-full animate-bounce [animation-delay:0ms]" />
                  <span className="w-1 h-5 bg-white rounded-full animate-bounce [animation-delay:150ms]" />
                  <span className="w-1 h-3 bg-white rounded-full animate-bounce [animation-delay:300ms]" />
                </div>
              )}
            </div>

            <div className="overflow-hidden min-w-0">
              <h4 className="text-sm font-semibold text-white truncate tracking-tight group-hover:text-indigo-300 transition-colors">
                {currentSong.title}
              </h4>
              <p className="text-xs text-zinc-400 truncate font-medium">
                {currentSong.artist}
              </p>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="flex items-center gap-1 flex-shrink-0" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={() => toggleLike(currentSong.id)}
              className="p-2 text-zinc-400 hover:text-rose-400 active:scale-90 transition-all rounded-full hover:bg-white/5"
              aria-label="Like"
            >
              <Heart
                className={`w-5 h-5 transition-transform ${
                  isLiked ? 'text-rose-500 fill-rose-500 scale-110' : ''
                }`}
              />
            </button>

            <button
              onClick={togglePlayPause}
              className={`w-10 h-10 rounded-full flex items-center justify-center text-white shadow-md active:scale-90 transition-all ${themeFillClass}`}
              aria-label={isPlaying ? 'Pause' : 'Play'}
            >
              {isPlaying ? (
                <Pause className="w-5 h-5 fill-white stroke-none" />
              ) : (
                <Play className="w-5 h-5 fill-white stroke-none ml-0.5" />
              )}
            </button>

            <button
              onClick={playNext}
              className="p-2 text-zinc-400 hover:text-white active:scale-90 transition-all rounded-full hover:bg-white/5"
              aria-label="Next track"
            >
              <SkipForward className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

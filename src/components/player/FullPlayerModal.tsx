import React, { useState, useEffect, useRef } from 'react';
import { useMusic } from '../../context/MusicContext';
import { LyricsService } from '../../services/lyricsService';
import { LyricsLine } from '../../types/music';
import {
  ChevronDown,
  MoreVertical,
  Heart,
  Shuffle,
  Repeat,
  Repeat1,
  SkipBack,
  SkipForward,
  Play,
  Pause,
  RotateCcw,
  RotateCw,
  Sliders,
  Clock,
  PlusCircle,
  Share2,
  Volume2,
  VolumeX,
  FileText,
  ListMusic,
  Disc3,
  Languages,
  Sparkles,
  ExternalLink,
  Trash2
} from 'lucide-react';
import { LyricsShareModal } from '../lyrics/LyricsShareModal';

export const FullPlayerModal: React.FC = () => {
  const {
    currentSong,
    isPlaying,
    currentTime,
    duration,
    seekTo,
    togglePlayPause,
    playNext,
    playPrevious,
    repeatMode,
    toggleRepeat,
    isShuffled,
    toggleShuffle,
    volume,
    setVolume,
    isMuted,
    toggleMute,
    playbackRate,
    setPlaybackRate,
    likedSongIds,
    toggleLike,
    isFullPlayerOpen,
    setIsFullPlayerOpen,
    setIsEqModalOpen,
    setIsSleepTimerOpen,
    sleepTimerMinutes,
    openAddToPlaylist,
    queue,
    queueIndex,
    playSong,
    removeFromQueue,
    clearQueue,
    playerStyle,
    themeColor,
    oledMode,
    getVisualizerData
  } = useMusic();

  const [activeView, setActiveView] = useState<'art' | 'lyrics' | 'queue'>('art');
  const [lyricsLines, setLyricsLines] = useState<LyricsLine[]>([]);
  const [showRomanized, setShowRomanized] = useState(false);
  const [showTranslation, setShowTranslation] = useState(true);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [showSpeedMenu, setShowSpeedMenu] = useState(false);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const lyricsContainerRef = useRef<HTMLDivElement | null>(null);
  const activeLineRef = useRef<HTMLDivElement | null>(null);

  // Fetch or parse lyrics whenever current song changes
  useEffect(() => {
    if (!currentSong) return;
    let isCancelled = false;

    LyricsService.fetchLyricsFromLrclib(currentSong).then((lines) => {
      if (!isCancelled) {
        setLyricsLines(lines);
      }
    });

    return () => {
      isCancelled = true;
    };
  }, [currentSong]);

  // Auto-scroll lyrics
  useEffect(() => {
    if (activeView === 'lyrics' && activeLineRef.current && lyricsContainerRef.current) {
      activeLineRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'center'
      });
    }
  }, [currentTime, activeView]);

  // Audio Visualizer Canvas animation loop
  useEffect(() => {
    if (!isFullPlayerOpen || activeView !== 'art') return;

    let animId: number;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const render = () => {
      const data = getVisualizerData();
      const width = canvas.width;
      const height = canvas.height;

      ctx.clearRect(0, 0, width, height);

      const barCount = 28;
      const barWidth = (width / barCount) * 0.65;
      const gap = (width - barCount * barWidth) / (barCount + 1);

      for (let i = 0; i < barCount; i++) {
        const val = data[i] || 0;
        const barHeight = Math.max(4, (val / 255) * height * 0.85);
        const x = gap + i * (barWidth + gap);
        const y = height - barHeight;

        // Gradient bar
        const gradient = ctx.createLinearGradient(0, height, 0, y);
        gradient.addColorStop(0, 'rgba(99, 102, 241, 0.4)');
        gradient.addColorStop(1, 'rgba(168, 85, 247, 0.9)');

        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.roundRect(x, y, barWidth, barHeight, 4);
        ctx.fill();
      }

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animId);
    };
  }, [isFullPlayerOpen, activeView, getVisualizerData]);

  if (!isFullPlayerOpen || !currentSong) return null;

  const isLiked = likedSongIds.has(currentSong.id);
  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;

  // Format mm:ss
  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  // Find active lyrics line index
  let activeLyricIndex = -1;
  for (let i = 0; i < lyricsLines.length; i++) {
    if (currentTime >= lyricsLines[i].time) {
      activeLyricIndex = i;
    } else {
      break;
    }
  }

  const themeColors = {
    indigo: { glow: 'from-indigo-600/30', btn: 'bg-indigo-600 hover:bg-indigo-500 shadow-indigo-500/30' },
    fuchsia: { glow: 'from-fuchsia-600/30', btn: 'bg-fuchsia-600 hover:bg-fuchsia-500 shadow-fuchsia-500/30' },
    emerald: { glow: 'from-emerald-600/30', btn: 'bg-emerald-600 hover:bg-emerald-500 shadow-emerald-500/30' },
    amber: { glow: 'from-amber-600/30', btn: 'bg-amber-600 hover:bg-amber-500 shadow-amber-500/30' },
    rose: { glow: 'from-rose-600/30', btn: 'bg-rose-600 hover:bg-rose-500 shadow-rose-500/30' },
    sky: { glow: 'from-sky-600/30', btn: 'bg-sky-600 hover:bg-sky-500 shadow-sky-500/30' },
    dynamic: { glow: 'from-indigo-600/30', btn: 'bg-indigo-600 hover:bg-indigo-500 shadow-indigo-500/30' }
  }[themeColor];

  return (
    <div className={`fixed inset-0 z-50 flex flex-col justify-between overflow-hidden animate-in slide-in-from-bottom duration-300 ${
      oledMode ? 'bg-black text-white' : 'bg-[#0c0d14] text-white'
    }`}>
      {/* Background Ambient Glow */}
      <div
        className={`absolute -top-32 left-1/2 -translate-x-1/2 w-[550px] h-[550px] rounded-full blur-[120px] pointer-events-none bg-gradient-to-b ${themeColors.glow} to-transparent opacity-60`}
      />

      {/* Top App Bar */}
      <div className="relative z-10 px-4 py-3 flex items-center justify-between">
        <button
          onClick={() => setIsFullPlayerOpen(false)}
          className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-white/10 active:scale-90 transition-all text-zinc-300 hover:text-white"
          aria-label="Minimize player"
        >
          <ChevronDown className="w-6 h-6" />
        </button>

        {/* View Switcher Pills */}
        <div className="flex items-center gap-1 bg-white/10 p-1 rounded-full backdrop-blur-md border border-white/5">
          <button
            onClick={() => setActiveView('art')}
            className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1.5 transition-all ${
              activeView === 'art'
                ? 'bg-white text-black shadow-md'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            <Disc3 className="w-3.5 h-3.5" />
            <span>Song</span>
          </button>

          <button
            onClick={() => setActiveView('lyrics')}
            className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1.5 transition-all ${
              activeView === 'lyrics'
                ? 'bg-white text-black shadow-md'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Lyrics</span>
          </button>

          <button
            onClick={() => setActiveView('queue')}
            className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1.5 transition-all ${
              activeView === 'queue'
                ? 'bg-white text-black shadow-md'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            <ListMusic className="w-3.5 h-3.5" />
            <span>Queue ({queue.length})</span>
          </button>
        </div>

        {/* Top Right Options */}
        <div className="relative">
          <button
            onClick={() => setShowSpeedMenu(!showSpeedMenu)}
            className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-white/10 active:scale-90 transition-all text-zinc-300 hover:text-white"
            aria-label="Player options"
          >
            <MoreVertical className="w-5 h-5" />
          </button>

          {showSpeedMenu && (
            <div className="absolute right-0 top-12 w-48 rounded-2xl bg-zinc-900 border border-white/10 p-2 shadow-2xl z-30 animate-in fade-in zoom-in-95">
              <div className="px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider text-zinc-400">
                Playback Speed
              </div>
              {[0.75, 1.0, 1.25, 1.5, 2.0].map((rate) => (
                <button
                  key={rate}
                  onClick={() => {
                    setPlaybackRate(rate);
                    setShowSpeedMenu(false);
                  }}
                  className={`w-full px-3 py-1.5 text-xs font-medium rounded-lg text-left flex items-center justify-between ${
                    playbackRate === rate ? 'bg-indigo-500/20 text-indigo-400 font-bold' : 'text-zinc-300 hover:bg-white/5'
                  }`}
                >
                  <span>{rate === 1.0 ? 'Normal (1.0x)' : `${rate}x`}</span>
                  {playbackRate === rate && <span className="w-1.5 h-1.5 rounded-full bg-indigo-400" />}
                </button>
              ))}
              <div className="h-px bg-white/10 my-1" />
              <button
                onClick={() => {
                  setIsEqModalOpen(true);
                  setShowSpeedMenu(false);
                }}
                className="w-full px-3 py-2 text-xs font-medium rounded-lg text-left text-zinc-300 hover:bg-white/5 flex items-center gap-2"
              >
                <Sliders className="w-4 h-4 text-indigo-400" />
                <span>Equalizer</span>
              </button>
              <button
                onClick={() => {
                  setIsSleepTimerOpen(true);
                  setShowSpeedMenu(false);
                }}
                className="w-full px-3 py-2 text-xs font-medium rounded-lg text-left text-zinc-300 hover:bg-white/5 flex items-center gap-2"
              >
                <Clock className="w-4 h-4 text-amber-400" />
                <span>Sleep Timer</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Middle Interactive Section */}
      <div className="relative z-10 flex-1 flex flex-col justify-center px-6 overflow-hidden">
        {/* VIEW 1: ALBUM ART & VISUALIZER */}
        {activeView === 'art' && (
          <div className="w-full flex flex-col items-center justify-center gap-6 my-auto">
            {playerStyle === 'vinyl' ? (
              // Vinyl Record Style
              <div className="relative w-64 h-64 sm:w-72 sm:h-72 flex items-center justify-center">
                {/* Vinyl Disc */}
                <div
                  className={`absolute inset-0 rounded-full bg-[#111115] border-4 border-[#22222a] shadow-2xl flex items-center justify-center ${
                    isPlaying ? 'animate-spin-slow' : 'paused'
                  }`}
                  style={{
                    backgroundImage: 'radial-gradient(circle, #24242e 2px, transparent 2px), repeating-radial-gradient(circle, #15151b 0, #15151b 3px, #202029 4px, #202029 5px)'
                  }}
                >
                  {/* Center Label */}
                  <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-white/20 shadow-inner">
                    <img src={currentSong.artworkUrl} alt="" className="w-full h-full object-cover" />
                  </div>
                  <div className="absolute w-4 h-4 rounded-full bg-white/90 border-2 border-zinc-900" />
                </div>
              </div>
            ) : (
              // Expressive M3 / Glass Card Style
              <div className="relative group">
                <div
                  className="w-64 h-64 sm:w-80 sm:h-80 rounded-3xl overflow-hidden shadow-2xl relative border border-white/10 transition-transform duration-300 group-hover:scale-[1.02]"
                >
                  <img
                    src={currentSong.artworkUrl}
                    alt={currentSong.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />
                </div>
                {/* Visualizer Underlay */}
                <div className="w-64 sm:w-80 mt-4 flex justify-center">
                  <canvas
                    ref={canvasRef}
                    width={320}
                    height={40}
                    className="w-full h-10 opacity-80"
                  />
                </div>
              </div>
            )}
          </div>
        )}

        {/* VIEW 2: LIVE SYNCED LYRICS */}
        {activeView === 'lyrics' && (
          <div className="w-full h-[360px] sm:h-[420px] flex flex-col my-auto relative">
            {/* Lyrics Options Bar */}
            <div className="flex items-center justify-between mb-3 px-2">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowTranslation(!showTranslation)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-medium border flex items-center gap-1 transition-all ${
                    showTranslation
                      ? 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30'
                      : 'border-white/10 text-zinc-400'
                  }`}
                >
                  <Languages className="w-3.5 h-3.5" />
                  <span>Translate</span>
                </button>

                <button
                  onClick={() => setShowRomanized(!showRomanized)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-medium border flex items-center gap-1 transition-all ${
                    showRomanized
                      ? 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30'
                      : 'border-white/10 text-zinc-400'
                  }`}
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Romaji</span>
                </button>
              </div>

              <button
                onClick={() => setIsShareModalOpen(true)}
                className="px-2.5 py-1 rounded-lg text-xs font-medium bg-white/10 text-zinc-300 hover:text-white border border-white/10 flex items-center gap-1.5 transition-all"
              >
                <Share2 className="w-3.5 h-3.5" />
                <span>Share Card</span>
              </button>
            </div>

            {/* Lyrics Scrollable Area */}
            <div
              ref={lyricsContainerRef}
              className="flex-1 overflow-y-auto px-2 space-y-6 py-12 scroll-smooth text-center"
            >
              {lyricsLines.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-zinc-400">
                  <FileText className="w-10 h-10 mb-2 opacity-50" />
                  <p className="text-sm">Looking up synchronized lyrics...</p>
                </div>
              ) : (
                lyricsLines.map((line, idx) => {
                  const isActive = idx === activeLyricIndex;
                  return (
                    <div
                      key={idx}
                      ref={isActive ? activeLineRef : null}
                      onClick={() => seekTo(line.time)}
                      className={`cursor-pointer transition-all duration-300 select-none py-1.5 ${
                        isActive
                          ? 'scale-105 text-white font-bold opacity-100'
                          : 'text-zinc-500 hover:text-zinc-300 font-medium opacity-60'
                      }`}
                    >
                      <p className={`text-lg sm:text-xl leading-relaxed tracking-tight ${isActive ? 'drop-shadow-[0_0_12px_rgba(255,255,255,0.4)]' : ''}`}>
                        {line.text}
                      </p>
                      {showRomanized && line.romanized && (
                        <p className="text-xs text-indigo-300 italic mt-0.5 font-normal tracking-wide">
                          {line.romanized}
                        </p>
                      )}
                      {showTranslation && line.translation && (
                        <p className="text-xs text-zinc-400 mt-1 font-normal">
                          {line.translation}
                        </p>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          </div>
        )}

        {/* VIEW 3: UP NEXT QUEUE */}
        {activeView === 'queue' && (
          <div className="w-full h-[360px] sm:h-[420px] flex flex-col my-auto relative">
            <div className="flex items-center justify-between mb-2 px-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
                Playing Next ({queue.length} tracks)
              </span>
              <button
                onClick={clearQueue}
                className="text-xs text-rose-400 hover:underline flex items-center gap-1"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Clear queue</span>
              </button>
            </div>

            <div className="flex-1 overflow-y-auto space-y-1.5 pr-1">
              {queue.map((song, idx) => {
                const isCurrent = idx === queueIndex;
                return (
                  <div
                    key={`${song.id}-${idx}`}
                    onClick={() => playSong(song)}
                    className={`flex items-center justify-between p-2.5 rounded-xl cursor-pointer transition-all ${
                      isCurrent
                        ? 'bg-indigo-500/20 border border-indigo-500/40 text-white'
                        : 'hover:bg-white/5 text-zinc-300'
                    }`}
                  >
                    <div className="flex items-center gap-3 overflow-hidden">
                      <div className="relative w-10 h-10 rounded-lg overflow-hidden flex-shrink-0">
                        <img src={song.artworkUrl} alt="" className="w-full h-full object-cover" />
                        {isCurrent && isPlaying && (
                          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                            <span className="w-2 h-2 rounded-full bg-indigo-400 animate-ping" />
                          </div>
                        )}
                      </div>
                      <div className="overflow-hidden">
                        <h5 className="text-xs font-semibold truncate">{song.title}</h5>
                        <p className="text-[11px] text-zinc-400 truncate">{song.artist}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-xs text-zinc-400">{song.durationFormatted}</span>
                      {queue.length > 1 && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            removeFromQueue(idx);
                          }}
                          className="p-1 hover:text-rose-400 text-zinc-500 rounded-md"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Bottom Player Controls & Sliders */}
      <div className="relative z-10 px-6 pb-6 pt-2 space-y-4 max-w-md mx-auto w-full">
        {/* Track Title, Artist, & Like Button */}
        <div className="flex items-center justify-between">
          <div className="overflow-hidden min-w-0 pr-3">
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white truncate font-['Poppins']">
              {currentSong.title}
            </h2>
            <p className="text-sm font-medium text-zinc-400 truncate mt-0.5">
              {currentSong.artist} • <span className="text-zinc-500">{currentSong.album}</span>
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => openAddToPlaylist(currentSong)}
              className="w-10 h-10 rounded-full flex items-center justify-center text-zinc-400 hover:text-white hover:bg-white/10 active:scale-90 transition-all"
              title="Add to Playlist"
            >
              <PlusCircle className="w-5 h-5" />
            </button>

            <button
              onClick={() => toggleLike(currentSong.id)}
              className="w-10 h-10 rounded-full flex items-center justify-center text-zinc-400 hover:text-rose-400 hover:bg-white/10 active:scale-90 transition-all"
              title="Favorite"
            >
              <Heart
                className={`w-6 h-6 transition-transform ${
                  isLiked ? 'text-rose-500 fill-rose-500 scale-110' : ''
                }`}
              />
            </button>
          </div>
        </div>

        {/* Wavy / Expressive Seek Bar */}
        <div className="space-y-1">
          <div className="relative group py-2 cursor-pointer">
            <input
              type="range"
              min="0"
              max={duration || 100}
              step="0.5"
              value={currentTime}
              onChange={(e) => seekTo(parseFloat(e.target.value))}
              className="w-full h-1.5 bg-white/15 rounded-lg appearance-none cursor-pointer accent-indigo-400 focus:outline-none"
            />
          </div>
          <div className="flex justify-between text-xs font-semibold text-zinc-400">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(duration)}</span>
          </div>
        </div>

        {/* Primary Playback Controls Row */}
        <div className="flex items-center justify-between pt-1">
          {/* Shuffle Toggle */}
          <button
            onClick={toggleShuffle}
            className={`w-11 h-11 rounded-full flex items-center justify-center relative transition-all active:scale-90 ${
              isShuffled ? 'text-indigo-400 bg-indigo-500/10' : 'text-zinc-400 hover:text-white'
            }`}
            title="Shuffle"
          >
            <Shuffle className="w-5 h-5" />
            {isShuffled && <span className="absolute bottom-1 w-1 h-1 rounded-full bg-indigo-400" />}
          </button>

          {/* Previous Track */}
          <button
            onClick={playPrevious}
            className="w-12 h-12 rounded-full flex items-center justify-center text-zinc-300 hover:text-white active:scale-90 transition-all"
            title="Previous"
          >
            <SkipBack className="w-7 h-7 fill-current stroke-none" />
          </button>

          {/* Big Play / Pause Button with Ripple Effect */}
          <button
            onClick={togglePlayPause}
            className={`w-18 h-18 rounded-full flex items-center justify-center text-white shadow-2xl transition-all duration-200 active:scale-95 ${themeColors.btn}`}
            title={isPlaying ? 'Pause' : 'Play'}
          >
            {isPlaying ? (
              <Pause className="w-8 h-8 fill-white stroke-none" />
            ) : (
              <Play className="w-8 h-8 fill-white stroke-none ml-1" />
            )}
          </button>

          {/* Next Track */}
          <button
            onClick={playNext}
            className="w-12 h-12 rounded-full flex items-center justify-center text-zinc-300 hover:text-white active:scale-90 transition-all"
            title="Next"
          >
            <SkipForward className="w-7 h-7 fill-current stroke-none" />
          </button>

          {/* Repeat Mode Toggle */}
          <button
            onClick={toggleRepeat}
            className={`w-11 h-11 rounded-full flex items-center justify-center relative transition-all active:scale-90 ${
              repeatMode !== 'off' ? 'text-indigo-400 bg-indigo-500/10' : 'text-zinc-400 hover:text-white'
            }`}
            title={`Repeat: ${repeatMode}`}
          >
            {repeatMode === 'one' ? (
              <Repeat1 className="w-5 h-5" />
            ) : (
              <Repeat className="w-5 h-5" />
            )}
            {repeatMode !== 'off' && (
              <span className="absolute bottom-1 w-1 h-1 rounded-full bg-indigo-400" />
            )}
          </button>
        </div>

        {/* Bottom Utility Pills */}
        <div className="flex items-center justify-between pt-2 border-t border-white/5 text-xs text-zinc-400">
          <div className="flex items-center gap-3">
            {/* Speed indicator */}
            <span
              onClick={() => setShowSpeedMenu(!showSpeedMenu)}
              className="cursor-pointer font-semibold px-2 py-0.5 rounded-md bg-white/5 hover:bg-white/10 text-zinc-300 border border-white/5"
            >
              {playbackRate}x
            </span>

            {/* Sleep Timer badge if active */}
            {sleepTimerMinutes && (
              <div
                onClick={() => setIsSleepTimerOpen(true)}
                className="cursor-pointer flex items-center gap-1 text-amber-400 font-semibold px-2 py-0.5 rounded-md bg-amber-500/10 border border-amber-500/20"
              >
                <Clock className="w-3 h-3" />
                <span>{sleepTimerMinutes}m</span>
              </div>
            )}
          </div>

          {/* Volume slider */}
          <div className="flex items-center gap-2">
            <button onClick={toggleMute} className="text-zinc-400 hover:text-white">
              {isMuted || volume === 0 ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            </button>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={isMuted ? 0 : volume}
              onChange={(e) => setVolume(parseFloat(e.target.value))}
              className="w-20 h-1 bg-white/20 rounded-lg appearance-none accent-indigo-400 cursor-pointer"
            />
          </div>
        </div>
      </div>

      {/* Lyrics Share Modal */}
      {isShareModalOpen && currentSong && (
        <LyricsShareModal
          song={currentSong}
          lyrics={lyricsLines}
          activeLyricIndex={activeLyricIndex}
          onClose={() => setIsShareModalOpen(false)}
        />
      )}
    </div>
  );
};

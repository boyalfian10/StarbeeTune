import React from 'react';
import { useMusic } from '../../context/MusicContext';
import { Search, Sliders, Music, Radio, Sparkles } from 'lucide-react';

export const AppHeader: React.FC = () => {
  const { setActiveTab, setIsEqModalOpen, themeColor, oledMode } = useMusic();

  const themeAccentClasses = {
    indigo: 'text-indigo-400 bg-indigo-500/10 border-indigo-500/20',
    fuchsia: 'text-fuchsia-400 bg-fuchsia-500/10 border-fuchsia-500/20',
    emerald: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
    amber: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
    rose: 'text-rose-400 bg-rose-500/10 border-rose-500/20',
    sky: 'text-sky-400 bg-sky-500/10 border-sky-500/20',
    dynamic: 'text-indigo-400 bg-indigo-500/10 border-indigo-500/20'
  }[themeColor];

  return (
    <header className={`sticky top-0 z-30 px-4 py-3 flex items-center justify-between backdrop-blur-md border-b ${
      oledMode ? 'bg-black/90 border-white/5' : 'bg-[#0f1017]/80 border-white/5'
    }`}>
      {/* Brand & Logo */}
      <div 
        onClick={() => setActiveTab('home')}
        className="flex items-center gap-2.5 cursor-pointer group select-none"
      >
        <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-fuchsia-500 flex items-center justify-center shadow-lg shadow-indigo-500/20 transition-transform group-hover:scale-105 active:scale-95">
          <Music className="w-5 h-5 text-white stroke-[2.5]" />
        </div>
        <div>
          <div className="flex items-center gap-1.5">
            <span className="font-bold text-lg tracking-tight text-white font-['Poppins']">StarbeeTune</span>
            <span className="px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider rounded-md bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
              v15.1
            </span>
          </div>
          <p className="text-[11px] text-zinc-400 font-medium">ArchiveTune Edition</p>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-1.5">
        <button
          onClick={() => setActiveTab('search')}
          className="w-10 h-10 rounded-full flex items-center justify-center text-zinc-300 hover:text-white hover:bg-white/10 active:scale-95 transition-all"
          title="Search"
          aria-label="Search"
        >
          <Search className="w-5 h-5" />
        </button>

        <button
          onClick={() => setIsEqModalOpen(true)}
          className={`w-10 h-10 rounded-full flex items-center justify-center border hover:bg-white/10 active:scale-95 transition-all ${themeAccentClasses}`}
          title="Equalizer"
          aria-label="Equalizer"
        >
          <Sliders className="w-5 h-5" />
        </button>

        <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs text-zinc-300 font-medium">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>Lossless HD</span>
        </div>
      </div>
    </header>
  );
};

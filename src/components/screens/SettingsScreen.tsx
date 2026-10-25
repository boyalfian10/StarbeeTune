import React, { useState, useRef } from 'react';
import { useMusic } from '../../context/MusicContext';
import { StorageService } from '../../services/storageService';
import { PlayerStyle, AppThemeColor } from '../../types/music';
import {
  Settings,
  Palette,
  Sliders,
  Volume2,
  HardDrive,
  Info,
  Moon,
  Disc,
  Layers,
  Sparkles,
  Download,
  Upload,
  Check,
  RefreshCw,
  ExternalLink
} from 'lucide-react';

export const SettingsScreen: React.FC = () => {
  const {
    playerStyle,
    setPlayerStyle,
    themeColor,
    setThemeColor,
    oledMode,
    setOledMode,
    setIsEqModalOpen,
    setIsSleepTimerOpen
  } = useMusic();

  const [backupSuccess, setBackupSuccess] = useState<string | null>(null);
  const backupInputRef = useRef<HTMLInputElement | null>(null);

  const playerStyles: { id: PlayerStyle; name: string; desc: string }[] = [
    { id: 'm3_expressive', name: 'M3 Expressive', desc: 'Material Design 3 card with live visualizer' },
    { id: 'vinyl', name: 'Vinyl Player', desc: 'Retro spinning turntable with tonearm' },
    { id: 'glass', name: 'Glassmorphism', desc: 'Frosted acrylic with glowing ambient halo' },
    { id: 'card', name: 'Hero Card', desc: 'Edge-to-edge album artwork presentation' },
    { id: 'minimal', name: 'Minimalist', desc: 'Clean, distraction-free player' }
  ];

  const themeColors: { id: AppThemeColor; name: string; colorClass: string }[] = [
    { id: 'indigo', name: 'Indigo Core', colorClass: 'bg-indigo-600' },
    { id: 'fuchsia', name: 'Neon Purple', colorClass: 'bg-fuchsia-600' },
    { id: 'emerald', name: 'Emerald Forest', colorClass: 'bg-emerald-600' },
    { id: 'amber', name: 'Warm Amber', colorClass: 'bg-amber-600' },
    { id: 'rose', name: 'Sunset Rose', colorClass: 'bg-rose-600' },
    { id: 'sky', name: 'Electric Sky', colorClass: 'bg-sky-600' }
  ];

  const handleExportBackup = () => {
    const jsonStr = StorageService.exportBackup();
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `StarbeeTune-backup-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    setBackupSuccess('Backup exported successfully!');
    setTimeout(() => setBackupSuccess(null), 3000);
  };

  const handleImportBackup = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content && StorageService.importBackup(content)) {
        setBackupSuccess('Backup restored! Reloading...');
        setTimeout(() => window.location.reload(), 1200);
      } else {
        alert('Invalid backup file format');
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="pb-36 pt-2 px-4 max-w-md sm:max-w-xl mx-auto space-y-6">
      {/* Title */}
      <div className="pt-2">
        <h1 className="text-2xl font-extrabold text-white tracking-tight font-['Poppins']">
          Settings & Preferences
        </h1>
      </div>

      {backupSuccess && (
        <div className="p-3.5 rounded-2xl bg-emerald-950/40 border border-emerald-500/30 text-emerald-300 text-xs font-semibold flex items-center gap-2 animate-in fade-in">
          <Check className="w-4 h-4 text-emerald-400" />
          <span>{backupSuccess}</span>
        </div>
      )}

      {/* SECTION 1: APPEARANCE & PLAYER STYLE */}
      <section className="space-y-3">
        <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-400 flex items-center gap-2">
          <Palette className="w-4 h-4 text-indigo-400" />
          <span>Player & Theme Appearance</span>
        </h3>

        {/* Player Style Selector */}
        <div className="space-y-2 bg-zinc-900/60 p-3 rounded-2xl border border-white/5">
          <label className="text-xs font-semibold text-zinc-300 block mb-1">
            Now Playing Player Style
          </label>
          <div className="space-y-1.5">
            {playerStyles.map((style) => {
              const isSelected = playerStyle === style.id;
              return (
                <div
                  key={style.id}
                  onClick={() => setPlayerStyle(style.id)}
                  className={`p-2.5 rounded-xl border cursor-pointer transition-all flex items-center justify-between ${
                    isSelected
                      ? 'bg-indigo-600/20 border-indigo-500/40 text-white'
                      : 'bg-white/5 border-transparent text-zinc-400 hover:text-white'
                  }`}
                >
                  <div>
                    <h5 className="text-xs font-bold">{style.name}</h5>
                    <p className="text-[11px] text-zinc-500">{style.desc}</p>
                  </div>
                  {isSelected && <Check className="w-4 h-4 text-indigo-400" />}
                </div>
              );
            })}
          </div>
        </div>

        {/* Accent Color Palette */}
        <div className="bg-zinc-900/60 p-3.5 rounded-2xl border border-white/5 space-y-2">
          <label className="text-xs font-semibold text-zinc-300 block">
            System Accent Palette
          </label>
          <div className="grid grid-cols-6 gap-2">
            {themeColors.map((c) => {
              const isSelected = themeColor === c.id;
              return (
                <button
                  key={c.id}
                  onClick={() => setThemeColor(c.id)}
                  className={`w-full aspect-square rounded-xl ${c.colorClass} flex items-center justify-center transition-transform active:scale-90 ${
                    isSelected ? 'ring-2 ring-white ring-offset-2 ring-offset-zinc-900 scale-105' : 'opacity-80 hover:opacity-100'
                  }`}
                  title={c.name}
                >
                  {isSelected && <Check className="w-4 h-4 text-white stroke-[3]" />}
                </button>
              );
            })}
          </div>
        </div>

        {/* OLED Pure Black Toggle */}
        <div className="bg-zinc-900/60 p-3.5 rounded-2xl border border-white/5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center text-zinc-300">
              <Moon className="w-4 h-4" />
            </div>
            <div>
              <h5 className="text-xs font-bold text-white">OLED Pure Black</h5>
              <p className="text-[11px] text-zinc-400">Save battery on OLED/AMOLED screens</p>
            </div>
          </div>
          <button
            onClick={() => setOledMode(!oledMode)}
            className={`w-11 h-6 rounded-full p-1 transition-colors relative ${
              oledMode ? 'bg-indigo-600' : 'bg-zinc-700'
            }`}
          >
            <div
              className={`w-4 h-4 rounded-full bg-white transition-transform ${
                oledMode ? 'translate-x-5' : 'translate-x-0'
              }`}
            />
          </button>
        </div>
      </section>

      {/* SECTION 2: AUDIO PROCESSING */}
      <section className="space-y-3">
        <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-400 flex items-center gap-2">
          <Volume2 className="w-4 h-4 text-indigo-400" />
          <span>Audio & Playback</span>
        </h3>

        <div className="space-y-2">
          <button
            onClick={() => setIsEqModalOpen(true)}
            className="w-full p-3.5 rounded-2xl bg-zinc-900/60 hover:bg-zinc-900 border border-white/5 flex items-center justify-between text-left transition-all"
          >
            <div className="flex items-center gap-3">
              <Sliders className="w-5 h-5 text-indigo-400" />
              <div>
                <h5 className="text-xs font-bold text-white">Equalizer & Bass Boost</h5>
                <p className="text-[11px] text-zinc-400">5 bands DSP, Loudness normalization</p>
              </div>
            </div>
            <span className="text-xs text-indigo-400 font-semibold">Configure</span>
          </button>

          <button
            onClick={() => setIsSleepTimerOpen(true)}
            className="w-full p-3.5 rounded-2xl bg-zinc-900/60 hover:bg-zinc-900 border border-white/5 flex items-center justify-between text-left transition-all"
          >
            <div className="flex items-center gap-3">
              <Moon className="w-5 h-5 text-amber-400" />
              <div>
                <h5 className="text-xs font-bold text-white">Sleep Timer</h5>
                <p className="text-[11px] text-zinc-400">Turn off music after duration or track end</p>
              </div>
            </div>
            <span className="text-xs text-amber-400 font-semibold">Set Timer</span>
          </button>
        </div>
      </section>

      {/* SECTION 3: BACKUP & RESTORE */}
      <section className="space-y-3">
        <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-400 flex items-center gap-2">
          <HardDrive className="w-4 h-4 text-indigo-400" />
          <span>Backup & Database</span>
        </h3>

        <div className="grid grid-cols-2 gap-2.5">
          <button
            onClick={handleExportBackup}
            className="p-3 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/5 flex items-center gap-2.5 text-left transition-all active:scale-95"
          >
            <Download className="w-5 h-5 text-indigo-400 flex-shrink-0" />
            <div>
              <p className="text-xs font-bold text-white">Export Backup</p>
              <p className="text-[10px] text-zinc-400">Save playlists & likes</p>
            </div>
          </button>

          <button
            onClick={() => backupInputRef.current?.click()}
            className="p-3 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/5 flex items-center gap-2.5 text-left transition-all active:scale-95"
          >
            <Upload className="w-5 h-5 text-fuchsia-400 flex-shrink-0" />
            <div>
              <p className="text-xs font-bold text-white">Import Backup</p>
              <p className="text-[10px] text-zinc-400">Restore from JSON</p>
            </div>
          </button>
          <input
            ref={backupInputRef}
            type="file"
            accept=".json"
            onChange={handleImportBackup}
            className="hidden"
          />
        </div>
      </section>

      {/* SECTION 4: ABOUT ARCHIVETUNE / STARBEETUNE */}
      <section className="p-4 rounded-3xl bg-gradient-to-br from-indigo-950/40 via-purple-950/20 to-zinc-900 border border-white/10 space-y-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-indigo-500 to-fuchsia-500 flex items-center justify-center font-bold text-white shadow-lg shadow-indigo-500/20">
            ST
          </div>
          <div>
            <h4 className="font-bold text-sm text-white font-['Poppins']">StarbeeTune (ArchiveTune)</h4>
            <p className="text-[11px] text-zinc-400">Version 15.1.0 • Release Build</p>
          </div>
        </div>

        <p className="text-xs text-zinc-300 leading-relaxed">
          High-performance, privacy-first YouTube Music client with synced lyrics, EBU R128 loudness normalization, custom equalizer, and Material 3 design.
        </p>

        <div className="pt-1 flex items-center justify-between text-xs text-zinc-400 border-t border-white/10">
          <span>Forked from ArchiveTune by rukamori</span>
          <span className="font-mono text-[10px]">GPL-3.0 License</span>
        </div>
      </section>
    </div>
  );
};

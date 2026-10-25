import React from 'react';
import { useMusic } from '../../context/MusicContext';
import { X, Clock, Check, Moon } from 'lucide-react';

export const SleepTimerModal: React.FC = () => {
  const { isSleepTimerOpen, setIsSleepTimerOpen, sleepTimerMinutes, setSleepTimer, duration, currentTime } = useMusic();

  if (!isSleepTimerOpen) return null;

  const timerOptions = [
    { label: 'Turn Off', minutes: null },
    { label: 'End of Current Track', minutes: Math.max(1, Math.ceil((duration - currentTime) / 60)) },
    { label: '15 Minutes', minutes: 15 },
    { label: '30 Minutes', minutes: 30 },
    { label: '45 Minutes', minutes: 45 },
    { label: '60 Minutes', minutes: 60 }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="w-full max-w-sm rounded-3xl bg-zinc-900 border border-white/10 shadow-2xl p-5 flex flex-col gap-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center">
              <Moon className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-base text-white font-['Poppins']">Sleep Timer</h3>
              <p className="text-[11px] text-zinc-400">Stop playback automatically</p>
            </div>
          </div>
          <button
            onClick={() => setIsSleepTimerOpen(false)}
            className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-white/10 text-zinc-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Option list */}
        <div className="space-y-1.5">
          {timerOptions.map((opt, idx) => {
            const isSelected = sleepTimerMinutes === opt.minutes;
            return (
              <button
                key={idx}
                onClick={() => {
                  setSleepTimer(opt.minutes);
                  setIsSleepTimerOpen(false);
                }}
                className={`w-full p-3 rounded-xl text-left text-xs font-semibold flex items-center justify-between transition-all ${
                  isSelected
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                    : 'text-zinc-300 hover:bg-white/5'
                }`}
              >
                <span>{opt.label}</span>
                {isSelected && <Check className="w-4 h-4 text-amber-400" />}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

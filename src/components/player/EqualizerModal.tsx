import React from 'react';
import { useMusic } from '../../context/MusicContext';
import { EQ_PRESETS } from '../../services/storageService';
import { X, Sliders, Volume2, Sparkles, RotateCcw } from 'lucide-react';

export const EqualizerModal: React.FC = () => {
  const { equalizer, updateEqualizer, isEqModalOpen, setIsEqModalOpen, themeColor } = useMusic();

  if (!isEqModalOpen) return null;

  const handleSliderChange = (band: 'bass' | 'lowMid' | 'mid' | 'highMid' | 'treble', val: number) => {
    updateEqualizer({
      ...equalizer,
      [band]: val,
      preset: 'Custom'
    });
  };

  const handleBassBoost = (val: number) => {
    updateEqualizer({
      ...equalizer,
      bassBoost: val,
      preset: 'Custom'
    });
  };

  const handlePresetSelect = (presetName: string) => {
    const presetValues = EQ_PRESETS[presetName];
    if (presetValues) {
      updateEqualizer({
        ...equalizer,
        ...presetValues,
        preset: presetName
      });
    }
  };

  const bands = [
    { key: 'bass' as const, label: '60 Hz', sub: 'Sub-Bass' },
    { key: 'lowMid' as const, label: '230 Hz', sub: 'Bass' },
    { key: 'mid' as const, label: '910 Hz', sub: 'Mid' },
    { key: 'highMid' as const, label: '3.6 kHz', sub: 'Presence' },
    { key: 'treble' as const, label: '14 kHz', sub: 'Treble' }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="w-full max-w-md rounded-3xl bg-zinc-900 border border-white/10 shadow-2xl p-5 flex flex-col gap-5">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sliders className="w-5 h-5 text-indigo-400" />
            <div>
              <h3 className="font-bold text-base text-white font-['Poppins']">5-Band Equalizer</h3>
              <p className="text-[11px] text-zinc-400">EBU R128 Loudness DSP</p>
            </div>
          </div>
          <button
            onClick={() => setIsEqModalOpen(false)}
            className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-white/10 text-zinc-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Presets Chips */}
        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-400 block mb-2">
            Sound Profiles
          </span>
          <div className="flex flex-wrap gap-1.5">
            {Object.keys(EQ_PRESETS).map((p) => {
              const isActive = equalizer.preset === p;
              return (
                <button
                  key={p}
                  onClick={() => handlePresetSelect(p)}
                  className={`px-3 py-1 rounded-full text-xs font-semibold border transition-all ${
                    isActive
                      ? 'bg-indigo-600 text-white border-indigo-500 shadow-md shadow-indigo-600/30'
                      : 'bg-white/5 border-white/10 text-zinc-400 hover:text-white'
                  }`}
                >
                  {p}
                </button>
              );
            })}
          </div>
        </div>

        {/* 5-Band Vertical Slider Grid */}
        <div className="bg-black/30 p-4 rounded-2xl border border-white/5">
          <div className="flex items-center justify-between text-[10px] text-zinc-500 font-bold mb-3 px-1">
            <span>+12 dB</span>
            <span>0 dB</span>
            <span>-12 dB</span>
          </div>

          <div className="grid grid-cols-5 gap-3 h-44 items-center justify-items-center">
            {bands.map((b) => (
              <div key={b.key} className="flex flex-col items-center justify-between h-full">
                <span className="text-[11px] font-bold text-indigo-400">
                  {equalizer[b.key] > 0 ? `+${equalizer[b.key]}` : equalizer[b.key]}
                </span>

                <div className="relative flex-1 flex items-center my-1">
                  <input
                    type="range"
                    min="-12"
                    max="12"
                    step="1"
                    value={equalizer[b.key]}
                    onChange={(e) => handleSliderChange(b.key, parseInt(e.target.value, 10))}
                    style={{ transform: 'rotate(-90deg)', width: '110px' }}
                    className="accent-indigo-400 bg-white/20 appearance-none rounded-lg h-1.5 cursor-pointer"
                  />
                </div>

                <div className="text-center mt-1">
                  <div className="text-[10px] font-bold text-zinc-300">{b.label}</div>
                  <div className="text-[9px] text-zinc-500">{b.sub}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bass Boost & Loudness Normalization */}
        <div className="space-y-3 bg-black/20 p-3.5 rounded-2xl border border-white/5">
          <div>
            <div className="flex justify-between text-xs font-semibold mb-1">
              <span className="text-zinc-300">Bass Boost Power</span>
              <span className="text-indigo-400 font-bold">{equalizer.bassBoost}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              step="5"
              value={equalizer.bassBoost}
              onChange={(e) => handleBassBoost(parseInt(e.target.value, 10))}
              className="w-full h-1.5 bg-white/20 rounded-lg appearance-none accent-indigo-400 cursor-pointer"
            />
          </div>

          <div className="flex items-center justify-between pt-1">
            <div>
              <span className="text-xs font-semibold text-zinc-200 block">Loudness Normalization</span>
              <span className="text-[10px] text-zinc-500">Smooth volume spikes across tracks</span>
            </div>
            <button
              onClick={() => updateEqualizer({ ...equalizer, normalization: !equalizer.normalization })}
              className={`w-11 h-6 rounded-full p-1 transition-colors relative ${
                equalizer.normalization ? 'bg-indigo-600' : 'bg-zinc-700'
              }`}
            >
              <div
                className={`w-4 h-4 rounded-full bg-white transition-transform ${
                  equalizer.normalization ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>
        </div>

        {/* Done Button */}
        <button
          onClick={() => setIsEqModalOpen(false)}
          className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 active:scale-95 text-white font-semibold text-xs transition-all shadow-lg shadow-indigo-600/20"
        >
          Apply Equalizer
        </button>
      </div>
    </div>
  );
};

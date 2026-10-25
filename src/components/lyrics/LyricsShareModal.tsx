import React, { useState } from 'react';
import { Song, LyricsLine } from '../../types/music';
import { X, Copy, Check, Download, Sparkles } from 'lucide-react';

interface LyricsShareModalProps {
  song: Song;
  lyrics: LyricsLine[];
  activeLyricIndex: number;
  onClose: () => void;
}

export const LyricsShareModal: React.FC<LyricsShareModalProps> = ({
  song,
  lyrics,
  activeLyricIndex,
  onClose
}) => {
  const [selectedIndices, setSelectedIndices] = useState<number[]>(() => {
    if (activeLyricIndex >= 0 && activeLyricIndex < lyrics.length) {
      return [activeLyricIndex];
    }
    return [0];
  });

  const [cardStyle, setCardStyle] = useState<'cyber' | 'sunset' | 'glass' | 'monolith'>('cyber');
  const [copied, setCopied] = useState(false);

  const toggleLine = (idx: number) => {
    if (selectedIndices.includes(idx)) {
      if (selectedIndices.length > 1) {
        setSelectedIndices(selectedIndices.filter(i => i !== idx));
      }
    } else {
      if (selectedIndices.length < 4) {
        setSelectedIndices([...selectedIndices, idx].sort((a, b) => a - b));
      }
    }
  };

  const handleCopy = () => {
    const quote = selectedIndices.map(i => lyrics[i]?.text).filter(Boolean).join('\n');
    const fullText = `"${quote}"\n\n— ${song.title} by ${song.artist}\nShared via StarbeeTune (ArchiveTune)`;
    navigator.clipboard.writeText(fullText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const cardStyles = {
    cyber: 'bg-gradient-to-br from-indigo-950 via-purple-950 to-slate-950 border-purple-500/30 text-white',
    sunset: 'bg-gradient-to-br from-rose-900 via-amber-950 to-indigo-950 border-amber-500/30 text-white',
    glass: 'bg-white/10 backdrop-blur-2xl border-white/20 text-white',
    monolith: 'bg-zinc-950 border-zinc-800 text-zinc-100'
  }[cardStyle];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="w-full max-w-md rounded-3xl bg-zinc-900 border border-white/10 shadow-2xl p-5 flex flex-col gap-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-indigo-400" />
            <h3 className="font-bold text-base text-white font-['Poppins']">Share Lyrics Card</h3>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-white/10 text-zinc-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Card Live Preview */}
        <div className={`p-6 rounded-2xl border shadow-xl flex flex-col justify-between gap-6 transition-all ${cardStyles}`}>
          <div className="flex items-center gap-3">
            <img src={song.artworkUrl} alt="" className="w-10 h-10 rounded-lg object-cover shadow-md" />
            <div>
              <h5 className="font-bold text-sm tracking-tight leading-tight">{song.title}</h5>
              <p className="text-xs text-white/70">{song.artist}</p>
            </div>
          </div>

          <div className="space-y-2 py-2">
            {selectedIndices.map(idx => (
              <p key={idx} className="text-base sm:text-lg font-semibold leading-relaxed tracking-tight">
                "{lyrics[idx]?.text}"
              </p>
            ))}
          </div>

          <div className="flex items-center justify-between text-[11px] text-white/60 pt-2 border-t border-white/10 font-medium">
            <span>StarbeeTune Music</span>
            <span>ArchiveTune Core</span>
          </div>
        </div>

        {/* Style Selector */}
        <div>
          <label className="text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-2 block">
            Card Theme
          </label>
          <div className="grid grid-cols-4 gap-2">
            {(['cyber', 'sunset', 'glass', 'monolith'] as const).map(s => (
              <button
                key={s}
                onClick={() => setCardStyle(s)}
                className={`py-1.5 rounded-xl text-xs font-semibold capitalize border transition-all ${
                  cardStyle === s
                    ? 'bg-indigo-500/20 text-indigo-400 border-indigo-500/50'
                    : 'bg-white/5 border-white/10 text-zinc-400 hover:text-white'
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        {/* Select Lyrics Lines */}
        <div>
          <label className="text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-2 block">
            Select Lines (up to 4)
          </label>
          <div className="max-h-36 overflow-y-auto space-y-1.5 p-1 rounded-xl bg-black/30 border border-white/5">
            {lyrics.map((l, idx) => {
              const isSelected = selectedIndices.includes(idx);
              return (
                <div
                  key={idx}
                  onClick={() => toggleLine(idx)}
                  className={`px-3 py-2 rounded-lg text-xs cursor-pointer transition-all flex items-center justify-between ${
                    isSelected
                      ? 'bg-indigo-600/30 text-white font-semibold border border-indigo-500/40'
                      : 'text-zinc-400 hover:bg-white/5 hover:text-zinc-200'
                  }`}
                >
                  <span className="truncate pr-2">{l.text}</span>
                  {isSelected && <Check className="w-3.5 h-3.5 text-indigo-400 flex-shrink-0" />}
                </div>
              );
            })}
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 pt-2">
          <button
            onClick={handleCopy}
            className="flex-1 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 active:scale-95 text-white font-semibold text-xs flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/20 transition-all"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-300" /> : <Copy className="w-4 h-4" />}
            <span>{copied ? 'Copied to Clipboard!' : 'Copy Quote Text'}</span>
          </button>

          <button
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-zinc-300 text-xs font-semibold transition-all"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

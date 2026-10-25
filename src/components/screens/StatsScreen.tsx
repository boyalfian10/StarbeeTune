import React from 'react';
import { useMusic } from '../../context/MusicContext';
import { StorageService } from '../../services/storageService';
import { INITIAL_SONGS, INITIAL_ARTISTS } from '../../data/mockData';
import { BarChart3, Clock, Play, Flame, Award, PieChart, Sparkles } from 'lucide-react';

export const StatsScreen: React.FC = () => {
  const { playSong } = useMusic();
  const stats = StorageService.getStats();

  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const maxHours = Math.max(...Object.values(stats.weeklyHours), 3);

  const topSongs = stats.topSongIds
    .map(id => INITIAL_SONGS.find(s => s.id === id))
    .filter(Boolean) as typeof INITIAL_SONGS;

  const topArtist = INITIAL_ARTISTS[0];

  return (
    <div className="pb-36 pt-2 px-4 max-w-md sm:max-w-xl mx-auto space-y-5">
      {/* Header */}
      <div className="pt-2">
        <p className="text-xs font-semibold uppercase tracking-wider text-indigo-400">ArchiveTune Telemetry</p>
        <h1 className="text-2xl font-extrabold text-white tracking-tight font-['Poppins']">
          Listening Insights
        </h1>
      </div>

      {/* Hero Stats Summary Cards */}
      <div className="grid grid-cols-2 gap-3">
        <div className="p-4 rounded-3xl bg-gradient-to-br from-indigo-950/60 to-purple-950/40 border border-indigo-500/20 shadow-lg">
          <div className="flex items-center gap-2 text-indigo-400 mb-2">
            <Clock className="w-4 h-4" />
            <span className="text-[11px] font-bold uppercase tracking-wider">Time Listened</span>
          </div>
          <p className="text-2xl sm:text-3xl font-extrabold text-white">
            {stats.totalMinutes} <span className="text-sm font-medium text-zinc-400">mins</span>
          </p>
          <p className="text-[11px] text-zinc-400 mt-1">~{(stats.totalMinutes / 60).toFixed(1)} hours of music</p>
        </div>

        <div className="p-4 rounded-3xl bg-gradient-to-br from-rose-950/60 to-amber-950/40 border border-rose-500/20 shadow-lg">
          <div className="flex items-center gap-2 text-rose-400 mb-2">
            <Play className="w-4 h-4" />
            <span className="text-[11px] font-bold uppercase tracking-wider">Tracks Played</span>
          </div>
          <p className="text-2xl sm:text-3xl font-extrabold text-white">
            {stats.totalPlays} <span className="text-sm font-medium text-zinc-400">times</span>
          </p>
          <p className="text-[11px] text-zinc-400 mt-1">Across 6 different genres</p>
        </div>
      </div>

      {/* Weekly Hours Bar Chart */}
      <section className="p-4 rounded-3xl bg-zinc-900/80 border border-white/5 space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-indigo-400" />
            <span>Weekly Listening Activity</span>
          </h3>
          <span className="text-[10px] text-zinc-500 font-semibold">Hours per day</span>
        </div>

        <div className="flex items-end justify-between h-32 pt-4 px-1 gap-2">
          {days.map((day) => {
            const hrs = stats.weeklyHours[day] || 0.4;
            const heightPercent = Math.min(100, Math.max(15, (hrs / maxHours) * 100));

            return (
              <div key={day} className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end">
                <span className="text-[10px] font-bold text-zinc-400">{hrs.toFixed(1)}h</span>
                <div className="w-full bg-white/5 rounded-t-xl overflow-hidden h-full flex items-end">
                  <div
                    className="w-full bg-gradient-to-t from-indigo-600 to-fuchsia-500 rounded-t-xl transition-all duration-500"
                    style={{ height: `${heightPercent}%` }}
                  />
                </div>
                <span className="text-[10px] font-semibold text-zinc-400">{day}</span>
              </div>
            );
          })}
        </div>
      </section>

      {/* Top Artist Highlight */}
      <section className="p-4 rounded-3xl bg-gradient-to-r from-indigo-900/40 via-purple-900/30 to-zinc-900 border border-white/10 flex items-center gap-4">
        <div className="relative w-16 h-16 rounded-full overflow-hidden flex-shrink-0 border-2 border-indigo-400 shadow-md">
          <img src={topArtist.avatarUrl} alt="" className="w-full h-full object-cover" />
          <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-amber-400 text-black flex items-center justify-center font-bold text-xs shadow-md">
            #1
          </div>
        </div>
        <div className="overflow-hidden">
          <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-300 flex items-center gap-1">
            <Award className="w-3 h-3" /> Top Artist This Month
          </span>
          <h4 className="text-base font-bold text-white truncate">{topArtist.name}</h4>
          <p className="text-xs text-zinc-400 truncate">{topArtist.monthlyListeners} monthly listeners</p>
        </div>
      </section>

      {/* Top Songs Ranking */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-white tracking-tight flex items-center gap-2 font-['Poppins']">
            <Flame className="w-4 h-4 text-rose-400" />
            <span>Most Played Songs</span>
          </h3>
          <span className="text-xs text-zinc-400">Top 5</span>
        </div>

        <div className="space-y-1.5">
          {topSongs.slice(0, 5).map((song, idx) => (
            <div
              key={song.id}
              onClick={() => playSong(song, topSongs)}
              className="flex items-center justify-between p-2.5 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/5 cursor-pointer transition-all"
            >
              <div className="flex items-center gap-3 overflow-hidden">
                <span className="text-sm font-extrabold w-4 text-center text-indigo-400">
                  {idx + 1}
                </span>
                <img src={song.artworkUrl} alt="" className="w-10 h-10 rounded-xl object-cover" />
                <div className="overflow-hidden">
                  <p className="text-xs font-bold text-white truncate">{song.title}</p>
                  <p className="text-[11px] text-zinc-400 truncate">{song.artist}</p>
                </div>
              </div>

              <div className="flex items-center gap-2 text-xs font-semibold text-zinc-400">
                <span>{song.durationFormatted}</span>
                <Play className="w-3.5 h-3.5 fill-current stroke-none text-zinc-400" />
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

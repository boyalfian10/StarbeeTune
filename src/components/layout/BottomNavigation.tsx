import React from 'react';
import { useMusic } from '../../context/MusicContext';
import { NavigationTab } from '../../types/music';
import { Home, Search, Bookmark, BarChart3, Settings } from 'lucide-react';

interface NavItem {
  id: NavigationTab;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}

const NAV_ITEMS: NavItem[] = [
  { id: 'home', label: 'Home', icon: Home },
  { id: 'search', label: 'Search', icon: Search },
  { id: 'library', label: 'Library', icon: Bookmark },
  { id: 'stats', label: 'Stats', icon: BarChart3 },
  { id: 'settings', label: 'Settings', icon: Settings }
];

export const BottomNavigation: React.FC = () => {
  const { activeTab, setActiveTab, themeColor, oledMode, currentSong } = useMusic();

  const activePillClasses = {
    indigo: 'bg-indigo-500/20 text-indigo-400 border-indigo-500/30',
    fuchsia: 'bg-fuchsia-500/20 text-fuchsia-400 border-fuchsia-500/30',
    emerald: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
    amber: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
    rose: 'bg-rose-500/20 text-rose-400 border-rose-500/30',
    sky: 'bg-sky-500/20 text-sky-400 border-sky-500/30',
    dynamic: 'bg-indigo-500/20 text-indigo-400 border-indigo-500/30'
  }[themeColor];

  return (
    <nav className={`fixed bottom-0 left-0 right-0 z-20 pb-safe transition-colors ${
      oledMode ? 'bg-black/95 border-t border-white/5' : 'bg-[#0f1017]/95 backdrop-blur-xl border-t border-white/5'
    }`}>
      <div className="max-w-md mx-auto px-4 py-2 flex items-center justify-around">
        {NAV_ITEMS.map((item) => {
          const isActive = activeTab === item.id;
          const Icon = item.icon;

          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className="flex flex-col items-center justify-center py-1 px-3 rounded-2xl group transition-all active:scale-95 cursor-pointer"
            >
              <div
                className={`w-14 h-8 rounded-full flex items-center justify-center transition-all duration-200 border ${
                  isActive
                    ? activePillClasses
                    : 'border-transparent text-zinc-400 group-hover:text-zinc-200 group-hover:bg-white/5'
                }`}
              >
                <Icon className={`w-5 h-5 transition-transform duration-200 ${isActive ? 'scale-110 stroke-[2.5]' : 'stroke-[1.8]'}`} />
              </div>
              <span
                className={`text-[11px] font-medium tracking-tight mt-1 transition-colors ${
                  isActive ? 'text-white font-semibold' : 'text-zinc-400'
                }`}
              >
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};

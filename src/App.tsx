import React from 'react';
import { MusicProvider, useMusic } from './context/MusicContext';
import { AppHeader } from './components/layout/AppHeader';
import { BottomNavigation } from './components/layout/BottomNavigation';
import { MiniPlayer } from './components/player/MiniPlayer';
import { FullPlayerModal } from './components/player/FullPlayerModal';
import { EqualizerModal } from './components/player/EqualizerModal';
import { SleepTimerModal } from './components/player/SleepTimerModal';
import { AddToPlaylistModal } from './components/dialogs/AddToPlaylistModal';
import { HomeScreen } from './components/screens/HomeScreen';
import { SearchScreen } from './components/screens/SearchScreen';
import { LibraryScreen } from './components/screens/LibraryScreen';
import { StatsScreen } from './components/screens/StatsScreen';
import { SettingsScreen } from './components/screens/SettingsScreen';
import { ArtistModal } from './components/modals/ArtistModal';
import { AlbumModal } from './components/modals/AlbumModal';
import { PlaylistModal } from './components/modals/PlaylistModal';
import { GenreModal } from './components/modals/GenreModal';

const AppContent: React.FC = () => {
  const { activeTab, oledMode } = useMusic();

  return (
    <div className={`min-h-screen flex flex-col transition-colors duration-300 ${
      oledMode ? 'bg-black text-white' : 'bg-[#0c0d14] text-slate-100'
    }`}>
      {/* Top Header */}
      <AppHeader />

      {/* Main Content Area */}
      <main className="flex-1 w-full max-w-2xl mx-auto overflow-y-auto">
        {activeTab === 'home' && <HomeScreen />}
        {activeTab === 'search' && <SearchScreen />}
        {activeTab === 'library' && <LibraryScreen />}
        {activeTab === 'stats' && <StatsScreen />}
        {activeTab === 'settings' && <SettingsScreen />}
      </main>

      {/* Persistent Mini Player */}
      <MiniPlayer />

      {/* Material 3 Bottom Navigation Bar */}
      <BottomNavigation />

      {/* Full Screen Player Modal */}
      <FullPlayerModal />

      {/* Equalizer Modal */}
      <EqualizerModal />

      {/* Sleep Timer Modal */}
      <SleepTimerModal />

      {/* Add To Playlist Modal */}
      <AddToPlaylistModal />

      {/* Detail Modals */}
      <ArtistModal />
      <AlbumModal />
      <PlaylistModal />
      <GenreModal />
    </div>
  );
};

export default function App() {
  return (
    <MusicProvider>
      <AppContent />
    </MusicProvider>
  );
}

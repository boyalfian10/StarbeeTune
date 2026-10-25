import React, { useState } from 'react';
import { useMusic } from '../../context/MusicContext';
import { INITIAL_SONGS, INITIAL_ARTISTS, INITIAL_ALBUMS, INITIAL_PLAYLISTS, GENRE_CATEGORIES } from '../../data/mockData';
import { Search, X, Mic, Play, Heart, MoreVertical, Disc, Radio, History, Sparkles } from 'lucide-react';
import { Song, Artist, Album, Playlist } from '../../types/music';

export const SearchScreen: React.FC = () => {
  const {
    playSong,
    likedSongIds,
    toggleLike,
    openAddToPlaylist,
    setActiveArtist,
    setActiveAlbum,
    setActivePlaylist,
    setActiveGenre
  } = useMusic();

  const [query, setQuery] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'songs' | 'artists' | 'albums' | 'playlists'>('all');
  const [recentSearches, setRecentSearches] = useState<string[]>([
    'Tokyo Sunset',
    'Midnight City Lights',
    'Lo-Fi Study',
    'Cyberpunk 2077'
  ]);
  const [isRecognizing, setIsRecognizing] = useState(false);
  const [recognizedSong, setRecognizedSong] = useState<Song | null>(null);

  const cleanQuery = query.trim().toLowerCase();

  const matchingSongs = INITIAL_SONGS.filter(s =>
    s.title.toLowerCase().includes(cleanQuery) ||
    s.artist.toLowerCase().includes(cleanQuery) ||
    s.album.toLowerCase().includes(cleanQuery) ||
    s.genre.toLowerCase().includes(cleanQuery)
  );

  const matchingArtists = INITIAL_ARTISTS.filter(a =>
    a.name.toLowerCase().includes(cleanQuery)
  );

  const matchingAlbums = INITIAL_ALBUMS.filter(al =>
    al.title.toLowerCase().includes(cleanQuery) ||
    al.artist.toLowerCase().includes(cleanQuery)
  );

  const matchingPlaylists = INITIAL_PLAYLISTS.filter(p =>
    p.title.toLowerCase().includes(cleanQuery) ||
    p.description.toLowerCase().includes(cleanQuery)
  );

  const handleSearchSubmit = (text: string) => {
    setQuery(text);
    if (text.trim() && !recentSearches.includes(text.trim())) {
      setRecentSearches([text.trim(), ...recentSearches.slice(0, 5)]);
    }
  };

  const removeSearchHistory = (item: string) => {
    setRecentSearches(recentSearches.filter(s => s !== item));
  };

  // Music recognition simulation (matches MusicRecognitionScreen.kt)
  const triggerRecognition = () => {
    setIsRecognizing(true);
    setRecognizedSong(null);
    setTimeout(() => {
      setIsRecognizing(false);
      const picked = INITIAL_SONGS[Math.floor(Math.random() * INITIAL_SONGS.length)];
      setRecognizedSong(picked);
    }, 2800);
  };

  return (
    <div className="pb-36 pt-2 px-4 max-w-md sm:max-w-xl mx-auto space-y-5">
      {/* Search Input Bar */}
      <div className="relative pt-2">
        <div className="flex items-center gap-2 px-3.5 py-2.5 rounded-2xl bg-zinc-900 border border-white/10 shadow-lg focus-within:border-indigo-500/80 transition-all">
          <Search className="w-5 h-5 text-zinc-400 flex-shrink-0" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearchSubmit(query)}
            placeholder="Search songs, artists, albums, or lyrics..."
            className="w-full bg-transparent text-sm text-white placeholder-zinc-500 focus:outline-none"
          />
          {query ? (
            <button
              onClick={() => setQuery('')}
              className="p-1 text-zinc-400 hover:text-white rounded-full"
            >
              <X className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={triggerRecognition}
              className="p-1.5 text-indigo-400 hover:text-indigo-300 rounded-full hover:bg-white/5 active:scale-90 transition-all"
              title="Recognize music playing around you"
            >
              <Mic className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Music Recognition Overlay if active */}
      {isRecognizing && (
        <div className="p-4 rounded-2xl bg-indigo-950/40 border border-indigo-500/30 flex items-center justify-center flex-col gap-3 text-center animate-in fade-in">
          <div className="relative w-14 h-14 rounded-full bg-indigo-600/30 flex items-center justify-center">
            <Mic className="w-6 h-6 text-indigo-400" />
            <span className="absolute inset-0 rounded-full border-2 border-indigo-400 animate-ping opacity-75" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-white">Listening to ambient music...</h4>
            <p className="text-xs text-zinc-400">ArchiveTune audio fingerprint engine</p>
          </div>
        </div>
      )}

      {/* Recognized Song Result Banner */}
      {recognizedSong && !isRecognizing && (
        <div className="p-3.5 rounded-2xl bg-emerald-950/30 border border-emerald-500/30 flex items-center justify-between gap-3 animate-in fade-in">
          <div className="flex items-center gap-3 overflow-hidden">
            <img src={recognizedSong.artworkUrl} alt="" className="w-12 h-12 rounded-xl object-cover shadow-md" />
            <div className="overflow-hidden">
              <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1">
                <Sparkles className="w-3 h-3" /> Song Identified!
              </span>
              <p className="text-xs font-bold text-white truncate">{recognizedSong.title}</p>
              <p className="text-[11px] text-zinc-400 truncate">{recognizedSong.artist}</p>
            </div>
          </div>
          <button
            onClick={() => playSong(recognizedSong)}
            className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-1 shadow-md"
          >
            <Play className="w-3.5 h-3.5 fill-white stroke-none" /> Play
          </button>
        </div>
      )}

      {/* Filter Tabs when query is present */}
      {cleanQuery && (
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
          {(['all', 'songs', 'artists', 'albums', 'playlists'] as const).map((type) => (
            <button
              key={type}
              onClick={() => setFilterType(type)}
              className={`px-3 py-1 rounded-full text-xs font-semibold capitalize whitespace-nowrap transition-all ${
                filterType === type
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'bg-white/5 border border-white/5 text-zinc-400 hover:text-white'
              }`}
            >
              {type}
            </button>
          ))}
        </div>
      )}

      {/* Recent Searches */}
      {!cleanQuery && recentSearches.length > 0 && (
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs font-bold text-zinc-400 uppercase tracking-wider">
            <span className="flex items-center gap-1.5">
              <History className="w-3.5 h-3.5" /> Recent Searches
            </span>
            <button
              onClick={() => setRecentSearches([])}
              className="text-[11px] text-zinc-500 hover:text-rose-400 font-medium lowercase"
            >
              clear all
            </button>
          </div>

          <div className="flex flex-wrap gap-2">
            {recentSearches.map((item) => (
              <div
                key={item}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/5 text-xs text-zinc-300 cursor-pointer group"
                onClick={() => handleSearchSubmit(item)}
              >
                <span>{item}</span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    removeSearchHistory(item);
                  }}
                  className="text-zinc-500 hover:text-rose-400 p-0.5 rounded-full"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Browse Genres & Moods when query is empty */}
      {!cleanQuery && (
        <div className="space-y-3 pt-2">
          <h3 className="text-base font-bold text-white tracking-tight font-['Poppins']">
            Browse All Categories
          </h3>
          <div className="grid grid-cols-2 gap-3">
            {GENRE_CATEGORIES.map((cat) => (
              <div
                key={cat.name}
                onClick={() => setActiveGenre(cat.name)}
                className={`h-24 p-3 rounded-2xl cursor-pointer bg-gradient-to-br ${cat.color} flex flex-col justify-between shadow-lg relative overflow-hidden group active:scale-95 transition-all`}
              >
                <h4 className="font-bold text-sm text-white tracking-tight">{cat.name}</h4>
                <div className="self-end text-white/30 group-hover:text-white/60 transition-colors">
                  <Disc className="w-7 h-7" />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SEARCH RESULTS */}
      {cleanQuery && (
        <div className="space-y-4">
          {/* Songs results */}
          {(filterType === 'all' || filterType === 'songs') && matchingSongs.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-400">Songs</h4>
              <div className="space-y-1.5">
                {matchingSongs.map((song) => {
                  const isLiked = likedSongIds.has(song.id);
                  return (
                    <div
                      key={song.id}
                      onClick={() => playSong(song, matchingSongs)}
                      className="flex items-center justify-between p-2.5 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/5 cursor-pointer transition-all"
                    >
                      <div className="flex items-center gap-3 overflow-hidden">
                        <img src={song.artworkUrl} alt="" className="w-10 h-10 rounded-xl object-cover" />
                        <div className="overflow-hidden">
                          <p className="text-xs font-bold text-white truncate">{song.title}</p>
                          <p className="text-[11px] text-zinc-400 truncate">{song.artist}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
                        <button
                          onClick={() => toggleLike(song.id)}
                          className="p-1.5 text-zinc-400 hover:text-rose-400"
                        >
                          <Heart className={`w-4 h-4 ${isLiked ? 'text-rose-500 fill-rose-500' : ''}`} />
                        </button>
                        <button
                          onClick={() => openAddToPlaylist(song)}
                          className="p-1.5 text-zinc-400 hover:text-white"
                        >
                          <MoreVertical className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Artists results */}
          {(filterType === 'all' || filterType === 'artists') && matchingArtists.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-400">Artists</h4>
              <div className="space-y-1.5">
                {matchingArtists.map((artist) => (
                  <div
                    key={artist.id}
                    onClick={() => setActiveArtist(artist)}
                    className="flex items-center justify-between p-2.5 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/5 cursor-pointer transition-all"
                  >
                    <div className="flex items-center gap-3 overflow-hidden">
                      <img src={artist.avatarUrl} alt="" className="w-10 h-10 rounded-full object-cover" />
                      <div>
                        <p className="text-xs font-bold text-white">{artist.name}</p>
                        <p className="text-[11px] text-zinc-400">{artist.monthlyListeners} monthly listeners</p>
                      </div>
                    </div>
                    <Radio className="w-4 h-4 text-zinc-400" />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Albums results */}
          {(filterType === 'all' || filterType === 'albums') && matchingAlbums.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-400">Albums</h4>
              <div className="space-y-1.5">
                {matchingAlbums.map((album) => (
                  <div
                    key={album.id}
                    onClick={() => setActiveAlbum(album)}
                    className="flex items-center justify-between p-2.5 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/5 cursor-pointer transition-all"
                  >
                    <div className="flex items-center gap-3 overflow-hidden">
                      <img src={album.artworkUrl} alt="" className="w-10 h-10 rounded-xl object-cover" />
                      <div>
                        <p className="text-xs font-bold text-white">{album.title}</p>
                        <p className="text-[11px] text-zinc-400">{album.artist} • {album.year}</p>
                      </div>
                    </div>
                    <Disc className="w-4 h-4 text-zinc-400" />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Playlists results */}
          {(filterType === 'all' || filterType === 'playlists') && matchingPlaylists.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-400">Playlists</h4>
              <div className="space-y-1.5">
                {matchingPlaylists.map((pl) => (
                  <div
                    key={pl.id}
                    onClick={() => setActivePlaylist(pl)}
                    className="flex items-center justify-between p-2.5 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/5 cursor-pointer transition-all"
                  >
                    <div className="flex items-center gap-3 overflow-hidden">
                      <img src={pl.coverUrl} alt="" className="w-10 h-10 rounded-xl object-cover" />
                      <div>
                        <p className="text-xs font-bold text-white">{pl.title}</p>
                        <p className="text-[11px] text-zinc-400">{pl.trackIds.length} tracks</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {matchingSongs.length === 0 && matchingArtists.length === 0 && matchingAlbums.length === 0 && (
            <div className="py-12 text-center text-zinc-500">
              <Search className="w-8 h-8 mx-auto mb-2 opacity-40" />
              <p className="text-sm font-medium">No results found for "{query}"</p>
              <p className="text-xs mt-1 text-zinc-600">Try searching by artist or genre</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

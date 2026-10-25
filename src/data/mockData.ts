import { Song, Artist, Album, Playlist } from '../types/music';

export const INITIAL_SONGS: Song[] = [
  {
    id: 'song-1',
    title: 'Midnight City Lights',
    artist: 'Starbee Collective',
    artistId: 'artist-starbee',
    album: 'Neon Horizon',
    albumId: 'album-neon-horizon',
    duration: 168,
    durationFormatted: '2:48',
    artworkUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=600&auto=format&fit=crop',
    audioUrl: 'https://cdn.freesound.org/previews/612/612610_5674468-lq.mp3',
    genre: 'Lo-Fi Chill',
    year: 2026,
    playCount: 1420,
    isLiked: true,
    lrcLyrics: `[00:00.00]Midnight whispers in the neon glow
[00:07.50]Walking through the empty streets below
[00:15.20]Shadows dancing on the boulevard
[00:22.80]Catching memories in an open palm
[00:30.40]City lights flicker, shining so bright
[00:38.10]Guided by the stars into the night
[00:46.00]Heartbeat rhythms synchronize the sound
[00:53.60]Lost in melodies that we have found
[01:02.00]When morning breaks we'll still be dreaming
[01:10.50]Underneath the skyline softly gleaming
[01:20.00]Never let this midnight rhythm fade away
[01:30.00]Until the coming of a brand new day`
  },
  {
    id: 'song-2',
    title: 'Gurenge (Lofi Beat Remaster)',
    artist: 'Tokyo Sunset',
    artistId: 'artist-tokyo-sunset',
    album: 'Anime Chill Memories',
    albumId: 'album-anime-chill',
    duration: 192,
    durationFormatted: '3:12',
    artworkUrl: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?q=80&w=600&auto=format&fit=crop',
    audioUrl: 'https://cdn.freesound.org/previews/563/563604_11861866-lq.mp3',
    genre: 'Anime / J-Pop',
    year: 2025,
    playCount: 2950,
    isLiked: true,
    lrcLyrics: `[00:00.00]Tsuyoku nareru riyuu wo shitta
[00:08.00]Boku wo tsurete susume
[00:16.50]Dorodarake no soumatou ni yowu
[00:25.00]Kowabarukokoro furueru te wa tsukamitai mono ga aru
[00:34.20]Sore dake sa
[00:41.00]Yoru no nioi ni sora nirande mo
[00:49.00]Kawatte ikeru no wa jibun jishin dake
[00:57.80]Sore dake sa
[01:06.00]Tsuyoku nareru riyuu wo shitta
[01:14.50]Boku wo tsurete susume
[01:23.00]Aratamete kakegae no nai omoi o daite`
  },
  {
    id: 'song-3',
    title: 'Cyberpunk Horizon 2077',
    artist: 'CyberEcho',
    artistId: 'artist-cyberecho',
    album: 'Synthetic Overdrive',
    albumId: 'album-synthetic-overdrive',
    duration: 215,
    durationFormatted: '3:35',
    artworkUrl: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?q=80&w=600&auto=format&fit=crop',
    audioUrl: 'https://cdn.freesound.org/previews/464/464902_9961300-lq.mp3',
    genre: 'Synthwave',
    year: 2026,
    playCount: 3820,
    isLiked: false,
    lrcLyrics: `[00:00.00]Initialize neural link connection
[00:10.00]Digital rain across the grid
[00:21.50]Accelerating past the mainframe firewalls
[00:32.00]Synthetic pulse in my veins
[00:43.00]Can you feel the frequency rising?
[00:54.00]Neon signals burning through the dark
[01:05.00]We run the edge of electric horizons
[01:17.00]No system can hold us down
[01:29.00]Power overdrive engaged
[01:41.00]Into the digital dawn`
  },
  {
    id: 'song-4',
    title: 'Coffee & Rainy Windows',
    artist: 'Kaito Beats',
    artistId: 'artist-kaito',
    album: 'Sunday Lo-Fi Study',
    albumId: 'album-sunday-study',
    duration: 154,
    durationFormatted: '2:34',
    artworkUrl: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?q=80&w=600&auto=format&fit=crop',
    audioUrl: 'https://cdn.freesound.org/previews/665/665181_11861866-lq.mp3',
    genre: 'Lo-Fi Chill',
    year: 2025,
    playCount: 1980,
    isLiked: true,
    lrcLyrics: `[00:00.00]Warm steam rising from a ceramic cup
[00:09.00]Raindrops tapping softly on the glass
[00:19.00]Turning pages of an old book
[00:29.00]No need to hurry, let time pass
[00:39.00]A quiet melody plays on repeat
[00:50.00]Peaceful thoughts gently meet
[01:02.00]Outside the world moves fast and loud
[01:14.00]Inside we are safe within a cloud`
  },
  {
    id: 'song-5',
    title: 'Velvet Echoes',
    artist: 'Sarah Melodic',
    artistId: 'artist-sarah',
    album: 'Golden Hour Glow',
    albumId: 'album-golden-glow',
    duration: 185,
    durationFormatted: '3:05',
    artworkUrl: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=600&auto=format&fit=crop',
    audioUrl: 'https://cdn.freesound.org/previews/612/612610_5674468-lq.mp3',
    genre: 'R&B / Soul',
    year: 2026,
    playCount: 2210,
    isLiked: true,
    lrcLyrics: `[00:00.00]Silken breeze in the twilight air
[00:08.50]Catching your silhouette standing there
[00:17.00]Every word that you whispered low
[00:26.00]Echoes in rhythms I used to know
[00:35.00]Velvet harmonies softly sway
[00:44.00]Wash all our worries right away
[00:53.00]Hold on to this golden dusk
[01:03.00]Forever trusting in our love`
  },
  {
    id: 'song-6',
    title: 'Starry Night Drive',
    artist: 'Luna Veil',
    artistId: 'artist-luna',
    album: 'Celestial Reverie',
    albumId: 'album-celestial',
    duration: 205,
    durationFormatted: '3:25',
    artworkUrl: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?q=80&w=600&auto=format&fit=crop',
    audioUrl: 'https://cdn.freesound.org/previews/464/464902_9961300-lq.mp3',
    genre: 'Dream Pop',
    year: 2026,
    playCount: 1670,
    isLiked: false,
    lrcLyrics: `[00:00.00]Open highway stretching out ahead
[00:11.00]Silver moon guiding where we tread
[00:22.00]Wind in our hair, radio humming low
[00:33.00]Watching the constellations glow
[00:44.00]Far away from the noise and crowd
[00:56.00]Floating up high above the cloud
[01:08.00]Keep driving till we meet the dawn
[01:20.00]Where all of our past is gone`
  },
  {
    id: 'song-7',
    title: 'Nocturne in Moonlight',
    artist: 'Starbee Collective',
    artistId: 'artist-starbee',
    album: 'Piano Sanctuary',
    albumId: 'album-piano-sanctuary',
    duration: 178,
    durationFormatted: '2:58',
    artworkUrl: 'https://images.unsplash.com/photo-1520523839898-507121657f33?q=80&w=600&auto=format&fit=crop',
    audioUrl: 'https://cdn.freesound.org/previews/563/563604_11861866-lq.mp3',
    genre: 'Classical Piano',
    year: 2025,
    playCount: 1140,
    isLiked: false,
    lrcLyrics: `[00:00.00](Solo Piano melody begins)
[00:14.00]Gentle cascading notes of midnight
[00:28.00]Reflecting serenity and light
[00:45.00]The chords rise like tidal waves
[01:02.00]Harmonies that the spirit craves
[01:20.00]Soft ritardando into silence`
  },
  {
    id: 'song-8',
    title: 'Tokyo City Pop Sunset',
    artist: 'Tokyo Sunset',
    artistId: 'artist-tokyo-sunset',
    album: 'Shibuya Groove 1986',
    albumId: 'album-shibuya-groove',
    duration: 198,
    durationFormatted: '3:18',
    artworkUrl: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?q=80&w=600&auto=format&fit=crop',
    audioUrl: 'https://cdn.freesound.org/previews/665/665181_11861866-lq.mp3',
    genre: 'City Pop',
    year: 2025,
    playCount: 3120,
    isLiked: true,
    lrcLyrics: `[00:00.00]Tasogare no machi wo aruite
[00:10.00]Kirameku kousou biru no aida
[00:20.50]Kimi no egao ga kasurete mo
[00:31.00]Ano natsu no merodi ga kikoeru
[00:42.00]Stay with me, mayonaka no doa wo tataki
[00:54.00]Kaeranaide to naita
[01:06.00]Ano kisetsu ga ima me no mae ni`
  }
];

export const INITIAL_ARTISTS: Artist[] = [
  {
    id: 'artist-starbee',
    name: 'Starbee Collective',
    avatarUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=600&auto=format&fit=crop',
    heroUrl: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=1200&auto=format&fit=crop',
    monthlyListeners: '1,840,290',
    bio: 'The in-house production unit behind StarbeeTune, blending ambient lo-fi, futuristic beats, and cinematic orchestral chords.',
    topTrackIds: ['song-1', 'song-7'],
    albumIds: ['album-neon-horizon', 'album-piano-sanctuary']
  },
  {
    id: 'artist-tokyo-sunset',
    name: 'Tokyo Sunset',
    avatarUrl: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?q=80&w=600&auto=format&fit=crop',
    heroUrl: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?q=80&w=1200&auto=format&fit=crop',
    monthlyListeners: '3,120,800',
    bio: 'Known for nostalgic 80s Tokyo vibes, anime reimaginations, and vibrant City Pop beats that transport listeners to neon Shibuya.',
    topTrackIds: ['song-2', 'song-8'],
    albumIds: ['album-anime-chill', 'album-shibuya-groove']
  },
  {
    id: 'artist-cyberecho',
    name: 'CyberEcho',
    avatarUrl: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?q=80&w=600&auto=format&fit=crop',
    heroUrl: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?q=80&w=1200&auto=format&fit=crop',
    monthlyListeners: '2,490,120',
    bio: 'Pioneers of hard-hitting dark synthwave, cyberpunk basslines, and high-energy futuristic club anthems.',
    topTrackIds: ['song-3'],
    albumIds: ['album-synthetic-overdrive']
  },
  {
    id: 'artist-kaito',
    name: 'Kaito Beats',
    avatarUrl: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?q=80&w=600&auto=format&fit=crop',
    monthlyListeners: '1,320,550',
    bio: 'Warm vinyl crackle, gentle Rhodes piano keys, and cozy rainy day coffee lo-fi beats designed for focus and deep relaxation.',
    topTrackIds: ['song-4'],
    albumIds: ['album-sunday-study']
  },
  {
    id: 'artist-sarah',
    name: 'Sarah Melodic',
    avatarUrl: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=600&auto=format&fit=crop',
    monthlyListeners: '980,400',
    bio: 'Silky smooth vocal arrangements, contemporary R&B grooves, and intimate acoustic melodies.',
    topTrackIds: ['song-5'],
    albumIds: ['album-golden-glow']
  },
  {
    id: 'artist-luna',
    name: 'Luna Veil',
    avatarUrl: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?q=80&w=600&auto=format&fit=crop',
    monthlyListeners: '1,450,900',
    bio: 'Ethereal dream pop artist crafting celestial soundscapes and midnight road-trip music.',
    topTrackIds: ['song-6'],
    albumIds: ['album-celestial']
  }
];

export const INITIAL_ALBUMS: Album[] = [
  {
    id: 'album-neon-horizon',
    title: 'Neon Horizon',
    artist: 'Starbee Collective',
    artistId: 'artist-starbee',
    year: 2026,
    artworkUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=600&auto=format&fit=crop',
    trackIds: ['song-1']
  },
  {
    id: 'album-anime-chill',
    title: 'Anime Chill Memories',
    artist: 'Tokyo Sunset',
    artistId: 'artist-tokyo-sunset',
    year: 2025,
    artworkUrl: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?q=80&w=600&auto=format&fit=crop',
    trackIds: ['song-2']
  },
  {
    id: 'album-synthetic-overdrive',
    title: 'Synthetic Overdrive',
    artist: 'CyberEcho',
    artistId: 'artist-cyberecho',
    year: 2026,
    artworkUrl: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?q=80&w=600&auto=format&fit=crop',
    trackIds: ['song-3']
  },
  {
    id: 'album-sunday-study',
    title: 'Sunday Lo-Fi Study',
    artist: 'Kaito Beats',
    artistId: 'artist-kaito',
    year: 2025,
    artworkUrl: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?q=80&w=600&auto=format&fit=crop',
    trackIds: ['song-4']
  },
  {
    id: 'album-golden-glow',
    title: 'Golden Hour Glow',
    artist: 'Sarah Melodic',
    artistId: 'artist-sarah',
    year: 2026,
    artworkUrl: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=600&auto=format&fit=crop',
    trackIds: ['song-5']
  },
  {
    id: 'album-shibuya-groove',
    title: 'Shibuya Groove 1986',
    artist: 'Tokyo Sunset',
    artistId: 'artist-tokyo-sunset',
    year: 2025,
    artworkUrl: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?q=80&w=600&auto=format&fit=crop',
    trackIds: ['song-8']
  }
];

export const INITIAL_PLAYLISTS: Playlist[] = [
  {
    id: 'playlist-favorites',
    title: 'Liked Songs',
    description: 'All your favorite songs gathered in one place.',
    coverUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=600&auto=format&fit=crop',
    trackIds: ['song-1', 'song-2', 'song-4', 'song-5', 'song-8'],
    isSystem: true,
    createdAt: '2026-01-01'
  },
  {
    id: 'playlist-starbee-top',
    title: 'Starbee Tune Picks',
    description: 'Essential high-vibe tunes selected by the community.',
    coverUrl: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80&w=600&auto=format&fit=crop',
    trackIds: ['song-1', 'song-2', 'song-3', 'song-5'],
    createdAt: '2026-02-14'
  },
  {
    id: 'playlist-lofi-chill',
    title: 'Late Night Chill & Code',
    description: 'Mellow beats, soft vinyl rain, and smooth melodies for coding & studying.',
    coverUrl: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?q=80&w=600&auto=format&fit=crop',
    trackIds: ['song-1', 'song-4', 'song-7'],
    createdAt: '2026-03-01'
  },
  {
    id: 'playlist-anime-vibes',
    title: 'J-Pop & Anime Bangers',
    description: 'High energy anime themes and nostalgic 80s city pop sunset vibes.',
    coverUrl: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?q=80&w=600&auto=format&fit=crop',
    trackIds: ['song-2', 'song-8'],
    createdAt: '2026-03-10'
  },
  {
    id: 'playlist-synthwave-drive',
    title: 'Cyberpunk Night Drive',
    description: 'Fast pulse arpeggiators and deep basslines for highway runs.',
    coverUrl: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?q=80&w=600&auto=format&fit=crop',
    trackIds: ['song-3', 'song-6'],
    createdAt: '2026-04-01'
  }
];

export const GENRE_CATEGORIES = [
  { name: 'Lo-Fi Chill', color: 'from-amber-600 to-amber-900', icon: 'Coffee' },
  { name: 'Anime / J-Pop', color: 'from-pink-600 to-rose-900', icon: 'Sparkles' },
  { name: 'Synthwave', color: 'from-purple-600 to-indigo-900', icon: 'Zap' },
  { name: 'R&B / Soul', color: 'from-violet-600 to-purple-900', icon: 'Music' },
  { name: 'Dream Pop', color: 'from-cyan-600 to-blue-900', icon: 'CloudRain' },
  { name: 'Classical Piano', color: 'from-emerald-600 to-teal-900', icon: 'BookOpen' }
];

export const MOOD_TAGS = [
  'All',
  'Relax',
  'Focus',
  'Workout',
  'Commute',
  'Party',
  'Romance'
];

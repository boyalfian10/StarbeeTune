# StarbeeTune

**Redefining the YouTube Music Experience.**  
*High-performance, privacy-focused, and packed with features for people who really care about their music listening experience.*

---

## ✨ Features

- **High-Performance Audio Engine**: Powered by Web Audio API with HTML5 audio playback, featuring real-time audio visualization and synthesizer fallback.
- **5-Band Equalizer & Loudness Normalization**: Custom EQ sliders (60Hz, 230Hz, 910Hz, 3.6kHz, 14kHz), Bass Boost control, and EBU R128 loudness normalization.
- **Synchronized Live Lyrics**: Time-synced karaoke lyrics powered by LRCLIB, featuring click-to-seek playback, Romaji romanization, English translation, and exportable Lyrics Quote Cards.
- **Multiple Player Styles**:
  - Material 3 Expressive with live audio visualizer
  - Retro Spinning Vinyl Record with tonearm
  - Modern Glassmorphism
  - Full-Bleed Hero Card
  - Minimalist Player
- **Library & Local Audio**:
  - Liked Songs collection with instant favorites toggle
  - Custom user playlists (create, reorder, delete)
  - Playback history & real-time telemetry
  - Local device audio file importer (zero upload, 100% private)
- **Search & Discovery**:
  - Instant search across tracks, artists, albums, and playlists
  - Simulated ambient music recognition / audio fingerprinting
  - Category and mood chips (Relax, Focus, Workout, Commute, Party, Romance)
- **Listening Insights (Stats)**:
  - Weekly listening activity charts (hours per day)
  - Top songs and top artists ranking
  - Total minutes listened counter
- **Customization & Themes**:
  - 6 Material You color themes (Indigo, Purple, Emerald, Amber, Rose, Sky)
  - OLED Pure Black mode
  - Sleep timer (15m, 30m, 45m, 60m, End of Track)
  - Full JSON backup export and import

---

## 🛠️ Tech Stack

- **Framework**: React 19 + TypeScript
- **Styling**: Tailwind CSS + Material Design 3 guidelines
- **Audio Processing**: Web Audio API (BiquadFilterNode, DynamicsCompressorNode, AnalyserNode)
- **Lyrics Source**: LRCLIB open database API + LRC parser
- **Icons**: Lucide Icons
- **Build Tool**: Vite 6

---

## 🚀 Running Locally

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

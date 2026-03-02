# Josh's Dashboard

A modular personal dashboard built with React, Vite, and Material UI.  
Originally created as a custom home screen for my son, this project has grown into a flexible, extensible dashboard framework that anyone can fork, customize, and build on.

The dashboard includes:

- Countdown modules (birthdays, holidays, events)
- Weather graphs using real-time API data
- A BYU sports schedule tile using Cloudflare Worker–friendly fetch logic
- A SomaFM “Now Playing” tile
- A Pokémon info card
- A clean, responsive tile layout using Masonry

Everything is designed to be modular. Each tile is its own component, and you can add, remove, or rearrange modules without touching the rest of the system.

---

## Why This Project Exists

I built this dashboard for my son, Josh, as a fun way to give him a personalized “home screen” with the things he cares about most: weather, sports, music, and Pokémon.

But the architecture is intentionally professional:

- Reusable components
- API abstraction layers
- Cloudflare Worker–compatible fetch patterns
- Graph rendering using lightweight chart libraries
- Clean separation of concerns
- A predictable, maintainable module system

This project doubles as a demonstration of how I approach real-world engineering problems: modular, API-driven, and future-proof.

---

## Project Structure

```
.
├── README.md
├── eslint.config.js
├── index.html
├── netlify
│   └── edge-functions
│       └── basic-auth.js
├── netlify.toml
├── package-lock.json
├── package.json
├── public
│   ├── music
│   │   ├── artworks-vF0QovbVgblMp9dp-RkEm6Q-t120x120.jpeg
│   │   ├── dance-we-own-the-night-463855-license.txt
│   │   ├── jakob_welik-neon-skies-463849.mp3
│   │   ├── jakob_welik-we-own-the-night-463855.mp3
│   │   └── playlist.json
│   └── vite.svg
├── src
│   ├── App.css
│   ├── App.jsx
│   ├── assets
│   │   └── react.svg
│   ├── components
│   │   ├── ByuScheduleCard.jsx
│   │   ├── CountdownTimer.jsx
│   │   ├── EDMAudioCard.jsx
│   │   ├── FamilyCalendarNext2.jsx
│   │   ├── HourlyTempChart.jsx
│   │   ├── NeonClock.jsx
│   │   ├── PublicDomainAudioCard.jsx
│   │   ├── RandomPokemonCard.jsx
│   │   └── StaticCountdown.jsx
│   ├── layout
│   │   └── Dashboard.jsx
│   ├── main.jsx
│   ├── modules
│   └── utils
│       ├── storage.js
│       └── time.js
└── vite.config.js
```

---

## Features

### Modular Tile System

Each tile lives in `/src/components` and exports a single React component.  
To add a tile: create a file → export a component → add it to the dashboard layout.

### Weather

Uses a location-specific API endpoint.  
If you fork this project, update the coordinates or API key for your own area.

### BYU Sports

Fetches upcoming events from BYU’s public API.  
Includes:

- Schedule normalization
- Sport mapping with emoji labels
- Graceful fallback when a sport is out of season

### Music Modules

Includes:

- SomaFM “Now Playing” tile
- Public-domain / Creative Commons audio tile (`PublicDomainAudioCard`)

### Graph Module

Demonstrates real-time temperature graphing using a simple data pipeline.

### Cloudflare Worker–Friendly

Some modules are designed to run behind a Cloudflare Worker.  
This project demonstrates:

- Custom Worker endpoints
- Secure API key handling
- Browser-like header forwarding
- CORS-safe fetch patterns

---

## Tech Stack

- React + Vite
- Material UI
- Cloudflare Workers (optional)
- Charting library for temperature graphs
- Custom API integrations
- Masonry layout for responsive tiles

---

## Getting Started

Clone the repo:

```bash
git clone https://github.com/autisticgeek/josh-dashboard.git
cd josh-dashboard
npm install
npm run dev
```

---

## Customization

This project is intentionally easy to customize.

### Weather

Update your location or API key in:

```
/src/components/HourlyTempChart.jsx
```

### Add or Remove Tiles

Each tile is a standalone component.  
To add your own:

1. Create a file under `/src/components/`
2. Export a React component
3. Add it to the layout in `/src/layout/Dashboard.jsx`

### BYU Sports

If you want to track a different team, swap out the API endpoint or sport mapping.

---

### Music Modules: `PublicDomainAudioCard`

`PublicDomainAudioCard` is a React component that streams **public-domain and stream-safe EDM music** directly from a local playlist file.  

It is designed for creators who need **DMCA-safe background music** for live streams, videos, or embedded site audio.

#### Features

- Loads a playlist from `/music/playlist.json`
- Automatically plays the first track when loaded
- Automatically advances to the next track when one ends
- Displays:
  - Artwork
  - Title
  - Artist
  - Source platform
  - License type
- One-click **Attribution Copy** button (if required by license)
- Uses Material UI for styling
- Fully client-side (no streaming APIs required)

#### How It Works

##### Playlist Loading

On initial mount, the component fetches:

```text
/music/playlist.json
```

Expected format:

```json
{
  "tracks": [
    {
      "title": "Track Name",
      "artist": "Artist Name",
      "audio": "/music/audio/track.mp3",
      "artwork": "/music/art/cover.jpg",
      "license": { "type": "CC0" },
      "source": { "platform": "youtube" },
      "attribution": "Optional attribution text"
    }
  ]
}
```

If the file fails to load, an error is logged to the console.

##### Playback Behavior

When a track ends:

```js
setIndex((prev) => (prev + 1) % playlist.length);
```

This creates an infinite loop of tracks.

When the `index` changes, the `<audio>` element source updates and playback begins.

##### Attribution Support

If a track includes an `attribution` field:

- A **Copy Attribution** button appears.
- Clicking it copies the attribution text to the clipboard:

```js
navigator.clipboard.writeText()
```

#### Requirements

- React
- Material UI (`@mui/material`)
- A publicly accessible `/music/playlist.json`
- Browser support for `navigator.clipboard`

#### Notes

- Audio files must be hosted locally or on a CORS-enabled server.
- Autoplay may be blocked by some browsers unless triggered by user interaction.
- If `playlist.length === 0`, no playback occurs.
- Component assumes modern browser support.

---

## Forking / Contributing

You’re welcome to:

- Fork the project
- Clone it
- Strip out modules you don’t need
- Add your own tiles
- Submit ideas

If you have suggestions or want to collaborate, you can reach me through my GitHub profile.  
My contact information is available there.

---

## License

MIT License.  
Use it however you like.

---

## A Note

This project exists because I wanted to build something fun, useful, and personal for my son — but it also reflects the way I approach engineering:

- Modular
- Maintainable
- API-driven
- Future‑proof
- Always open to iteration

If you find it useful or inspiring, feel free to build on it.
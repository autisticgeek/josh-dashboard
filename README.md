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

.
├── eslint.config.js  
├── index.html  
├── package-lock.json  
├── package.json  
├── public  
│ └── vite.svg  
├── README.md  
├── src  
│ ├── App.css  
│ ├── App.jsx  
│ ├── assets  
│ │ └── react.svg  
│ ├── components  
│ │ ├── ByuScheduleCard.jsx  
│ │ ├── CountdownTimer.jsx  
│ │ ├── EDMAudioCard.jsx  
│ │ ├── HourlyTempChart.jsx  
│ │ ├── RandomPokemonCard.jsx  
│ │ └── StaticCountdown.jsx  
│ ├── index.css  
│ ├── layout  
│ │ └── Dashboard.jsx  
│ ├── main.jsx  
│ ├── modules  
│ └── utils  
│ ├── storage.js  
│ └── time.js  
├── touch  
└── vite.config.js

8 directories, 22 files

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

- schedule normalization
- sport mapping with emoji labels
- graceful fallback when a sport is out of season

### Music

Displays the currently playing track from SomaFM’s JSON feed.

### Graph Module

Demonstrates real-time temperature graphing using a simple data pipeline.

### Cloudflare Worker–Friendly

Some modules are designed to run behind a Cloudflare Worker.  
This project demonstrates:

- custom Worker endpoints
- secure API key handling
- browser-like header forwarding
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

    git clone https://github.com/autisticgeek/josh-dashboard.git
    cd josh-dashboard
    npm install
    npm run dev

---

## Customization

This project is intentionally easy to customize.

### Weather

Update your location or API key in:

    /src/components/HourlyTempChart.jsx

### Add or remove tiles

Each tile is a standalone component.  
To add your own:

1. Create a file under /src/components/
2. Export a React component
3. Add it to the layout in /src/layout/Dashboard.jsx

### BYU Sports

If you want to track a different team, swap out the API endpoint or sport mapping.

---

## Forking / Contributing

You’re welcome to:

- fork the project
- clone it
- strip out modules you don’t need
- add your own tiles
- submit ideas

If you have suggestions or want to collaborate, you can reach me through my GitHub profile.  
My contact information is available there.

---

## License

MIT License.  
Use it however you like.

---

## A Note

This project exists because I wanted to build something fun, useful, and personal for my son — but it also reflects the way I approach engineering:

- modular
- maintainable
- API-driven
- future‑proof
- and always open to iteration

If you find it useful or inspiring, feel free to build on it.

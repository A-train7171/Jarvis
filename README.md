# SetLocate GO

A game extension for [SetLocate](https://setlocate.com). Visit real filming
locations, verify with GPS + QR, ShotMatch the frame, and climb the weekly
leaderboard. Built to feel like a mode of SetLocate, not a separate app.

> *From screen to street.*

## Run it

```bash
pnpm install
pnpm dev
```

App runs at <http://localhost:3000>.

For live Mapbox tiles, drop a token in `.env.local`:

```
NEXT_PUBLIC_MAPBOX_TOKEN=pk.xxx
```

Without a token the `/map` screen renders a stylised fallback grid that still
plots every pin — useful for offline dev.

## Routes

| Path | What it is |
|---|---|
| `/` | Landing — hero, feature cards, rarity tier preview |
| `/map` | Main game canvas — Mapbox dark, pins by rarity, scroll rail |
| `/capture/[sceneId]` | The capture loop: Approach → Verify → ShotMatch → Complete |
| `/leaderboard` | Weekly / Monthly / All-Time with podium and prize rail |
| `/profile` | Player dashboard with stat grid and Scene Journal |

## Design system

CSS variables live in `app/globals.css` and are exposed through Tailwind in
`tailwind.config.ts`. The full token list:

```
--bg-base       #0B0F14   canvas
--surface-1     #141A22   cards, panels
--surface-2     #1E2630   elevated
--accent-primary #E63946  location-pin red, CTAs
--accent-warm   #F4A261   Featured tier
--accent-cool   #4CC9F0   Landmark tier, info
--accent-gold   #FFD166   Legendary tier
--success       #3DDC97   verified
--text-primary  #F5F7FA
--text-secondary #9AA5B1
--divider       #2A3340
```

Typography is Inter (UI) + JetBrains Mono (coordinates, metadata, tier labels).
The mono face is the brand's "wayfinding" texture — see the `.mono-meta`
utility for the canonical style.

## Where to plug in a real backend

Search for `TODO(backend):` — each marker is a boundary where mock data is
served from `lib/mockData.ts`. The main ones:

- `lib/mockData.ts` — `scenes` array (replace with `/api/scenes`)
- `lib/mockData.ts` — `weeklyLeaders` (replace with `/api/leaderboard?period=week`)
- `lib/store.ts` — `usePlayer` zustand store persists locally; swap to server
  state once auth lands

## Component map

```
components/
├── ui/         primitives — Button, Card, Pill, Badge, BottomSheet, Modal, FilmReelSpinner
├── scene/      ScenePin, ScenePopover, SceneCard, RarityBadge, ShotMatchFrame, SceneMap
├── layout/     TopNav, BottomTabBar
└── game/       XPPill, PointsCounter
```

## Visual rules

- No color outside the token system above
- Coordinates, scene IDs, tier names → always `.mono-meta`
- Headlines → `cinematic-tracking` (-0.02em)
- Italic accent on film titles in the same color as the scene's tier
- Cards: 14px radius. Buttons: 8px radius. Pills: full radius
- Backdrop blur 14px on glass surfaces
- Grain/vignette only on hero and result screens — never on data UI

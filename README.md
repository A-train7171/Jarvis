# SetLocate GO — Prototype

A location-based exploration game from **SetLocate** (setlocate.com). Discover, capture and collect iconic movie filming locations on a world map — Pokémon GO for cinema scouts.

> Prototype / front-end only. No backend; all scene data is seeded in `lib/mockData.ts`. Player state (XP, captures) is persisted to `localStorage`.

## Stack

- Next.js 14 (App Router) + TypeScript
- Tailwind CSS with a CSS-variable design token layer
- Mapbox GL JS (`mapbox/dark-v11`, globe projection)
- Zustand (client state, persisted)
- React Query (provider scaffolded for future async data)
- Framer Motion + Lucide icons
- Inter + JetBrains Mono via `next/font/google`

## Quick start

```bash
npm install
cp .env.local.example .env.local      # add NEXT_PUBLIC_MAPBOX_TOKEN
npm run dev
```

Visit http://localhost:3000

The map page degrades gracefully when no Mapbox token is set — the rest of the app (landing, scene detail, collection, profile) works without one.

## Routes

| Path             | Purpose                                       |
| ---------------- | --------------------------------------------- |
| `/`              | Landing — hero, featured scenes, how-it-works |
| `/map`           | World map with scene markers + capture drawer |
| `/scene/[id]`    | Full scene detail page                        |
| `/collection`    | Player's captured scenes + completion %       |
| `/profile`       | Level, XP, rarity breakdown, reset            |

## Design tokens

All defined as CSS variables in `app/globals.css` and exposed through `tailwind.config.ts` (`bg-*`, `ink-*`, `accent`, `rarity-*`, `radius-*`, `shadow-glow`, etc). Change once, ripples everywhere.

## Defaults to revise

These were chosen because the brief didn't specify them — easy to override:

- **Accent color** `#FF4D2E` (cinematic orange-red). Drop the real SetLocate brand color into `--accent` / `--accent-glow` in `globals.css`.
- **Scene shape**, capture mechanic (simulated distance, deterministic per `id`), and XP curve (`1000 * level` cumulative).
- **Seed scenes** in `lib/mockData.ts` — 12 real-world filming locations; replace with the canonical SetLocate dataset.

## Scripts

- `npm run dev` — dev server
- `npm run build` — production build
- `npm run typecheck` — TypeScript only
- `npm run lint` — Next ESLint

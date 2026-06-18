# Pocket Trainer

**Your Coach. In Your Pocket.** A mobile-first fitness & nutrition coach: track
workouts and macros, check your form with the camera, sync your watch, and get
AI coaching that adapts to you.

> Founder: Andrew Gumbs (15-year-old entrepreneur). Youth safety and privacy are
> treated as first-class concerns.

This is the production codebase, evolved from the single-file React prototype.

---

## Tech stack

| Layer            | Choice                                                      |
| ---------------- | ---------------------------------------------------------- |
| App              | Vite + React + TypeScript (mobile-first)                   |
| Native shell     | Capacitor (Android first, iOS ready) — _Milestone 3_       |
| Styling          | Brand design tokens (`src/theme.ts`) + inline styles       |
| Local persistence| Capacitor Preferences (web fallback to `localStorage`)     |
| AI backend       | Node server proxying the Anthropic API — _Milestone 2_     |

The Anthropic API key always lives **server-side**. No secrets ship in the app.

---

## Project structure

```
.
├── index.html               # Vite entry HTML (fonts, meta, theme color)
├── capacitor.config.ts      # Native shell config (used from Milestone 3)
├── vite.config.ts           # Vite + React, /api dev proxy → backend
├── src/
│   ├── main.tsx             # React root + AppProvider
│   ├── App.tsx              # Phone-frame shell, routing, bottom nav
│   ├── routes.ts            # Route union + primary tabs
│   ├── theme.ts             # Brand kit: colors, gradient, type, radius
│   ├── types.ts             # Domain types (mirrors the prototype data model)
│   ├── styles.css           # Globals, focus, reduced-motion
│   ├── store/
│   │   ├── storage.ts       # Capacitor Preferences wrapper (replaces window.storage)
│   │   ├── defaultState.ts  # Initial AppState + storage key
│   │   └── AppContext.tsx   # State, persistence, domain actions (active days/rank/streak)
│   ├── lib/
│   │   ├── calcGoals.ts     # Maintenance → macro targets
│   │   ├── ranks.ts         # Rank tiers (advance every 10 active days)
│   │   ├── cardio.ts        # MET-based calorie estimates
│   │   ├── nutrition.ts     # Macro totals
│   │   ├── exercises.ts     # Exercise library by muscle
│   │   ├── image.ts         # Avatar center-crop + downscale
│   │   ├── ai.ts            # Backend AI client (graceful offline fallbacks)
│   │   └── util.ts          # ids, dates, units, time helpers
│   ├── components/          # Logo, Avatar, RankRing, MuscleMap, BottomNav, ui kit…
│   └── screens/
│       ├── Onboarding.tsx   # 4 steps: Profile · About · Goal · Targets
│       ├── Home.tsx         # Rank ring, streak/workout tiles, nutrition, watch card…
│       ├── Nutrition.tsx    # AI macro estimator + manual entry + edit/delete
│       ├── Workouts.tsx     # Builder → Live session → Library/History
│       ├── Coach.tsx        # AI chat using your stats
│       ├── Schedule.tsx     # Smart Schedule: gaps → home/gym sessions
│       ├── Devices.tsx      # Apps & Devices health sync
│       ├── Feed.tsx         # Auto activity posts (rank-up / workout)
│       ├── About.tsx        # Founder bio + verified sources
│       ├── Profile.tsx      # Edit profile + goals (re-run calculator)
│       └── FormCheck.tsx    # Live camera (getUserMedia) + AI form cues
```

---

## Run it

```bash
npm install
npm run dev        # http://localhost:5173
```

Other scripts:

```bash
npm run build      # type-check + production bundle to dist/
npm run preview    # serve the production build
npm run typecheck  # tsc --noEmit
```

The app is responsive and renders in a centered phone frame on desktop. All
state persists locally via Capacitor Preferences (localStorage on the web), so a
refresh keeps your data. To start over, clear site data.

---

## Milestones

1. **Scaffold + port UI + storage** ✅ _(this milestone)_ — Vite/React/TS app,
   full prototype UI, `window.storage` replaced with Capacitor Preferences,
   runs in the browser.
2. **AI backend** — Node/Express proxy for macros / exercise detail / coach
   (streamed) / form check. Key stays server-side. Rate-limited.
3. **Capacitor** — add Android, debug build on device.
4. **Health sync** — Health Connect / HealthKit / Samsung Health → Apps &
   Devices + Home.
5. **Camera & calendar** — native Capacitor Camera; calendar import for Smart
   Schedule.
6. **Landing site** — marketing page into the repo + working waitlist + deploy.
7. **Accounts & sync** (on request) — auth, DB, cross-device sync, privacy
   policy, Play closed-testing track.

### AI calls today

Until the backend (Milestone 2) is running, `src/lib/ai.ts` calls `/api/*` and
**degrades gracefully** to small local heuristics when the server is
unreachable, so every screen stays usable offline. The request/response shapes
in that file are the contract the backend will implement.

---

## Guardrails

- **No secrets in the app.** All AI calls route through the backend.
- **Not medical advice** disclaimers appear on health/nutrition surfaces.
- **Original art only** (kettlebell logo, muscle map — all hand-authored SVG).
- **Accessibility**: visible keyboard focus, reduced-motion support, readable
  contrast.
- **Youth safety & privacy**: privacy policy, Play Data Safety mapping, and
  parental-consent handling land before any account/social features ship.

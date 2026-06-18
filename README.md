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
│       ├── FormCheck.tsx    # Live camera (getUserMedia) + AI form cues
│       └── Share.tsx        # Branded share banners (screenshot / share / save)
```

---

## Run it

### App (frontend)

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

### AI backend (`server/`)

A small Express server proxies the Anthropic API so the key stays server-side.
The Vite dev server proxies `/api/*` to it on port `8787`.

```bash
cd server
npm install
cp .env.example .env        # add your ANTHROPIC_API_KEY
npm run dev                 # http://localhost:8787
```

Endpoints (all under `/api`, rate-limited to 60 req / 5 min / IP):

| Route          | Method | Purpose                                            |
| -------------- | ------ | -------------------------------------------------- |
| `/api/health`  | GET    | Liveness + whether a key is configured             |
| `/api/macros`  | POST   | Meal description → `{name,calories,protein,…}`      |
| `/api/exercise`| POST   | Exercise + muscle → `{steps,cues,variations}`       |
| `/api/form`    | POST   | Captured frame (image) + exercise → form feedback   |
| `/api/coach`   | POST   | Coach chat — **streamed** as Server-Sent Events     |

Model: `claude-sonnet-4-6` (override with `ANTHROPIC_MODEL`). Macros / exercise /
form use structured outputs (`output_config.format`) so responses match the
app's TS types; the coach streams token-by-token. **The key is never sent to the
app** — if the server is down or unkeyed, every route returns cleanly and the app
falls back to local heuristics (see `src/lib/ai.ts`).

---

### Native Android (Capacitor)

The Android project lives in `android/` (committed). Capacitor wraps the same
web build in a native WebView. Build artifacts and `local.properties` are
git-ignored, so after cloning you must build the web app and sync before
opening the project.

**Prerequisites:** Android Studio (or the Android SDK + platform 34) and
**JDK 17** (Capacitor 6 / AGP 8.2.1 targets 17 — newer JDKs can break Gradle).

```bash
# 1. Point the app at your deployed backend (see note below), then:
npm run build
npx cap sync android        # copies dist/ into the native project

# 2a. Open in Android Studio and Run on a device/emulator:
npx cap open android
# 2b. …or build a debug APK from the CLI:
cd android && ./gradlew assembleDebug
#     → android/app/build/outputs/apk/debug/app-debug.apk
```

> **Backend URL on device.** In the native app, relative `/api/*` calls resolve
> to the WebView origin, not your dev machine. Set `VITE_API_BASE` to the
> backend's public HTTPS URL **before** `npm run build` (e.g.
> `VITE_API_BASE=https://api.yourhost.com npm run build`). Without it, AI
> features fall back to local heuristics on device.

> **Play target API level.** The project targets API 34 (Capacitor 6's supported
> ceiling). Google Play requires targeting a recent API level for new
> submissions — bump `compileSdkVersion`/`targetSdkVersion` in
> `android/variables.gradle` (upgrading to Capacitor 7 / a newer AGP as needed)
> before the production track. App ID: `io.pockettrainer.app`.

### Landing site (`site/`)

A fast, self-contained static marketing page in the brand — no build step.

```
site/
├── index.html      # hero (CSS phone mockup), features, how-it-works, founder, waitlist
├── privacy.html    # draft privacy policy (youth-safety / Play)
├── favicon.svg · og-image.png · sitemap.xml · robots.txt
└── vercel.json     # headers + clean URLs (Vercel)
netlify.toml        # publish = site/ + headers (Netlify)
```

Preview locally with any static server, e.g. `npx serve site` (or open
`site/index.html`).

**Waitlist.** The form POSTs to `WAITLIST_ENDPOINT` (top of the inline script in
`index.html`), default `/api/waitlist`. The backend's `POST /api/waitlist`
validates the email (with a honeypot) and appends it to
`server/data/waitlist.jsonl`. Two ways to connect them in production:

- **Proxy** `/api/*` from the host to your backend (uncomment the redirect in
  `netlify.toml`) and keep the default relative endpoint, or
- Set `WAITLIST_ENDPOINT` to the backend's full URL (add the site origin to the
  backend's `CORS_ORIGINS`). A Formspree/Mailchimp URL also works as a drop-in.

**Deploy.** Netlify: connect the repo — `netlify.toml` already sets
`publish = "site"`. Vercel: set the project's root directory to `site/`.

## Milestones

1. **Scaffold + port UI + storage** ✅ — Vite/React/TS app, full prototype UI,
   `window.storage` replaced with Capacitor Preferences, runs in the browser.
2. **AI backend** ✅ _(this milestone)_ — Express proxy in `server/` for macros /
   exercise detail / coach (streamed) / form check. Anthropic key stays
   server-side; rate-limited; graceful 503 → local fallback.
3. **Capacitor** ✅ _(this milestone)_ — Android project scaffolded in
   `android/` (app ID `io.pockettrainer.app`, INTERNET permission, Preferences
   plugin synced). `npx cap sync` verified. The on-device debug build / signing
   runs on your machine (Android SDK + device) — see _Native Android_ above.
4. **Share banners** ✅ _(this milestone)_ — branded, screenshot-ready cards
   (`src/lib/shareCard.ts`, canvas → PNG) for profile / rank-up / streak /
   workout / nutrition, in square (1:1) and story (9:16) formats. Share via the
   Web Share API (with file) or save/download; reachable from Home and from each
   Feed post. _Native health sync (Health Connect / HealthKit) is deferred._
5. **Camera & calendar** — native Capacitor Camera; calendar import for Smart
   Schedule.
6. **Landing site** ✅ _(this milestone)_ — static brand page in `site/`
   (hero + CSS phone mockup, features, how-it-works, founder, verified
   sources), a working waitlist wired to `POST /api/waitlist`, SEO/OG meta +
   OG image, sitemap/robots, privacy draft, and Netlify/Vercel deploy configs.
7. **Accounts & sync** (on request) — auth, DB, cross-device sync, privacy
   policy, Play closed-testing track.

### AI calls

`src/lib/ai.ts` calls the backend at `/api/*` and **degrades gracefully** to
small local heuristics whenever the server is unreachable or unkeyed, so every
screen stays usable offline. Run `server/` (above) with an `ANTHROPIC_API_KEY`
to get real AI estimates, generated exercise detail, streamed coaching, and
camera form checks.

---

## Guardrails

- **No secrets in the app.** All AI calls route through the backend.
- **Not medical advice** disclaimers appear on health/nutrition surfaces.
- **Original art only** (kettlebell logo, muscle map — all hand-authored SVG).
- **Accessibility**: visible keyboard focus, reduced-motion support, readable
  contrast.
- **Youth safety & privacy**: privacy policy, Play Data Safety mapping, and
  parental-consent handling land before any account/social features ship.

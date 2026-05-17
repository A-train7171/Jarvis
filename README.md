# SetLocate GO

A game extension for [SetLocate](https://setlocate.com). Ships as a web app,
an installable PWA, an iOS app, and an Android app — all from one Next.js
codebase wrapped with Capacitor.

> *From screen to street.*

## What you get

| Target | How it's served | What it can do |
|---|---|---|
| **Web** | `next dev` / `next start` | Everything except real native APIs |
| **PWA** | Static export → any static host | Installable to home screen, offline shell, web GPS, web share |
| **iOS** | Capacitor → Xcode → App Store | Native Camera, Geolocation, Share sheet, Haptics, Splash, Status bar |
| **Android** | Capacitor → Android Studio → Play Store | Native Camera, Geolocation, Share intent, Vibrate, Splash, Status bar |

The native bridge lives in `lib/native.ts` — every capability falls back
gracefully on the web, so the same JSX runs everywhere.

## Run the web app

```bash
pnpm install
pnpm dev          # http://localhost:3000
```

Optional — for real Mapbox tiles instead of the stylised fallback:

```
# .env.local
NEXT_PUBLIC_MAPBOX_TOKEN=pk.xxx
```

## Build the iOS app

Prereqs: macOS, Xcode 15+, CocoaPods, an Apple Developer account for device
deploy. (The Xcode project has been scaffolded in `ios/` and committed.)

```bash
pnpm build:mobile        # static export into ./out
npx cap sync ios         # copy web bundle into the iOS app
pnpm ios                 # opens Xcode
```

Then in Xcode: select a simulator or device → ⌘R. For release: Product →
Archive → Distribute App.

Permissions strings (camera, photos, location) are already wired in
`ios/App/App/Info.plist`.

## Build the Android app

Prereqs: JDK 17, Android Studio (or just the command-line SDK), an Android
device or emulator. (The Gradle project has been scaffolded in `android/`
and committed.)

```bash
pnpm build:mobile
npx cap sync android
pnpm android             # opens Android Studio
# or: cd android && ./gradlew assembleDebug
```

For Play Store release: Build → Generate Signed Bundle / APK in Android
Studio.

Permissions (CAMERA, ACCESS_FINE_LOCATION, VIBRATE, READ_MEDIA_IMAGES, …)
are wired in `android/app/src/main/AndroidManifest.xml`.

## Routes

| Path | Description |
|---|---|
| `/` | Landing — hero, feature cards, rarity tier preview |
| `/map` | Main game canvas — Mapbox dark with rarity-coded pins + scroll rail |
| `/capture/[sceneId]` | Capture loop: Approach → Verify → ShotMatch → Complete |
| `/leaderboard` | Weekly / Monthly / All-Time podium + prize rail |
| `/profile` | Player dashboard with stat grid and Scene Journal |

## Native capabilities

The capture flow uses the device's real hardware when available:

- **Approach** → "Use my GPS" button calls `@capacitor/geolocation` (native)
  or `navigator.geolocation` (web). If you're within 25m of the scene's
  coordinates you auto-advance to Verify.
- **ShotMatch** → "Take photo" calls `@capacitor/camera` (native). On web
  it falls back to `<input type="file" capture="environment">` which opens
  the system camera on most mobile browsers.
- **Submit / Share** → uses `@capacitor/share` (native iOS share sheet,
  Android intent) or `navigator.share` (web). On desktop it copies the
  share text to clipboard.
- **Haptics** — `@capacitor/haptics` on device, `navigator.vibrate` on web.
- **Status bar / splash** — dark style on iOS, dark background on Android,
  hidden after first paint.

## Design system

CSS variables live in `app/globals.css` and are exposed through Tailwind in
`tailwind.config.ts`:

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

Typography is Inter (UI) + JetBrains Mono (coordinates, metadata, tier
labels). The mono face is the brand's "wayfinding" texture — see the
`.mono-meta` utility for the canonical style.

## Icon and splash regeneration

The source is `public/icons/icon.svg`. To regenerate every raster (PWA,
iOS launcher, Android mipmaps, splash screens):

```bash
pnpm icons                            # PWA + apple-touch + favicons
node scripts/native-icons.mjs         # iOS/Android launcher + splash
```

## Where to plug in a real backend

Search for `TODO(backend):` — each marker is a boundary where mock data is
served from `lib/mockData.ts`. The main ones:

- `lib/mockData.ts` — `scenes` array → `/api/scenes`
- `lib/mockData.ts` — `weeklyLeaders` → `/api/leaderboard?period=week`
- `lib/store.ts` — `usePlayer` persists locally via zustand+`@capacitor/preferences`
  on device; swap to server state once auth lands

## Project layout

```
app/                  Next.js App Router pages
components/
├── ui/               Button, Card, Pill, Badge, BottomSheet, Modal, FilmReelSpinner
├── scene/            ScenePin, ScenePopover, SceneCard, RarityBadge, ShotMatchFrame, SceneMap
├── layout/           TopNav, BottomTabBar
├── game/             XPPill, PointsCounter
├── NativeShellInit   Configures status bar + hides splash on native
└── PWARegister       Registers the service worker in production web builds
lib/
├── mockData.ts       Seed scenes + leaderboard
├── store.ts          Player state (zustand + localStorage)
├── native.ts         Capacitor bridge with web fallbacks
└── utils.ts
public/
├── icons/            App icons (svg source + rasterised pngs)
├── manifest.webmanifest
└── sw.js             Service worker (app-shell + offline)
ios/                  Capacitor-generated Xcode project
android/              Capacitor-generated Gradle project
capacitor.config.ts   App ID, plugin permissions, splash config
```

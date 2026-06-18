# SetLocate Go

Pokémon Go–style mobile companion to [setlocate.com](https://setlocate.com).
Players visit real-world filming locations, check in via GPS, earn points,
unlock badges, level up.

This directory holds the **mobile app** (Expo + React Native + TypeScript).
The Next.js web app lives at the repo root and is unrelated to this scaffold.

## Status

Phase 0 mockup. Sections 1–3 of the requirements are implemented, plus
the screen flow inferred from the chat brief
(Landing → Sign Up → Avatar → Home → Check-In → Badge → Profile).
All data is mocked in `lib/mockData.ts` — no real auth, no real GPS,
no real backend. The flow is clickable end-to-end for design review.

- Stack: Expo SDK 51, TypeScript, Expo Router, Zustand, NativeWind
- Design tokens in `lib/theme.tokens.js` (single source of truth for
  both Tailwind config and runtime styles)
- Reusable components in the order Section 3 lists them: `Button`,
  `Card`, `Stat`, `LocationListItem`, `Badge`, `BannerCard`,
  `ProgressBar`
- Screens: Landing, Sign Up, Avatar picker, Home, Map (placeholder
  with list fallback), Badges grid, Profile, Check-In modal, Badge
  detail modal
- `/preview` route still ships every primitive on one page for token
  review

Awaiting Sections 4–14 of the requirements doc to swap mocks for real
data model + API contract.

## Getting started

```bash
cd setlocate-go
npm install
npm run start          # Expo dev server
npm run android        # launch on Android emulator / device
```

`app/index.tsx` is a component preview screen showing every primitive
against the black + gold design tokens. Replace it with the real
Landing screen once Section 7 lands.

## Layout

```
setlocate-go/
├── app/                 # Expo Router screens
│   ├── _layout.tsx      # Root stack, SafeAreaProvider, dark status bar
│   ├── index.tsx        # Landing
│   ├── signup.tsx       # Sign up
│   ├── avatar.tsx       # Avatar picker
│   ├── (tabs)/          # Home, Map, Badges, Profile
│   ├── checkin/[id].tsx # Check-in modal
│   ├── badge/[id].tsx   # Badge detail modal
│   └── preview.tsx      # Component primitives reference
├── components/          # Reusable UI primitives (Section 3)
├── lib/
│   ├── theme.tokens.js  # Design tokens — Tailwind + runtime
│   ├── theme.ts         # Typed re-export for TS consumers
│   └── store.ts         # Zustand player state stub
├── app.json             # Expo config + permissions
├── tailwind.config.js   # Reads tokens from lib/theme.tokens.js
├── babel.config.js
├── metro.config.js      # withNativeWind wrapper
└── global.css           # Tailwind directives
```

## Notes for the next pass

- `expo-camera`, `expo-notifications`, `react-native-maps` are listed
  as dependencies but not yet imported. They're queued for the
  Check-In, Streak, and Map screens respectively.
- The Zustand store in `lib/store.ts` is a placeholder. Wire it to
  the data model once Section 4 arrives.
- Backend is intentionally absent. Stub with mock JSON when home/map
  screens are built, per the spec.

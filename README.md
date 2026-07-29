# Pocket Trainer

**Your Coach. In Your Pocket.**

Pocket Trainer is an AI-powered personal fitness operating system — a personal
trainer, nutrition coach, workout planner, form analyst, accountability partner,
and fitness educator inside one simple, premium mobile experience.

> Core belief: fitness success comes from **consistency, personalization,
> education, and accountability**. Pocket Trainer shouldn't overwhelm you — it
> should guide you.

## Stack

- **Next.js 14** (App Router) + **TypeScript** — React architecture that ports
  cleanly to Capacitor / React Native shells.
- **Tailwind CSS** with a CSS-variable design-token layer (purple system, jet
  surfaces, Montserrat + Inter).
- **Zustand** (persisted, SSR-safe) for all client state.
- **Framer Motion** for premium transitions; **Lucide** for icons.
- **Server-side AI** via a Next.js route handler — the API key never reaches the
  client, with a built-in offline knowledge engine as a graceful fallback.

## Getting started

```bash
npm install
cp .env.local.example .env.local     # optional — Coach works offline without a key
npm run dev
```

Visit http://localhost:3000. Best viewed at a mobile width; the layout is capped
to a phone frame.

To enable **live** AI Coach responses, add an `ANTHROPIC_API_KEY` to
`.env.local`. Without one, the Coach uses a safe, rule-based knowledge engine so
the feature always works.

## App structure

**Bottom tab bar** — the five core surfaces:

| Tab       | Route         | What it does                                                  |
| --------- | ------------- | ------------------------------------------------------------ |
| Home      | `/`           | Daily dashboard: calorie/macro rings, streak, today's plan   |
| Nutrition | `/nutrition`  | Macro tracking, water, meals, food-logging sheet             |
| Workout   | `/workout`    | Programs, custom builder, session history                    |
| Form      | `/form`       | AI form analysis — checkpoint breakdowns per lift            |
| Coach     | `/coach`      | AI chat coach (server-side, with offline fallback)           |

**Full-screen pages:** `/profile`, `/schedule`, `/feed`, `/about`,
`/devices` (Apps & Devices), `/settings`, `/builder` (workout builder), and
`/session` (immersive live workout with set logging + rest timer).

## Design system

Tokens live as CSS variables in `app/globals.css` and are exposed through
`tailwind.config.ts`:

- **Surfaces** — Jet `#050505`, Charcoal `#121212`, Gray `#1F1F1F`, borders `#2C2C2E`.
- **Purple system** — Primary `#8B2EFF`, Deep `#5B18C9`, Glow `#B65CFF`.
- **Type** — Montserrat (italic, heavy, uppercase) for display & numbers; Inter for body/UI.
- **Logo** — `components/Logo.tsx`: a geometric upright **P** with a single
  top-left angled point, a dumbbell nested in the bowl, a negative-space center
  cut, and the purple gradient.

## Health & safety

Pocket Trainer provides **general fitness information and education only**. It is
not a replacement for doctors, registered dietitians, or medical professionals.
The AI Coach is prompted — and the offline engine is hard-coded — to never
encourage starvation or dangerous weight loss, never advise training through
serious pain, and never give medical diagnoses. Macro targets are transparent
estimates for guidance, not prescriptions.

## Architecture notes

- **AI is modular and server-only.** `app/api/coach/route.ts` is the single
  server boundary; `lib/ai/prompt.ts` (voice + safety guardrails) and
  `lib/ai/fallback.ts` (offline engine) are swappable. Add a provider by editing
  the route — nothing on the client changes.
- **State is persisted per device** (`pocket-trainer-v2` key) and rolls nutrition
  to a fresh day automatically.
- **Ready to scale** toward auth, a real database, wearables, social features,
  and premium subscriptions without restructuring the UI layer.

## Scripts

- `npm run dev` — dev server
- `npm run build` — production build
- `npm run typecheck` — TypeScript only
- `npm run lint` — Next ESLint

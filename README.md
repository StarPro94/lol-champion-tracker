# LoL Champion Tracker V2

Local-first League of Legends champion tracker with browser storage, instant access, and a full-screen dwarf celebration on champion validation.

## What ships now

- no login wall: the tracker opens immediately
- progress stored locally in the browser via `localStorage`
- champion catalog snapshot bundled from Riot Data Dragon
- search, role filter, resource filter, status filter, and sort
- absurd dwarf celebration triggered only on `non validated -> validated`
- optional cloud account flow deferred to a later version

## Current product model

The app is now **local-first**.

- default mode: on-device tracking only
- storage key: `lol-champion-tracker:v1`
- existing legacy payloads are reused directly
- no email provider is required for this version
- future cloud sync can import the same local data upward later

## Stack

- React 18 + TypeScript + Vite
- Tailwind CSS v4
- Framer Motion
- Vitest
- Convex code remains in the repo for future optional account sync, but the live app no longer depends on it

## Local development

1. Install dependencies:

```bash
npm install
```

2. Start the app:

```bash
npm run dev
```

No auth setup or backend URL is required for the current experience.

## Optional future backend work

The repository still contains Convex auth/sync groundwork. It is currently dormant in the shipped frontend.

If cloud accounts are reintroduced later, the intended direction is:

- anonymous local-first usage by default
- optional email + password account creation
- automatic migration from local storage to cloud on sign-in

## Scripts

- `npm run dev`
- `npm run lint`
- `npm run typecheck`
- `npm test`
- `npm run build`
- `npm run convex:codegen`

## Vercel deployment

The current app is static and local-first, so a standard Vercel deploy is enough:

```bash
vercel deploy -y
vercel deploy --prod -y
```

No mail provider or Convex environment variable is required for the current live product.

## Tests

Current automated coverage focuses on domain logic:

- legacy/local payload parsing
- local storage persistence and toggle behavior
- filter behavior
- merged progress model
- dwarf trigger logic

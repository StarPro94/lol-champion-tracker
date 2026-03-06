# LoL Champion Tracker V2

Rebuilt League of Legends champion tracker with Convex sync, passwordless email auth, silent legacy migration, and a full-screen dwarf celebration on champion validation.

## What ships in this rebuild

- passwordless sign-in with Convex Auth + Resend
- champion catalog snapshot sourced from Riot Data Dragon
- per-user cloud sync for validated champions
- silent one-shot migration from legacy `localStorage`
- search, filters, sort, and progress summary
- real MP4 dwarf celebration triggered only on `non validated -> validated`

## Stack

- React 18 + TypeScript + Vite
- Tailwind CSS v4
- Convex + `@convex-dev/auth`
- Framer Motion
- Vitest

## Local development

1. Install dependencies:

```bash
npm install
```

2. Configure the frontend deployment URL:

```bash
cp .env.example .env.local
```

Set:

```bash
VITE_CONVEX_URL=https://your-deployment.convex.cloud
```

3. Point Convex CLI to the development deployment in `.env.development`:

```bash
CONVEX_DEPLOYMENT=your-dev-deployment
```

4. Start the app:

```bash
npm run dev
```

## Required backend environment variables

Convex Auth with Resend needs backend-side environment variables on the Convex deployment:

- `AUTH_RESEND_KEY`
- `AUTH_EMAIL_FROM`
- `SITE_URL`

The frontend only needs:

- `VITE_CONVEX_URL`

## Scripts

- `npm run dev`
- `npm run lint`
- `npm run typecheck`
- `npm test`
- `npm run build`
- `npm run convex:codegen`

## Vercel deployment

There are two valid ways to deploy.

### Temporary preview deployment

If the production Convex backend is already deployed, a preview can be created with:

```bash
vercel deploy -y
```

### Proper Convex + Vercel production pipeline

Convex recommends letting Vercel run the Convex production deploy as part of the build.

1. Generate a production deploy key in the Convex dashboard.
2. Add `CONVEX_DEPLOY_KEY` to the Vercel project.
3. Set the Vercel build command to:

```bash
npx convex deploy --cmd "npm run build" --cmd-url-env-var-name VITE_CONVEX_URL
```

This ensures Vercel builds the frontend against the correct production Convex URL and deploys the latest backend functions in the same pipeline.

## Legacy migration behavior

- source key: `lol-champion-tracker:v1`
- migration source marker: `localStorage:v1`
- migration runs once after authentication
- invalid or missing legacy payload is ignored silently

## Tests

Current automated coverage is focused on domain logic:

- legacy parsing
- legacy migration payload mapping
- filter behavior
- merged progress model
- dwarf trigger logic

## Current limitation

The frontend is ready for Vercel, but full end-to-end production behavior still depends on a deployed Convex backend matching the functions in `convex/`.

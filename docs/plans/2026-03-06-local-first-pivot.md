# Local-First Pivot Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Replace mandatory auth with immediate localStorage-based tracking while keeping the codebase ready for optional cloud accounts later.

**Architecture:** The app stops depending on Convex for anonymous usage. Champion catalog is loaded from the existing Riot snapshot bundled with the frontend, progress is persisted in localStorage using the existing `lol-champion-tracker:v1` shape, and the UI keeps the current maximalist tracker layout with a local-mode status card instead of auth gating.

**Tech Stack:** React 18, TypeScript, Vite, Tailwind CSS, Framer Motion, Vitest, Gemini design MCP.

---

### Task 1: Add local tracker persistence helpers

**Files:**
- Create: `src/lib/localTracker.ts`
- Test: `tests/unit/localTracker.test.ts`

**Step 1: Write the failing test**
- Cover reading an empty storage, reading legacy payloads, writing validated champions, and toggling a champion twice.

**Step 2: Run test to verify it fails**
- Run: `npm test -- tests/unit/localTracker.test.ts`
- Expected: FAIL because helper module does not exist yet.

**Step 3: Write minimal implementation**
- Implement read/write/toggle helpers that preserve the legacy `played` + `playedAt` shape.

**Step 4: Run test to verify it passes**
- Run: `npm test -- tests/unit/localTracker.test.ts`
- Expected: PASS.

### Task 2: Switch app state from Convex to local storage

**Files:**
- Create: `shared/championCatalog.ts`
- Modify: `src/App.tsx`
- Modify: `src/main.tsx`
- Modify: `src/lib/convex.tsx`
- Test: `tests/unit/localTracker.test.ts`

**Step 1: Write the failing test**
- Add coverage for the merged local progress model if a dedicated helper is needed.

**Step 2: Run targeted tests to verify current gap**
- Run: `npm test -- tests/unit/localTracker.test.ts tests/unit/championProgress.test.ts`

**Step 3: Implement minimal wiring**
- Load catalog from bundled snapshot, hydrate local progress from storage, persist on toggle, keep dwarf trigger behavior, and remove mandatory Convex/auth flow from the app shell.

**Step 4: Run targeted tests to verify it passes**
- Run: `npm test -- tests/unit/localTracker.test.ts tests/unit/championProgress.test.ts tests/unit/championFilters.test.ts`

### Task 3: Update visible local-first shell with Gemini

**Files:**
- Modify: `src/App.tsx`
- Reference: `design-system.md`

**Step 1: Generate the required frontend modifications**
- Use Gemini `modify_frontend` against the auth/status area so the page communicates local mode and optional future cloud sync without introducing a login wall.

**Step 2: Apply returned code and wire existing logic**
- Keep the current tracker layout, swap auth card for local-first messaging, and remove sign-out UI.

**Step 3: Verify render path manually and with build**
- Run the app and ensure the landing page opens directly into the tracker.

### Task 4: Update docs and verify the pivot

**Files:**
- Modify: `README.md`

**Step 1: Update docs**
- Explain local-first behavior and note that optional accounts are future work.

**Step 2: Run full verification**
- `npm run lint`
- `npm run typecheck`
- `npm test`
- `npm run build`

**Step 3: Redeploy after verification**
- Push the updated app to Vercel after successful local checks.

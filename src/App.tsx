import React, { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  Authenticated,
  AuthLoading,
  Unauthenticated,
  useMutation,
  useQuery,
} from "convex/react";
import { useAuthActions } from "@convex-dev/auth/react";
import { clsx, type ClassValue } from "clsx";
import {
  LogOut,
  Mail,
  Search,
} from "lucide-react";
import { twMerge } from "tailwind-merge";

import { api } from "../convex/_generated/api";
import { applyChampionFilters, computeChampionProgress } from "../shared/championFilters";
import { mergeCatalogWithProgress } from "../shared/championProgress";
import type {
  ChampionFilters,
  ChampionListItem,
  DwarfTriggerEvent,
} from "../shared/champions";
import { createDwarfTriggerEvent, shouldTriggerDwarf } from "../shared/legacyTracker";
import { convexClient } from "./lib/convexClient";
import {
  LEGACY_MIGRATION_SOURCE,
  readLegacyProgressFromStorage,
} from "./lib/legacyMigration";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const DEFAULT_FILTERS: ChampionFilters = {
  search: "",
  status: "all",
  tag: "all",
  resource: "all",
  sort: "name-asc",
};

function CelebrationOverlay({
  event,
  onComplete,
}: {
  event: DwarfTriggerEvent;
  onComplete: () => void;
}) {
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    const timeout = window.setTimeout(onComplete, reduceMotion ? 2200 : 3600);
    return () => window.clearTimeout(timeout);
  }, [onComplete, reduceMotion]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="pointer-events-none fixed inset-0 z-[100] overflow-hidden"
    >
      <div className="absolute inset-0 bg-pink-500/15 backdrop-blur-sm" />

      {!reduceMotion && (
        <>
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 18, ease: "linear" }}
            className="absolute left-1/2 top-1/2 h-[120vmax] w-[120vmax] -translate-x-1/2 -translate-y-1/2 rounded-full border-[48px] border-dashed border-cyan-400/25"
          />
          <motion.div
            animate={{ rotate: -360 }}
            transition={{ repeat: Infinity, duration: 12, ease: "linear" }}
            className="absolute left-1/2 top-1/2 h-[80vmax] w-[80vmax] -translate-x-1/2 -translate-y-1/2 rounded-full border-[24px] border-dashed border-yellow-400/25"
          />
        </>
      )}

      <div className="absolute inset-0 flex items-center justify-center px-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.3, rotate: -24, y: 240 }}
          animate={
            reduceMotion
              ? { opacity: 1, scale: 1, y: 0 }
              : {
                  opacity: 1,
                  scale: [0.6, 1.18, 1],
                  rotate: [-24, 10, -10, 6, 0],
                  x: [0, -18, 18, -12, 0],
                  y: [240, -12, 0],
                }
          }
          transition={{ duration: reduceMotion ? 0.35 : 0.95, ease: "easeOut" }}
          className="relative flex flex-col items-center"
        >
          <div className="absolute -inset-8 rounded-full bg-cyan-400/40 blur-3xl" />
          <motion.video
            key={event.timestamp}
            src="/dwarf-dance.mp4"
            autoPlay
            loop
            muted
            playsInline
            animate={
              reduceMotion
                ? { scale: 1 }
                : {
                    rotate: [0, -8, 8, -6, 0],
                    scale: [1, 1.08, 0.96, 1.05, 1],
                    x: [0, 12, -10, 8, 0],
                    y: [0, -8, 4, -6, 0],
                  }
            }
            transition={{ repeat: Infinity, duration: reduceMotion ? 2 : 1.25, ease: "easeInOut" }}
            className="relative z-10 h-72 w-72 rounded-full border-8 border-white object-cover shadow-[0_0_60px_rgba(236,72,153,0.85)] md:h-96 md:w-96"
          />
          <motion.div
            animate={reduceMotion ? { opacity: 1 } : { scale: [1, 1.08, 1] }}
            transition={{ repeat: Infinity, duration: 0.6 }}
            className="mt-8 bg-pink-500 px-6 py-3 text-center text-black shadow-[12px_12px_0px_rgba(255,255,255,0.2)]"
            style={{ transform: "skewX(-12deg)" }}
          >
            <div style={{ transform: "skewX(12deg)" }}>
              <p className="text-xs font-black uppercase tracking-[0.5em]">Dwarf celebration</p>
              <h2 className="text-4xl font-black italic uppercase md:text-6xl">Validated!</h2>
              <p className="text-xs font-bold uppercase tracking-[0.3em] opacity-70">{event.championId}</p>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </motion.div>
  );
}

function SetupRequired() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-black px-6 py-12 text-white">
      <div className="relative w-full max-w-3xl rotate-[-1deg]">
        <div className="absolute -left-8 -top-8 flex h-24 w-24 items-center justify-center rounded-full border-4 border-black bg-yellow-400 font-black text-black shadow-xl">
          SETUP
        </div>
        <div className="rounded-[40px] border-[4px] border-white bg-pink-500 p-2 shadow-[20px_20px_0px_rgba(236,72,153,0.3)]">
          <div className="space-y-6 rounded-[32px] bg-zinc-900 p-10">
            <h1 className="bg-gradient-to-r from-pink-400 via-yellow-400 to-cyan-400 bg-clip-text text-6xl font-black italic uppercase tracking-tighter text-transparent">
              Tracker offline
            </h1>
            <p className="max-w-2xl text-lg text-zinc-300">
              `VITE_CONVEX_URL` is missing, so the real app cannot connect to Convex yet.
              Add the project URL, then restart the dev server to unlock auth, sync, migration,
              and the dancing dwarf celebration.
            </p>
            <div className="rounded-[24px] border-2 border-white/10 bg-black p-6 font-mono text-sm text-cyan-400">
              VITE_CONVEX_URL=https://your-deployment.convex.cloud
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function AuthHero() {
  const { signIn } = useAuthActions();
  const [email, setEmail] = useState("");
  const [pending, setPending] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);

    try {
      const formData = new FormData();
      formData.set("email", email);
      await signIn("resend", formData);
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-black px-6 py-12 text-white">
      <div className="absolute left-[-8rem] top-1/4 h-96 w-96 rounded-full bg-pink-500/20 blur-[140px]" />
      <div className="absolute bottom-1/4 right-[-8rem] h-96 w-96 rounded-full bg-cyan-400/20 blur-[140px]" />

      <motion.div
        initial={{ opacity: 0, scale: 0.96, rotate: -2 }}
        animate={{ opacity: 1, scale: 1, rotate: -1 }}
        className="relative z-10 w-full max-w-3xl"
      >
        <div className="absolute -left-10 -top-10 flex h-24 w-24 items-center justify-center rounded-full border-4 border-black bg-yellow-400 text-center text-sm font-black uppercase text-black shadow-2xl rotate-[-12deg]">
          V1.0
          <br />
          live
        </div>

        <div className="rounded-[40px] border-[4px] border-white bg-pink-500 p-2 shadow-[20px_20px_0px_rgba(236,72,153,0.3)]">
          <div className="space-y-10 rounded-[32px] bg-zinc-900 p-10 md:p-14">
            <div className="space-y-4 text-center">
              <h1 className="bg-gradient-to-r from-pink-400 via-yellow-400 to-cyan-400 bg-clip-text text-7xl font-black italic uppercase tracking-tighter text-transparent md:text-8xl">
                Luxury
              </h1>
              <div className="inline-block bg-pink-500 px-6 py-2 font-black uppercase text-black" style={{ transform: "skewX(-12deg)" }}>
                <span style={{ transform: "skewX(12deg)", display: "inline-block" }}>Champion tracker</span>
              </div>
              <p className="mx-auto max-w-xl text-sm font-bold uppercase tracking-[0.3em] text-zinc-500 md:text-base">
                Cloud sync, silent migration, loud validation, chaotic dwarf energy.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="mx-auto max-w-xl space-y-5">
              <div className="relative">
                <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-pink-400" size={22} />
                <input
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="Enter summoner email"
                  required
                  className="w-full rounded-[24px] border-4 border-white bg-black py-5 pl-14 pr-5 text-sm font-black uppercase tracking-[0.2em] text-white outline-none transition-colors placeholder:text-zinc-600 focus:border-cyan-400"
                />
              </div>
              <button
                type="submit"
                disabled={pending}
                className="w-full rounded-[24px] bg-white py-5 text-lg font-black uppercase tracking-[0.3em] text-black transition-all hover:scale-[1.02] hover:bg-yellow-400 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {pending ? "Sending link..." : "Enter arena"}
              </button>
            </form>

            <div className="rounded-[24px] border-2 border-white/10 bg-black p-5 text-center text-xs font-bold uppercase tracking-[0.3em] text-zinc-500">
              Passwordless auth via Convex magic link
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

function LoadingScreen() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-black">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
        className="h-16 w-16 rounded-full border-8 border-pink-500 border-t-transparent"
      />
    </div>
  );
}

function SignedInApp() {
  const { signOut } = useAuthActions();
  const catalogData = useQuery(api.champions.list);
  const progressData = useQuery(api.progress.listForCurrentUser);
  const user = useQuery(api.users.current);
  const migrationState = useQuery(api.migrations.getState, {
    source: LEGACY_MIGRATION_SOURCE,
  });
  const toggleValidation = useMutation(api.progress.toggleChampionValidation);
  const migrateLegacy = useMutation(api.migrations.migrateLegacyProgress);

  const [filters, setFilters] = useState<ChampionFilters>(DEFAULT_FILTERS);
  const [celebrationEvent, setCelebrationEvent] = useState<DwarfTriggerEvent | null>(null);
  const migrationTriggered = useRef(false);

  useEffect(() => {
    if (migrationTriggered.current || migrationState === undefined || user === undefined) {
      return;
    }

    migrationTriggered.current = true;

    if (migrationState !== null) {
      return;
    }

    const legacyPayload = readLegacyProgressFromStorage(window.localStorage);
    if (legacyPayload === null || legacyPayload.entries.length === 0) {
      return;
    }

    void migrateLegacy(legacyPayload).catch((error) => {
      migrationTriggered.current = false;
      console.error("Legacy migration failed", error);
    });
  }, [migrateLegacy, migrationState, user]);

  const catalog = useMemo(() => catalogData?.champions ?? [], [catalogData]);
  const mergedChampions = useMemo<ChampionListItem[]>(() => {
    return mergeCatalogWithProgress(catalog, progressData ?? []);
  }, [catalog, progressData]);

  const tagOptions = useMemo(() => {
    return [...new Set(catalog.flatMap((champion) => champion.tags))].sort();
  }, [catalog]);

  const resourceOptions = useMemo(() => {
    return [...new Set(catalog.map((champion) => champion.partype))].sort();
  }, [catalog]);

  const filteredChampions = useMemo(() => {
    return applyChampionFilters(mergedChampions, filters);
  }, [filters, mergedChampions]);

  const summary = useMemo(() => {
    return computeChampionProgress(mergedChampions);
  }, [mergedChampions]);

  const displayName = user?.name ?? user?.email ?? "Summoner";

  async function handleToggle(championId: string) {
    const previous = mergedChampions.find((champion) => champion.id === championId)?.isValidated ?? false;
    const result = await toggleValidation({ championId });

    if (shouldTriggerDwarf(previous, result.isValidated)) {
      setCelebrationEvent(createDwarfTriggerEvent(championId));
    }
  }

  if (catalogData === undefined || progressData === undefined || user === undefined) {
    return <LoadingScreen />;
  }

  return (
    <div className="min-h-screen bg-black text-white selection:bg-pink-500 selection:text-black">
      <AnimatePresence>
        {celebrationEvent !== null ? (
          <CelebrationOverlay event={celebrationEvent} onComplete={() => setCelebrationEvent(null)} />
        ) : null}
      </AnimatePresence>

      <header className="mx-auto max-w-7xl px-6 pb-8 pt-12">
        <div className="mb-10 flex flex-col gap-8 md:flex-row md:items-center md:justify-between">
          <div className="space-y-3">
            <h1 className="bg-gradient-to-r from-pink-400 via-yellow-400 to-cyan-400 bg-clip-text text-6xl font-black italic uppercase tracking-tighter text-transparent md:text-7xl">
              Tracker
            </h1>
            <div className="inline-block bg-pink-500 px-4 py-1 font-black uppercase text-black" style={{ transform: "skewX(-12deg)" }}>
              <span style={{ transform: "skewX(12deg)", display: "inline-block" }}>Luxury champion collection</span>
            </div>
          </div>

          <div className="flex items-center gap-4 rounded-[24px] border-2 border-white/10 bg-zinc-900 p-4">
            <div className="text-right">
              <p className="font-black italic uppercase leading-none">{displayName}</p>
              <p className="mt-1 text-[10px] font-bold uppercase tracking-[0.3em] text-zinc-500">Session active</p>
            </div>
            <button
              type="button"
              onClick={() => void signOut()}
              className="flex h-12 w-12 items-center justify-center rounded-full bg-white text-black transition-colors hover:bg-pink-500"
              aria-label="Sign out"
            >
              <LogOut size={20} />
            </button>
          </div>
        </div>

        <div className="relative rotate-[-1deg]">
          <div className="absolute -right-2 -top-8 z-20 flex h-24 w-24 items-center justify-center rounded-xl border-4 border-black bg-cyan-400 text-center text-sm font-black uppercase text-black shadow-xl rotate-[12deg]">
            {summary.percentage}%
            <br />
            done
          </div>
          <div className="rounded-[40px] border-[4px] border-white bg-pink-500 p-2 shadow-[10px_10px_0px_rgba(236,72,153,0.3)]">
            <div className="space-y-6 rounded-[32px] bg-zinc-900 p-8">
              <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                {[
                  { label: "Validated", value: summary.validated },
                  { label: "Remaining", value: summary.remaining },
                  { label: "Total pool", value: summary.total },
                  { label: "Mastery", value: `${summary.percentage}%` },
                ].map((item, index) => (
                  <div
                    key={item.label}
                    className={cn(
                      "rounded-[20px] border-2 border-transparent bg-white/10 p-4 transition-all",
                      index === 0 && "hover:border-pink-500",
                      index === 1 && "hover:border-cyan-400",
                      index === 2 && "hover:border-yellow-400",
                      index === 3 && "hover:border-white",
                    )}
                  >
                    <p className="mb-1 text-3xl font-black">{item.value}</p>
                    <p className="text-[10px] font-bold uppercase tracking-[0.3em] opacity-60">{item.label}</p>
                  </div>
                ))}
              </div>

              <div className="relative h-10 overflow-hidden rounded-full border-4 border-white bg-zinc-800">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${summary.percentage}%` }}
                  className="relative z-10 h-full border-r-4 border-white bg-gradient-to-r from-pink-500 via-yellow-500 to-cyan-500"
                />
                <div className="pointer-events-none absolute inset-0 flex items-center justify-center mix-blend-difference">
                  <span className="text-[10px] font-black uppercase tracking-[0.4em]">System performance optimized</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <section className="mx-auto mb-12 max-w-7xl px-6">
        <div className="grid grid-cols-1 gap-6 rounded-[32px] border-4 border-white/10 bg-zinc-900 p-6 md:grid-cols-12 md:items-center">
          <div className="relative md:col-span-4">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-pink-500" size={20} />
            <input
              type="text"
              value={filters.search}
              onChange={(event) => setFilters((current) => ({ ...current, search: event.target.value }))}
              placeholder="Search champions..."
              className="w-full rounded-xl border-2 border-white/20 bg-black py-4 pl-12 pr-4 text-sm font-black uppercase tracking-[0.2em] text-white outline-none transition-colors placeholder:text-zinc-600 focus:border-pink-500"
            />
          </div>

          <div className="flex flex-wrap gap-4 md:col-span-8">
            <select
              value={filters.status}
              onChange={(event) =>
                setFilters((current) => ({
                  ...current,
                  status: event.target.value as ChampionFilters["status"],
                }))
              }
              className="rounded-xl border-2 border-white/20 bg-black px-4 py-4 text-xs font-black uppercase tracking-[0.2em] outline-none focus:border-cyan-400"
            >
              <option value="all">All status</option>
              <option value="validated">Validated</option>
              <option value="unvalidated">Pending</option>
            </select>

            <select
              value={filters.tag}
              onChange={(event) => setFilters((current) => ({ ...current, tag: event.target.value }))}
              className="rounded-xl border-2 border-white/20 bg-black px-4 py-4 text-xs font-black uppercase tracking-[0.2em] outline-none focus:border-yellow-400"
            >
              <option value="all">All roles</option>
              {tagOptions.map((tag) => (
                <option key={tag} value={tag}>
                  {tag}
                </option>
              ))}
            </select>

            <select
              value={filters.resource}
              onChange={(event) => setFilters((current) => ({ ...current, resource: event.target.value }))}
              className="rounded-xl border-2 border-white/20 bg-black px-4 py-4 text-xs font-black uppercase tracking-[0.2em] outline-none focus:border-pink-500"
            >
              <option value="all">All resources</option>
              {resourceOptions.map((resource) => (
                <option key={resource} value={resource}>
                  {resource}
                </option>
              ))}
            </select>

            <select
              value={filters.sort}
              onChange={(event) =>
                setFilters((current) => ({
                  ...current,
                  sort: event.target.value as ChampionFilters["sort"],
                }))
              }
              className="ml-auto rounded-xl border-2 border-white/20 bg-black px-4 py-4 text-xs font-black uppercase tracking-[0.2em] outline-none focus:border-cyan-400"
            >
              <option value="name-asc">Sort: A-Z</option>
              <option value="name-desc">Sort: Z-A</option>
              <option value="recently-validated">Sort: Recent</option>
              <option value="unvalidated-first">Sort: Pending first</option>
            </select>
          </div>
        </div>
      </section>

      <main className="mx-auto max-w-7xl px-6 pb-24">
        {filteredChampions.length === 0 ? (
          <div className="rounded-[40px] border-4 border-dashed border-white/10 py-20 text-center">
            <div className="mb-8 text-8xl opacity-30">*</div>
            <h2 className="text-4xl font-black italic uppercase text-zinc-700">No match found</h2>
            <p className="mt-3 text-xs font-bold uppercase tracking-[0.3em] text-zinc-500">
              Adjust your filters or search query
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredChampions.map((champion) => {
              return (
                <ChampionCard key={champion.id} champion={champion} onToggle={handleToggle} />
              );
            })}
          </div>
        )}
      </main>

      <footer className="relative mt-12 h-64 overflow-hidden opacity-20 pointer-events-none">
        <motion.div
          animate={{ x: [-2000, 0] }}
          transition={{ repeat: Infinity, duration: 30, ease: "linear" }}
          className="flex whitespace-nowrap"
        >
          {Array.from({ length: 12 }).map((_, index) => (
            <span key={index} className="mx-12 text-8xl font-black italic uppercase text-zinc-800">
              Luxury performance * {summary.validated}/{summary.total} * collected
            </span>
          ))}
        </motion.div>
      </footer>
    </div>
  );
}

function ChampionCard({
  champion,
  onToggle,
}: {
  champion: ChampionListItem;
  onToggle: (championId: string) => Promise<void>;
}) {
  const isValidated = champion.isValidated;

  return (
    <motion.article
      layout
      className={cn(
        "group relative overflow-hidden rounded-[32px] border-4 bg-zinc-900 transition-all duration-300",
        isValidated ? "border-pink-500 shadow-[0_0_20px_rgba(236,72,153,0.2)]" : "border-white/10 hover:border-white/40",
      )}
    >
      <div className="pointer-events-none absolute right-0 top-0 h-32 w-32 bg-gradient-to-bl from-white/5 to-transparent" />

      <div className="space-y-4 p-6">
        <div className="flex items-start justify-between gap-4">
          <div className="relative">
            <div
              className={cn(
                "absolute -inset-1 rounded-full blur-sm transition-opacity opacity-0 group-hover:opacity-100",
                isValidated ? "bg-pink-500" : "bg-cyan-400",
              )}
            />
            <img
              src={champion.imageUrl}
              alt={champion.name}
              className="relative z-10 h-16 w-16 rounded-full border-2 border-white object-cover grayscale-[0.35] transition-all group-hover:grayscale-0"
            />
          </div>

          {isValidated ? (
            <div className="bg-pink-500 px-3 py-1 text-[10px] font-black uppercase text-black skew-x-[-10deg]">
              <span style={{ transform: "skewX(10deg)", display: "inline-block" }}>Validated</span>
            </div>
          ) : null}
        </div>

        <div>
          <h3 className="text-2xl font-black italic uppercase tracking-tighter">{champion.name}</h3>
          <p className="mt-1 line-clamp-1 text-[10px] font-bold uppercase tracking-[0.2em] opacity-40">
            {champion.title}
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          {champion.tags.map((tag) => (
            <span key={tag} className="rounded-sm bg-white/10 px-2 py-1 text-[8px] font-black uppercase tracking-[0.2em]">
              {tag}
            </span>
          ))}
          <span className="rounded-sm bg-cyan-400/15 px-2 py-1 text-[8px] font-black uppercase tracking-[0.2em] text-cyan-400">
            {champion.partype}
          </span>
        </div>

        <button
          type="button"
          onClick={() => void onToggle(champion.id)}
          className={cn(
            "w-full rounded-xl py-4 text-xs font-black uppercase tracking-[0.3em] transition-all",
            isValidated
              ? "border-2 border-white/5 bg-zinc-800 text-white hover:border-red-500/50 hover:text-red-400"
              : "bg-white text-black hover:scale-[1.02] hover:bg-yellow-400",
          )}
        >
          {isValidated ? "Revoke access" : "Validate champion"}
        </button>
      </div>
    </motion.article>
  );
}

export function App() {
  if (convexClient === null) {
    return <SetupRequired />;
  }

  return (
    <>
      <AuthLoading>
        <LoadingScreen />
      </AuthLoading>
      <Unauthenticated>
        <AuthHero />
      </Unauthenticated>
      <Authenticated>
        <SignedInApp />
      </Authenticated>
    </>
  );
}

export default App;

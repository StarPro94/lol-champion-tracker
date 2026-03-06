import React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Search, CloudOff, Cloud, ShieldCheck, Zap, Star, ArrowUpDown } from "lucide-react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

import type { ChampionFilters, ChampionListItem, ChampionProgressSummary } from "../../shared/champions";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface LocalTrackerShellProps {
  summary: ChampionProgressSummary;
  filters: ChampionFilters;
  tagOptions: string[];
  resourceOptions: string[];
  champions: ChampionListItem[];
  onSearch: (value: string) => void;
  onFilterChange: <K extends keyof ChampionFilters>(key: K, value: ChampionFilters[K]) => void;
  onToggleChampion: (id: string) => void;
}

export default function LocalTrackerShell({
  summary,
  filters,
  tagOptions,
  resourceOptions,
  champions,
  onSearch,
  onFilterChange,
  onToggleChampion,
}: LocalTrackerShellProps) {
  return (
    <div className="min-h-screen overflow-x-hidden bg-zinc-950 pb-20 font-sans text-white selection:bg-yellow-400 selection:text-black">
      <header className="relative mx-auto max-w-7xl px-6 pb-8 pt-12">
        <div className="absolute left-4 top-10 z-20 flex h-24 w-24 -rotate-12 items-center justify-center rounded-full border-4 border-black bg-yellow-400 p-2 text-center text-xs font-black uppercase leading-none text-black shadow-xl md:left-10">
          Local
          <br />
          Storage
          <br />
          Active
        </div>
        <div className="absolute right-4 top-20 z-20 flex h-28 w-28 rotate-12 items-center justify-center rounded-xl border-4 border-black bg-cyan-400 p-2 text-center text-sm font-black uppercase leading-none text-black shadow-xl md:right-10">
          Progress
          <br />
          Safe!
        </div>

        <div className="relative z-10 space-y-8">
          <div className="flex flex-col items-center space-y-4 text-center">
            <motion.h1
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="bg-gradient-to-r from-pink-400 via-yellow-400 to-cyan-400 bg-clip-text py-2 text-6xl font-black italic uppercase tracking-tighter text-transparent md:text-8xl"
            >
              CHAMPION TRACKER
            </motion.h1>
            <div className="inline-block skew-x-[-12deg] bg-pink-500 px-6 py-2 text-xl font-black uppercase tracking-wider text-black shadow-[8px_8px_0px_rgba(236,72,153,0.3)]">
              LUXURY MASTER LIST
            </div>
          </div>

          <div className="group relative mx-auto max-w-3xl overflow-hidden rounded-[32px] border-4 border-white bg-zinc-900 p-6 shadow-[15px_15px_0px_rgba(255,255,255,0.1)] md:p-8">
            <div className="absolute right-0 top-0 p-4 opacity-10 transition-opacity group-hover:opacity-20">
              <CloudOff size={120} strokeWidth={3} />
            </div>

            <div className="relative z-10 flex flex-col items-center gap-6 md:flex-row">
              <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full border-4 border-black bg-cyan-400">
                <ShieldCheck className="text-black" size={40} strokeWidth={2.5} />
              </div>
              <div className="space-y-2 text-center md:text-left">
                <h2 className="text-2xl font-black italic uppercase text-cyan-400">Privacy First Mode</h2>
                <p className="max-w-md font-bold leading-tight text-zinc-400">
                  Progress is saved directly to your browser&apos;s <span className="text-white">localStorage</span>.
                  No account needed. Cloud sync can come later if the user wants it.
                </p>
              </div>
              <div className="md:ml-auto">
                <button
                  disabled
                  className="group relative flex cursor-not-allowed items-center gap-2 rounded-xl border-2 border-white/20 bg-white/5 px-4 py-3 text-xs font-black uppercase tracking-widest text-zinc-500"
                  type="button"
                >
                  <Cloud size={16} />
                  Sync Disabled
                  <span className="absolute -right-3 -top-3 rounded border border-white/20 bg-zinc-800 px-2 py-1 text-[8px] text-zinc-400">
                    COMING LATER
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      <section className="mx-auto mb-12 max-w-7xl px-6">
        <div className="rounded-[40px] border-[4px] border-white bg-pink-500 p-2 shadow-[20px_20px_0px_rgba(236,72,153,0.2)]">
          <div className="relative space-y-6 overflow-hidden rounded-[32px] bg-zinc-900 p-8 text-white">
            <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
              <div className="flex items-center gap-6">
                <div className="relative">
                  <div className="flex h-20 w-20 items-center justify-center rounded-full border-4 border-pink-500 bg-white text-black">
                    <Star className="fill-pink-500 text-pink-500" size={32} />
                  </div>
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 8, ease: "linear" }}
                    className="absolute -inset-2 rounded-full border-t-4 border-cyan-400"
                  />
                </div>
                <div>
                  <p className="text-4xl font-black italic uppercase leading-none">{summary.percentage}%</p>
                  <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-pink-400">Current Completion</p>
                </div>
              </div>

              <div className="grid w-full grid-cols-2 gap-4 md:w-auto">
                <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-center">
                  <p className="text-2xl font-black">{summary.validated}</p>
                  <p className="text-[9px] font-bold uppercase opacity-60">Completed</p>
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-center">
                  <p className="text-2xl font-black">{summary.total - summary.validated}</p>
                  <p className="text-[9px] font-bold uppercase opacity-60">Remaining</p>
                </div>
              </div>
            </div>

            <div className="relative h-12 overflow-hidden rounded-full border-4 border-white bg-zinc-800">
              <motion.div
                animate={{ x: [-1000, 0] }}
                transition={{ repeat: Infinity, duration: 30, ease: "linear" }}
                className="pointer-events-none absolute inset-0 flex items-center whitespace-nowrap opacity-10"
              >
                {Array.from({ length: 10 }).map((_, index) => (
                  <span key={index} className="mx-4 text-xl font-black italic uppercase">
                    Leveling Up * Tracking Progress * Elite Status *
                  </span>
                ))}
              </motion.div>
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${summary.percentage}%` }}
                className="relative z-10 h-full border-r-4 border-white bg-gradient-to-r from-pink-500 via-yellow-400 to-cyan-500 shadow-[0_0_20px_rgba(236,72,153,0.5)]"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto mb-12 max-w-7xl px-6">
        <div className="rounded-[32px] bg-pink-500 p-1.5 shadow-[15px_15px_0px_rgba(236,72,153,0.2)]">
          <div className="flex flex-col gap-6 rounded-[28px] border-4 border-white bg-zinc-900 p-6 xl:flex-row xl:items-stretch">
            <div className="group relative flex-grow">
              <div className="absolute left-4 top-[-2.25rem] z-10 skew-x-[-12deg] border-2 border-black bg-yellow-400 px-4 py-1 text-xs font-black uppercase text-black transition-transform group-focus-within:scale-110">
                CHAMPION SCANNER
              </div>
              <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-cyan-400 transition-colors group-focus-within:text-pink-500" size={28} />
              <input
                type="text"
                placeholder="ENTER NAME..."
                value={filters.search}
                onChange={(event) => onSearch(event.target.value)}
                className="w-full rounded-[20px] border-4 border-white/20 bg-black/40 py-6 pl-16 pr-8 text-2xl font-black italic uppercase placeholder:text-zinc-700 outline-none transition-all focus:border-cyan-400"
              />
            </div>

            <div className="grid grid-cols-2 gap-3 md:grid-cols-4 lg:grid-cols-4">
              <div className="group relative min-w-[140px]">
                <div className="absolute left-3 top-[-0.75rem] z-10 skew-x-[-8deg] border-2 border-black bg-pink-500 px-2 py-0.5 text-[10px] font-black uppercase text-black">
                  ROLE
                </div>
                <select
                  value={filters.tag}
                  onChange={(event) => onFilterChange("tag", event.target.value)}
                  className="w-full cursor-crosshair appearance-none rounded-[18px] border-2 border-white/10 bg-white/5 p-5 pt-7 text-xs font-black uppercase tracking-tighter outline-none transition-all hover:border-black hover:bg-pink-500 hover:text-black"
                >
                  <option value="all">ALL ROLES</option>
                  {tagOptions.map((role) => (
                    <option key={role} value={role}>{role}</option>
                  ))}
                </select>
              </div>

              <div className="group relative min-w-[140px]">
                <div className="absolute left-3 top-[-0.75rem] z-10 skew-x-[-8deg] border-2 border-black bg-cyan-400 px-2 py-0.5 text-[10px] font-black uppercase text-black">
                  STATUS
                </div>
                <select
                  value={filters.status}
                  onChange={(event) => onFilterChange("status", event.target.value as ChampionFilters["status"])}
                  className="w-full cursor-crosshair appearance-none rounded-[18px] border-2 border-white/10 bg-white/5 p-5 pt-7 text-xs font-black uppercase tracking-tighter outline-none transition-all hover:border-black hover:bg-cyan-400 hover:text-black"
                >
                  <option value="all">ALL STATUS</option>
                  <option value="validated">VALIDATED</option>
                  <option value="unvalidated">PENDING</option>
                </select>
              </div>

              <div className="group relative min-w-[140px]">
                <div className="absolute left-3 top-[-0.75rem] z-10 skew-x-[-8deg] border-2 border-black bg-yellow-400 px-2 py-0.5 text-[10px] font-black uppercase text-black">
                  RESOURCE
                </div>
                <select
                  value={filters.resource}
                  onChange={(event) => onFilterChange("resource", event.target.value)}
                  className="w-full cursor-crosshair appearance-none rounded-[18px] border-2 border-white/10 bg-white/5 p-5 pt-7 text-xs font-black uppercase tracking-tighter outline-none transition-all hover:border-black hover:bg-yellow-400 hover:text-black"
                >
                  <option value="all">ALL ENERGY</option>
                  {resourceOptions.map((resource) => (
                    <option key={resource} value={resource}>{resource}</option>
                  ))}
                </select>
              </div>

              <div className="group relative min-w-[140px]">
                <div className="absolute left-3 top-[-0.75rem] z-10 skew-x-[-8deg] border-2 border-black bg-white px-2 py-0.5 text-[10px] font-black uppercase text-black">
                  ORDER
                </div>
                <select
                  value={filters.sort}
                  onChange={(event) => onFilterChange("sort", event.target.value as ChampionFilters["sort"])}
                  className="w-full cursor-crosshair appearance-none rounded-[18px] border-2 border-white/10 bg-white/5 p-5 pt-7 text-xs font-black uppercase tracking-tighter outline-none transition-all hover:border-black hover:bg-white hover:text-black"
                >
                  <option value="name-asc">A TO Z</option>
                  <option value="name-desc">Z TO A</option>
                  <option value="recently-validated">RECENT</option>
                  <option value="unvalidated-first">PENDING</option>
                </select>
                <ArrowUpDown className="pointer-events-none absolute bottom-5 right-4 opacity-40 group-hover:text-black group-hover:opacity-100" size={12} />
              </div>
            </div>
          </div>
        </div>
      </section>

      <main className="mx-auto max-w-7xl px-6">
        {champions.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            <AnimatePresence mode="popLayout">
              {champions.map((champion) => (
                <motion.div
                  key={champion.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  whileHover={{ y: -5 }}
                  className={cn(
                    "group relative rounded-[32px] border-4 p-2 transition-all duration-300",
                    champion.isValidated
                      ? "border-white bg-pink-500 shadow-[10px_10px_0px_rgba(236,72,153,0.3)]"
                      : "border-zinc-700 bg-zinc-800 hover:border-zinc-500",
                  )}
                >
                  <div className="relative flex h-full flex-col space-y-4 overflow-hidden rounded-[24px] bg-zinc-900 p-5">
                    <div className={cn(
                      "absolute right-0 top-0 h-32 w-32 blur-[40px] opacity-20 transition-all group-hover:opacity-40",
                      champion.isValidated ? "bg-pink-400" : "bg-cyan-400",
                    )} />

                    <div className="relative z-10 flex items-start justify-between">
                      <div className="space-y-1">
                        <h3 className="text-2xl font-black italic uppercase leading-none tracking-tighter">
                          {champion.name}
                        </h3>
                        <p className="text-[9px] font-bold uppercase tracking-widest text-zinc-500">
                          {champion.title}
                        </p>
                      </div>
                      <div className={cn(
                        "flex h-10 w-10 items-center justify-center rounded-full border-2",
                        champion.isValidated ? "border-black bg-pink-500 text-black" : "border-zinc-700 bg-zinc-800 text-zinc-500",
                      )}>
                        {champion.isValidated ? <Zap size={18} fill="currentColor" /> : <div className="text-xs font-black">?</div>}
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {champion.tags.map((role) => (
                        <span key={role} className="rounded-full border border-zinc-700 bg-zinc-800 px-2 py-1 text-[8px] font-black uppercase">
                          {role}
                        </span>
                      ))}
                    </div>

                    <div className="-mx-5 mt-auto flex items-center justify-between border-t border-white/5 bg-white/5 px-5 py-4">
                      <div className="text-[8px] font-bold uppercase opacity-40">
                        RSC: {champion.partype}
                      </div>
                      <button
                        type="button"
                        onClick={() => onToggleChampion(champion.id)}
                        className={cn(
                          "rounded-xl px-6 py-2 text-[10px] font-black uppercase tracking-widest transition-all",
                          champion.isValidated
                            ? "bg-black text-white hover:bg-zinc-800"
                            : "bg-pink-500 text-black hover:scale-105 active:scale-95",
                        )}
                      >
                        {champion.isValidated ? "Revoke" : "Validate"}
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        ) : (
          <div className="space-y-6 py-24 text-center">
            <div className="inline-block rounded-full border-4 border-zinc-800 bg-zinc-900 p-8 animate-pulse">
              <Search size={64} className="text-zinc-700" />
            </div>
            <div className="space-y-2">
              <h2 className="text-4xl font-black italic uppercase text-zinc-700">No Champions Found</h2>
              <p className="font-bold uppercase tracking-widest text-zinc-600">Adjust your filters or try a different search</p>
            </div>
          </div>
        )}
      </main>

      <footer className="fixed bottom-8 left-1/2 z-50 -translate-x-1/2">
        <div className="group relative cursor-default">
          <div className="absolute -right-6 -top-6 z-20 -rotate-12 border-4 border-black bg-yellow-400 px-4 py-1.5 text-[10px] font-black uppercase tracking-tighter text-black shadow-xl">
            Cloud Sync Soon!
          </div>

          <div className="flex items-center gap-8 rounded-full border-4 border-white bg-zinc-900 px-8 py-3 text-white shadow-[12px_12px_0px_rgba(236,72,153,0.3)] transition-all hover:translate-y-[-4px] hover:shadow-[16px_16px_0px_rgba(236,72,153,0.4)]">
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="h-5 w-5 animate-pulse rounded-full border-4 border-black bg-cyan-400 shadow-[0_0_20px_rgba(34,211,238,0.5)]" />
                <div className="pointer-events-none absolute inset-0 scale-150 rounded-full border-2 border-white opacity-10" />
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] font-black italic uppercase leading-none tracking-[0.2em] text-pink-500">Local Mode Active</span>
                <span className="mt-1.5 text-[9px] font-bold uppercase tracking-widest opacity-40">v1.0.0 • On-Device Only</span>
              </div>
            </div>

            <div className="h-8 w-[4px] skew-x-[-20deg] bg-white/10" />

            <div className="flex flex-col items-center">
              <span className="bg-gradient-to-r from-pink-400 via-yellow-400 to-cyan-400 bg-clip-text text-2xl font-black italic leading-none tracking-tighter text-transparent">
                {summary.validated}
              </span>
              <span className="text-[8px] font-black uppercase tracking-widest opacity-60">Verified</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

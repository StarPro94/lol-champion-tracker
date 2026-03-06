import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, CheckCircle2, XCircle, Save, Shield } from "lucide-react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface Summary {
  total: number;
  validated: number;
  remaining: number;
  percentage: number;
}

interface Filters {
  search: string;
  status: "all" | "validated" | "unvalidated";
  tag: string;
  resource: string;
  sort: "name-asc" | "name-desc" | "recently-validated" | "unvalidated-first";
}

interface Option {
  value: string;
  label: string;
}

interface Champion {
  id: string;
  name: string;
  titleFr: string;
  imageUrl: string;
  splashImageUrl: string;
  tagsFr: string[];
  resourceFr: string;
  isValidated: boolean;
}

interface LocalTrackerShellProps {
  summary: Summary;
  filters: Filters;
  tagOptions: Option[];
  resourceOptions: Option[];
  champions: Champion[];
  onSearch: (value: string) => void;
  onFilterChange: (key: keyof Filters, value: Filters[keyof Filters]) => void;
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
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(34,211,238,0.16),_transparent_30%),radial-gradient(circle_at_20%_20%,_rgba(236,72,153,0.22),_transparent_28%),linear-gradient(180deg,_#18181b_0%,_#09090b_55%,_#0f172a_100%)] text-white selection:bg-pink-500 selection:text-black font-sans antialiased">
      <div className="pointer-events-none fixed inset-0 opacity-[0.08] mix-blend-screen">
        <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" className="h-full w-full">
          <filter id="noiseFilter">
            <feTurbulence type="fractalNoise" baseFrequency="0.75" numOctaves="3" stitchTiles="stitch" />
          </filter>
          <rect width="100%" height="100%" filter="url(#noiseFilter)" />
        </svg>
      </div>

      <div className="mx-auto flex max-w-7xl flex-col gap-10 px-4 py-6 md:px-8 md:py-10 lg:px-12 lg:py-14">
        <header className="relative overflow-hidden rounded-[36px] border border-white/12 bg-zinc-950/70 px-6 py-8 shadow-[0_24px_80px_rgba(15,23,42,0.55)] backdrop-blur-xl md:px-8 md:py-10">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(250,204,21,0.18),_transparent_24%),radial-gradient(circle_at_bottom_left,_rgba(34,211,238,0.16),_transparent_28%)]" />
          <div className="relative flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="space-y-4">
              <div className="inline-flex items-center rounded-full border border-cyan-400/30 bg-cyan-400/12 px-3 py-1 text-[11px] font-black uppercase tracking-[0.24em] text-cyan-300">
                Collection personnelle
              </div>
              <div className="space-y-3">
                <h1 className="bg-gradient-to-r from-pink-400 via-yellow-300 to-cyan-300 bg-clip-text text-5xl font-black italic uppercase tracking-[-0.08em] text-transparent md:text-7xl">
                  Suivi des champions
                </h1>
                <p className="max-w-2xl text-sm font-medium leading-6 text-zinc-300 md:text-base">
                  Suivez votre progression, filtrez votre collection et validez vos champions dans une interface plus lisible, plus dense et plus proche de l'univers du jeu.
                </p>
              </div>
            </div>

            <div className="inline-flex items-center gap-2 self-start rounded-full border border-white/10 bg-white/5 px-3 py-2 text-[11px] font-bold uppercase tracking-[0.18em] text-zinc-400 lg:self-auto">
              <Save size={12} className="text-cyan-300" />
              <span>Mode local</span>
            </div>
          </div>
        </header>

        <section className="overflow-hidden rounded-[36px] border border-white/12 bg-zinc-950/75 p-2 shadow-[0_24px_80px_rgba(8,15,35,0.55)] backdrop-blur-xl">
          <div className="rounded-[30px] border border-white/6 bg-[linear-gradient(135deg,rgba(236,72,153,0.14),rgba(24,24,27,0.92)_28%,rgba(34,211,238,0.10)_100%)] p-6 md:p-8">
            <div className="grid gap-4 md:grid-cols-4">
              <StatCard label="Total" value={summary.total} tone="cyan" />
              <StatCard label="Validés" value={summary.validated} tone="pink" />
              <StatCard label="Restants" value={summary.remaining} tone="yellow" />
              <StatCard label="Complétion" value={`${summary.percentage}%`} tone="white" />
            </div>

            <div className="mt-6 space-y-3">
              <div className="flex items-center justify-between text-[11px] font-black uppercase tracking-[0.22em] text-zinc-400">
                <span>Progression globale</span>
                <span>{summary.validated} sur {summary.total}</span>
              </div>
              <div className="relative h-4 overflow-hidden rounded-full border border-white/10 bg-zinc-900/80">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${summary.percentage}%` }}
                  transition={{ duration: 0.9, ease: "circOut" }}
                  className="h-full rounded-full bg-gradient-to-r from-pink-500 via-yellow-400 to-cyan-400"
                />
                <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.2),transparent)] opacity-40" />
              </div>
            </div>
          </div>
        </section>

        <nav className="sticky top-4 z-40 rounded-[32px] border border-white/12 bg-zinc-950/78 p-4 shadow-[0_20px_60px_rgba(8,15,35,0.55)] backdrop-blur-xl">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-5">
            <div className="relative group xl:col-span-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 transition-colors group-focus-within:text-cyan-300" size={18} />
              <input
                type="text"
                placeholder="Rechercher un champion"
                value={filters.search}
                onChange={(event) => onSearch(event.target.value)}
                className="w-full rounded-2xl border border-white/10 bg-black/40 py-3 pl-12 pr-4 text-sm font-bold text-white outline-none transition-all placeholder:text-zinc-600 focus:border-cyan-400/60 focus:bg-black/55"
              />
            </div>

            <FilterGroup
              label="Rôle"
              value={filters.tag}
              options={tagOptions}
              onChange={(value) => onFilterChange("tag", value)}
            />

            <FilterGroup
              label="Statut"
              value={filters.status}
              options={[
                { value: "all", label: "Tous les statuts" },
                { value: "validated", label: "Validés" },
                { value: "unvalidated", label: "À faire" },
              ]}
              onChange={(value) => onFilterChange("status", value as Filters["status"])}
            />

            <FilterGroup
              label="Ressource"
              value={filters.resource}
              options={resourceOptions}
              onChange={(value) => onFilterChange("resource", value)}
            />

            <FilterGroup
              label="Tri"
              value={filters.sort}
              options={[
                { value: "name-asc", label: "Nom (A-Z)" },
                { value: "name-desc", label: "Nom (Z-A)" },
                { value: "recently-validated", label: "Validation récente" },
                { value: "unvalidated-first", label: "À faire d'abord" },
              ]}
              onChange={(value) => onFilterChange("sort", value as Filters["sort"])}
            />
          </div>
        </nav>

        <main>
          {champions.length > 0 ? (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              <AnimatePresence>
                {champions.map((champion) => (
                  <ChampionCard
                    key={champion.id}
                    champion={champion}
                    onToggle={() => onToggleChampion(champion.id)}
                  />
                ))}
              </AnimatePresence>
            </div>
          ) : (
            <div className="rounded-[36px] border border-dashed border-white/12 bg-zinc-950/70 px-6 py-16 text-center shadow-[0_20px_60px_rgba(8,15,35,0.45)] backdrop-blur-xl">
              <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full border border-white/10 bg-white/5">
                <Shield className="text-zinc-600" size={40} />
              </div>
              <div className="mt-6 space-y-2">
                <h2 className="text-3xl font-black italic uppercase tracking-tight text-zinc-200">Aucun champion trouvé</h2>
                <p className="mx-auto max-w-xl text-sm text-zinc-400">
                  Ajustez votre recherche ou vos filtres pour retrouver un champion dans votre collection.
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  onSearch("");
                  onFilterChange("status", "all");
                  onFilterChange("tag", "all");
                  onFilterChange("resource", "all");
                  onFilterChange("sort", "name-asc");
                }}
                className="mt-6 rounded-xl border border-white/12 bg-white px-5 py-3 text-xs font-black uppercase tracking-[0.2em] text-black transition-all hover:bg-pink-500"
              >
                Réinitialiser les filtres
              </button>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

function StatCard({
  label,
  value,
  tone,
}: {
  label: string;
  value: string | number;
  tone: "pink" | "cyan" | "yellow" | "white";
}) {
  const toneClasses = {
    pink: "from-pink-500/22 to-pink-500/5 text-pink-300",
    cyan: "from-cyan-400/18 to-cyan-400/5 text-cyan-300",
    yellow: "from-yellow-400/18 to-yellow-400/5 text-yellow-300",
    white: "from-white/14 to-white/5 text-white",
  };

  return (
    <div className={cn("rounded-[24px] border border-white/8 bg-gradient-to-br p-5", toneClasses[tone])}>
      <p className="text-[11px] font-black uppercase tracking-[0.22em] text-zinc-400">{label}</p>
      <p className="mt-3 text-4xl font-black italic tracking-tight text-white">{value}</p>
    </div>
  );
}

function FilterGroup({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: Option[];
  onChange: (value: string) => void;
}) {
  return (
    <label className="flex flex-col gap-1">
      <span className="ml-1 text-[11px] font-black uppercase tracking-[0.18em] text-zinc-500">{label}</span>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-sm font-bold text-white outline-none transition-all hover:border-white/20 focus:border-pink-500/60"
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  );
}

function ChampionCard({
  champion,
  onToggle,
}: {
  champion: Champion;
  onToggle: () => void;
}) {
  const [visualSrc, setVisualSrc] = useState(champion.splashImageUrl);
  const [usedFallback, setUsedFallback] = useState(false);

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.96 }}
      whileHover={{ y: -6 }}
      className={cn(
        "group relative overflow-hidden rounded-[32px] border bg-zinc-950/85 shadow-[0_18px_40px_rgba(8,15,35,0.4)]",
        champion.isValidated ? "border-cyan-400/45" : "border-white/10 hover:border-pink-400/45",
      )}
    >
      <div className="relative aspect-[4/5] overflow-hidden">
        <img
          src={visualSrc}
          alt={`Visuel de ${champion.name}`}
          loading="lazy"
          decoding="async"
          onError={() => {
            if (!usedFallback) {
              setVisualSrc(champion.imageUrl);
              setUsedFallback(true);
            }
          }}
          className={cn(
            "absolute inset-0 h-full w-full object-cover object-top transition duration-700 group-hover:scale-105",
            usedFallback ? "object-contain bg-zinc-900 p-10" : "",
            champion.isValidated ? "opacity-70 saturate-[0.9]" : "",
          )}
        />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(9,9,11,0.12),rgba(9,9,11,0.42)_46%,rgba(9,9,11,0.96)_100%)]" />
        <div className="absolute inset-x-0 bottom-0 p-5">
          <div className="flex flex-wrap gap-2">
            {champion.tagsFr.map((tag) => (
              <span
                key={tag}
                className="rounded-full border border-white/10 bg-black/45 px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.16em] text-zinc-100 backdrop-blur-md"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        {champion.isValidated ? (
          <div className="absolute right-4 top-4 flex h-11 w-11 items-center justify-center rounded-full border border-cyan-300/40 bg-cyan-300/18 text-cyan-200 shadow-[0_0_18px_rgba(34,211,238,0.32)] backdrop-blur-md">
            <CheckCircle2 size={20} />
          </div>
        ) : null}
      </div>

      <div className="space-y-4 p-5">
        <div className="space-y-1">
          <h3 className="text-2xl font-black italic uppercase tracking-tight text-white transition-colors group-hover:text-pink-300">
            {champion.name}
          </h3>
          <p className="text-xs font-medium text-zinc-400">{champion.titleFr}</p>
        </div>

        <div className="inline-flex items-center rounded-full border border-cyan-400/20 bg-cyan-400/10 px-3 py-1 text-[10px] font-black uppercase tracking-[0.18em] text-cyan-200">
          {champion.resourceFr}
        </div>

        <button
          type="button"
          onClick={onToggle}
          className={cn(
            "flex w-full items-center justify-center gap-2 rounded-xl border px-4 py-3 text-xs font-black uppercase tracking-[0.22em] transition-all",
            champion.isValidated
              ? "border-zinc-700 bg-zinc-900 text-zinc-200 hover:border-red-400 hover:bg-red-500 hover:text-white"
              : "border-white bg-white text-black hover:border-pink-500 hover:bg-pink-500",
          )}
        >
          {champion.isValidated ? <XCircle size={16} /> : <CheckCircle2 size={16} />}
          {champion.isValidated ? "Retirer" : "Valider"}
        </button>
      </div>
    </motion.article>
  );
}

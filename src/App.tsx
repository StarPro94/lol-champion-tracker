import React, { useMemo, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";

import { applyChampionFilters, computeChampionProgress } from "../shared/championFilters";
import { mergeCatalogWithProgress } from "../shared/championProgress";
import { championCatalog } from "../shared/championCatalog";
import type { ChampionFilters, DwarfTriggerEvent, LegacyMigrationEntry } from "../shared/champions";
import { createDwarfTriggerEvent, shouldTriggerDwarf } from "../shared/legacyTracker";
import LocalTrackerShell from "./components/LocalTrackerShell";
import { readLocalProgress, toggleLocalChampionValidation } from "./lib/localTracker";

const DEFAULT_FILTERS: ChampionFilters = {
  search: "",
  status: "all",
  tag: "all",
  resource: "all",
  sort: "name-asc",
};

function normalizeResourceValue(value: string): string {
  return value.trim() === "" ? "None" : value;
}

function getInitialProgress(): LegacyMigrationEntry[] {
  if (typeof window === "undefined") {
    return [];
  }

  try {
    return readLocalProgress(window.localStorage);
  } catch (error) {
    console.error("Unable to read local tracker progress", error);
    return [];
  }
}

function CelebrationOverlay({
  event,
  onComplete,
}: {
  event: DwarfTriggerEvent;
  onComplete: () => void;
}) {
  const reduceMotion = useReducedMotion();

  React.useEffect(() => {
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
              <p className="text-xs font-black uppercase tracking-[0.5em]">Nain en fête</p>
              <h2 className="text-4xl font-black italic uppercase md:text-6xl">Champion validé !</h2>
              <p className="text-xs font-bold uppercase tracking-[0.3em] opacity-70">{event.championId}</p>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </motion.div>
  );
}

export function App() {
  const [filters, setFilters] = useState<ChampionFilters>(DEFAULT_FILTERS);
  const [localProgress, setLocalProgress] = useState<LegacyMigrationEntry[]>(() => getInitialProgress());
  const [celebrationEvent, setCelebrationEvent] = useState<DwarfTriggerEvent | null>(null);

  const mergedChampions = useMemo(() => {
    return mergeCatalogWithProgress(championCatalog.champions, localProgress);
  }, [localProgress]);

  const tagOptions = useMemo(() => {
    const labels = new Map<string, string>();

    for (const champion of championCatalog.champions) {
      champion.tags.forEach((tag, index) => {
        if (!labels.has(tag)) {
          labels.set(tag, champion.tagsFr[index] ?? tag);
        }
      });
    }

    return [
      { value: "all", label: "Tous les rôles" },
      ...[...labels.entries()]
        .sort((left, right) => left[1].localeCompare(right[1], "fr", { sensitivity: "base" }))
        .map(([value, label]) => ({ value, label })),
    ];
  }, []);

  const resourceOptions = useMemo(() => {
    const labels = new Map<string, string>();

    for (const champion of championCatalog.champions) {
      const normalizedResource = normalizeResourceValue(champion.partype);
      if (!labels.has(normalizedResource)) {
        labels.set(normalizedResource, champion.resourceFr);
      }
    }

    return [
      { value: "all", label: "Toutes les ressources" },
      ...[...labels.entries()]
        .sort((left, right) => left[1].localeCompare(right[1], "fr", { sensitivity: "base" }))
        .map(([value, label]) => ({ value, label })),
    ];
  }, []);

  const filteredChampions = useMemo(() => {
    return applyChampionFilters(mergedChampions, filters);
  }, [filters, mergedChampions]);

  const summary = useMemo(() => {
    return computeChampionProgress(mergedChampions);
  }, [mergedChampions]);

  function handleFilterChange<K extends keyof ChampionFilters>(key: K, value: ChampionFilters[K]) {
    setFilters((current) => ({ ...current, [key]: value }));
  }

  function handleToggle(championId: string) {
    const previous = mergedChampions.find((champion) => champion.id === championId)?.isValidated ?? false;

    try {
      const result = toggleLocalChampionValidation(window.localStorage, championId);
      setLocalProgress(result.progress);

      if (shouldTriggerDwarf(previous, result.isValidated)) {
        setCelebrationEvent(createDwarfTriggerEvent(championId));
      }
    } catch (error) {
      console.error("Unable to persist local tracker progress", error);
    }
  }

  return (
    <>
      <AnimatePresence>
        {celebrationEvent !== null ? (
          <CelebrationOverlay event={celebrationEvent} onComplete={() => setCelebrationEvent(null)} />
        ) : null}
      </AnimatePresence>

      <LocalTrackerShell
        summary={summary}
        filters={filters}
        tagOptions={tagOptions}
        resourceOptions={resourceOptions}
        champions={filteredChampions}
        onSearch={(value) => handleFilterChange("search", value)}
        onFilterChange={(key, value) =>
          handleFilterChange(key as keyof ChampionFilters, value as ChampionFilters[keyof ChampionFilters])
        }
        onToggleChampion={handleToggle}
      />
    </>
  );
}

export default App;

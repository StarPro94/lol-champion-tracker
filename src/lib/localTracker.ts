import type { LegacyMigrationEntry } from "../../shared/champions";
import { parseLegacyTrackerPayload } from "../../shared/legacyTracker";

export const LEGACY_STORAGE_KEY = "lol-champion-tracker:v1";

interface LocalTrackerStorage {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
  removeItem(key: string): void;
}

interface ToggleResult {
  championId: string;
  isValidated: boolean;
  validatedAt?: number;
  progress: LegacyMigrationEntry[];
}

export function readLocalProgress(
  storage: Pick<LocalTrackerStorage, "getItem">,
  fallbackTimestamp = Date.now(),
): LegacyMigrationEntry[] {
  return parseLegacyTrackerPayload(storage.getItem(LEGACY_STORAGE_KEY), fallbackTimestamp)?.entries ?? [];
}

export function writeLocalProgress(
  storage: Pick<LocalTrackerStorage, "setItem" | "removeItem">,
  progress: LegacyMigrationEntry[],
): void {
  const normalized = [...progress].sort((left, right) => left.championId.localeCompare(right.championId));

  if (normalized.length === 0) {
    storage.removeItem(LEGACY_STORAGE_KEY);
    return;
  }

  storage.setItem(
    LEGACY_STORAGE_KEY,
    JSON.stringify({
      played: normalized.map((entry) => entry.championId),
      playedAt: Object.fromEntries(
        normalized.map((entry) => [entry.championId, new Date(entry.validatedAt).toISOString()]),
      ),
    }),
  );
}

export function toggleLocalChampionValidation(
  storage: LocalTrackerStorage,
  championId: string,
  timestamp = Date.now(),
): ToggleResult {
  const current = readLocalProgress(storage, timestamp);
  const existing = current.find((entry) => entry.championId === championId);

  if (existing) {
    const progress = current.filter((entry) => entry.championId !== championId);
    writeLocalProgress(storage, progress);
    return { championId, isValidated: false, progress };
  }

  const nextEntry = { championId, validatedAt: timestamp };
  const progress = [...current, nextEntry];
  writeLocalProgress(storage, progress);

  return {
    championId,
    isValidated: true,
    validatedAt: timestamp,
    progress,
  };
}

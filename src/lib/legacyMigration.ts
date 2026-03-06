import type { LegacyMigrationEntry } from "../../shared/champions";
import { parseLegacyTrackerPayload } from "../../shared/legacyTracker";

export const LEGACY_STORAGE_KEY = "lol-champion-tracker:v1";
export const LEGACY_MIGRATION_SOURCE = "localStorage:v1";

export interface LegacyMigrationRequest {
  source: typeof LEGACY_MIGRATION_SOURCE;
  entries: LegacyMigrationEntry[];
}

export function readLegacyProgressFromStorage(
  storage: Pick<Storage, "getItem">,
  fallbackTimestamp = Date.now(),
): LegacyMigrationRequest | null {
  const payload = parseLegacyTrackerPayload(
    storage.getItem(LEGACY_STORAGE_KEY),
    fallbackTimestamp,
  );

  if (payload === null) {
    return null;
  }

  return {
    source: LEGACY_MIGRATION_SOURCE,
    entries: payload.entries,
  };
}

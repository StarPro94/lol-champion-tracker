import type { DwarfTriggerEvent, LegacyMigrationEntry } from "./champions";

interface ParsedLegacyTrackerPayload {
  entries: LegacyMigrationEntry[];
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function normalizeTimestamp(value: unknown, fallback: number): number {
  if (typeof value !== "string") {
    return fallback;
  }

  const parsed = Date.parse(value);
  return Number.isNaN(parsed) ? fallback : parsed;
}

export function parseLegacyTrackerPayload(
  raw: string | null,
  fallbackTimestamp = Date.now(),
): ParsedLegacyTrackerPayload | null {
  if (raw === null) {
    return null;
  }

  try {
    const parsed: unknown = JSON.parse(raw);

    if (!isRecord(parsed) || !("played" in parsed) || !Array.isArray(parsed.played)) {
      return null;
    }

    const playedAt = isRecord(parsed.playedAt) ? parsed.playedAt : {};
    const seen = new Set<string>();
    const entries: LegacyMigrationEntry[] = [];

    for (const championId of parsed.played) {
      if (typeof championId !== "string" || championId.trim() === "" || seen.has(championId)) {
        continue;
      }

      seen.add(championId);
      entries.push({
        championId,
        validatedAt: normalizeTimestamp(playedAt[championId], fallbackTimestamp),
      });
    }

    return { entries };
  } catch {
    return null;
  }
}

export function shouldTriggerDwarf(
  previousValidated: boolean,
  nextValidated: boolean,
): boolean {
  return !previousValidated && nextValidated;
}

export function createDwarfTriggerEvent(
  championId: string,
  timestamp = Date.now(),
): DwarfTriggerEvent {
  return {
    championId,
    variant: "validation",
    timestamp,
  };
}

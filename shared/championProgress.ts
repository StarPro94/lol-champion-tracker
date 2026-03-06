import type { ChampionCatalogEntry, ChampionListItem, LegacyMigrationEntry } from "./champions";

interface ProgressSnapshot {
  championId: string;
  validatedAt: number;
}

export function mergeCatalogWithProgress(
  catalog: ChampionCatalogEntry[],
  progress: ProgressSnapshot[] | LegacyMigrationEntry[],
): ChampionListItem[] {
  const progressMap = new Map(
    progress.map((entry) => [entry.championId, new Date(entry.validatedAt).toISOString()]),
  );

  return catalog.map((champion) => {
    const validatedAt = progressMap.get(champion.id) ?? null;

    return {
      ...champion,
      isValidated: validatedAt !== null,
      validatedAt,
    };
  });
}

import catalog from "../convex/data/championCatalog.json";
import type { ChampionCatalogEntry } from "./champions";

interface ChampionCatalogSnapshot {
  version: string;
  champions: ChampionCatalogEntry[];
}

export const championCatalog = catalog as ChampionCatalogSnapshot;

export interface ChampionCatalogEntry {
  id: string;
  key: string;
  name: string;
  title: string;
  imageUrl: string;
  tags: string[];
  partype: string;
}

export interface ChampionListItem extends ChampionCatalogEntry {
  isValidated: boolean;
  validatedAt: string | null;
}

export type ChampionStatusFilter = "all" | "validated" | "unvalidated";

export type ChampionSort =
  | "name-asc"
  | "name-desc"
  | "recently-validated"
  | "unvalidated-first";

export interface ChampionFilters {
  search: string;
  status: ChampionStatusFilter;
  tag: string;
  resource: string;
  sort: ChampionSort;
}

export interface ChampionProgressSummary {
  total: number;
  validated: number;
  remaining: number;
  percentage: number;
}

export interface LegacyMigrationEntry {
  championId: string;
  validatedAt: number;
}

export interface DwarfTriggerEvent {
  championId: string;
  variant: "validation";
  timestamp: number;
}

// Data Dragon Champion Types
export interface ChampionInfo {
  attack: number;
  defense: number;
  magic: number;
  difficulty: number;
}

export interface ChampionImage {
  full: string;
  sprite: string;
  group: string;
  x: number;
  y: number;
  w: number;
  h: number;
}

export interface Champion {
  id: string;
  key: string;
  name: string;
  title: string;
  blurb: string;
  info: ChampionInfo;
  image: ChampionImage;
  tags: string[];
  partype: string;
}

export interface ChampionData {
  type: string;
  format: string;
  version: string;
  data: Record<string, Champion>;
}

export type LaneRole = 'TOP' | 'JUNGLE' | 'MID' | 'BOT' | 'SUPPORT' | 'FLEX' | 'UNKNOWN';

export const LANE_ROLES: LaneRole[] = ['TOP', 'JUNGLE', 'MID', 'BOT', 'SUPPORT', 'FLEX'];

// localStorage Types
export const STORAGE_KEY = 'lol-champion-tracker:v1';
export const CURRENT_SCHEMA_VERSION = 2;

export interface StoredData {
  played: string[]; // champion.id
  laneRoles: Record<string, LaneRole[]>; // champion.id -> LaneRole[] (plusieurs rôles possibles)
  playedAt: Record<string, string>; // champion.id -> ISO date string
  schemaVersion: number;
}

export interface ChampionWithState extends Champion {
  isPlayed: boolean;
  laneRoles: LaneRole[]; // Tableau de rôles (peut être vide)
  playedAt?: string;
  imageUrl: string;
}

// Filter Types
export type FilterStatus = 'all' | 'played' | 'unplayed';

export type SortOption =
  | 'name-asc'
  | 'name-desc'
  | 'difficulty-asc'
  | 'difficulty-desc'
  | 'unplayed-first'
  | 'last-played';

export interface ChampionFilters {
  search: string;
  status: FilterStatus;
  tags: string[];
  partypes: string[];
  laneRoles: LaneRole[];
  sort: SortOption;
}

export interface ChampionStats {
  total: number;
  played: number;
  unplayed: number;
  percentage: number;
  byTag: Record<string, { total: number; played: number }>;
  byLaneRole: Record<string, { total: number; played: number }>;
  byPartype: Record<string, { total: number; played: number }>;
}

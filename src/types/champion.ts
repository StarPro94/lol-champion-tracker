export interface ChampionData {
  type: string;
  format: string;
  version: string;
  data: Record<string, ChampionInfo>;
}

export interface ChampionInfo {
  id: string;
  name: string;
  title: string;
  blurb: string;
  image: {
    full: string;
    sprite: string;
    group: string;
    x: number;
    y: number;
    w: number;
    h: number;
  };
}

export type ChampionStatus = Record<string, boolean>;

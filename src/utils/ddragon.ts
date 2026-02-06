import type { ChampionData, ChampionInfo } from '../types/champion';

const BASE_URL = 'https://ddragon.leagueoflegends.com/cdn';

export async function getLatestVersion(): Promise<string> {
  const response = await fetch('https://ddragon.leagueoflegends.com/api/versions.json');
  if (!response.ok) throw new Error('Failed to fetch versions');
  const versions = await response.json();
  return versions[0];
}

export async function fetchChampions(version: string): Promise<ChampionInfo[]> {
  // Try fr_FR first, fallback to en_US
  let data: ChampionData;

  try {
    const response = await fetch(`${BASE_URL}/${version}/data/fr_FR/champion.json`);
    if (!response.ok) throw new Error('fr_FR not available');
    data = await response.json();
  } catch {
    const response = await fetch(`${BASE_URL}/${version}/data/en_US/champion.json`);
    if (!response.ok) throw new Error('Failed to fetch champions');
    data = await response.json();
  }

  return Object.values(data.data);
}

export function getChampionIconUrl(version: string, iconName: string): string {
  return `${BASE_URL}/${version}/img/champion/${iconName}`;
}

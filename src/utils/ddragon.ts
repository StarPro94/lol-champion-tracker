import type { Champion, ChampionData } from '../types/champion';

const DDRAGON_BASE_URL = 'https://ddragon.leagueoflegends.com/cdn';

// Cache pour la version et les champions
let cachedVersion: string | null = null;
let cachedChampions: Champion[] | null = null;

/**
 * Récupère la dernière version de Data Dragon
 */
export async function getLatestVersion(): Promise<string> {
  if (cachedVersion) {
    return cachedVersion;
  }

  try {
    const response = await fetch('https://ddragon.leagueoflegends.com/api/versions.json');
    if (!response.ok) {
      throw new Error(`Failed to fetch versions: ${response.status}`);
    }

    const versions: string[] = await response.json();
    cachedVersion = versions[0]; // La première version est la plus récente
    return cachedVersion;
  } catch (error) {
    console.error('Error fetching latest version:', error);
    throw error;
  }
}

/**
 * Récupère la liste des champions depuis Data Dragon
 * Tente d'abord en français, fallback en anglais
 */
export async function fetchChampions(): Promise<Champion[]> {
  if (cachedChampions) {
    return cachedChampions;
  }

  const version = await getLatestVersion();

  // Essayer d'abord en français
  let data: ChampionData | null = null;
  let locale = 'fr_FR';

  try {
    const response = await fetch(
      `${DDRAGON_BASE_URL}/${version}/data/${locale}/champion.json`
    );

    if (response.ok) {
      data = await response.json();
    } else {
      throw new Error(`Failed to fetch ${locale} data: ${response.status}`);
    }
  } catch (error) {
    console.warn(`Failed to fetch ${locale} data, trying en_US...`, error);

    // Fallback en anglais
    try {
      const response = await fetch(
        `${DDRAGON_BASE_URL}/${version}/data/en_US/champion.json`
      );

      if (!response.ok) {
        throw new Error(`Failed to fetch en_US data: ${response.status}`);
      }

      data = await response.json();
      locale = 'en_US';
    } catch (fallbackError) {
      console.error('Error fetching champions data:', fallbackError);
      throw fallbackError;
    }
  }

  if (!data) {
    throw new Error('Failed to fetch champions data');
  }

  // Convertir l'objet en tableau
  cachedChampions = Object.values(data.data);
  return cachedChampions;
}

/**
 * Retourne l'URL de l'image d'un champion
 */
export function getChampionImageUrl(champion: Champion, version?: string): string {
  const v = version || cachedVersion;
  return `${DDRAGON_BASE_URL}/${v}/img/champion/${champion.image.full}`;
}

/**
 * Retourne la version courante (sans fetch)
 */
export function getCurrentVersion(): string | null {
  return cachedVersion;
}

/**
 * Vide le cache (utile pour forcer un rechargement)
 */
export function clearCache(): void {
  cachedVersion = null;
  cachedChampions = null;
}

/**
 * Précharge les images des champions pour éviter le lag
 */
export function preloadChampionImages(champions: Champion[]): void {
  const version = cachedVersion;
  if (!version) return;

  champions.forEach((champion) => {
    const img = new Image();
    img.src = getChampionImageUrl(champion, version);
  });
}

/**
 * Retourne une couleur de tag pour l'affichage
 */
export function getTagColor(tag: string): string {
  const colors: Record<string, string> = {
    Assassin: '#EEB0B0',
    Fighter: '#F2D2A9',
    Mage: '#C8AAE6',
    Marksman: '#A0C5E8',
    Support: '#F4ACA8',
    Tank: '#C4AA8D',
  };

  return colors[tag] || '#A0A0A0';
}

/**
 * Retourne une liste de tous les tags uniques disponibles
 */
export function getAllTags(champions: Champion[]): string[] {
  const tags = new Set<string>();
  champions.forEach((champion) => {
    champion.tags.forEach((tag) => tags.add(tag));
  });
  return Array.from(tags).sort();
}

/**
 * Retourne une liste de tous les partypes uniques disponibles
 */
export function getAllPartypes(champions: Champion[]): string[] {
  const partypes = new Set<string>();
  champions.forEach((champion) => {
    partypes.add(champion.partype);
  });
  return Array.from(partypes).sort();
}

/**
 * Normalise un partype pour l'affichage
 */
export function normalizePartype(partype: string): string {
  const translations: Record<string, string> = {
    Mana: 'Mana',
    BloodWell: 'Sang',
    Courage: 'Courage',
    Energy: 'Énergie',
    Ferocity: 'Férocité',
    Heat: 'Chaleur',
    Grit: 'Détermination',
    NoCost: 'Aucun',
    Flow: 'Flux',
    Rage: 'Rage',
    Shield: 'Bouclier',
    None: 'Aucun',
    'Blood Moon': 'Sang de lune',
    Crimson: 'Cramoisi',
    Doom: 'Doom',
    Feast: 'Festin',
    Fury: 'Furie',
    Innate: 'Inné',
    Manaless: 'Sans mana',
    Meteor: 'Météore',
    Momentum: 'Élan',
    None2: 'Aucun',
    Overtime: 'Overtime',
    Pain: 'Douleur',
    Plasma: 'Plasma',
    Stack: 'Stack',
    Stamina: 'Stamina',
    Torment: 'Tourment',
    Violence: 'Violence',
    Vitacity: 'Vitalité',
  };

  return translations[partype] || partype;
}

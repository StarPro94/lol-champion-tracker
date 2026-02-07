import type { StoredData, LaneRole } from '../types/champion';
import { STORAGE_KEY, CURRENT_SCHEMA_VERSION } from '../types/champion';

/**
 * État initial des données stockées
 */
function getInitialStoredData(): StoredData {
  return {
    played: [],
    laneRoles: {},
    playedAt: {},
    schemaVersion: CURRENT_SCHEMA_VERSION,
  };
}

/**
 * Vérifie si localStorage est disponible
 */
export function isLocalStorageAvailable(): boolean {
  try {
    const test = '__storage_test__';
    localStorage.setItem(test, test);
    localStorage.removeItem(test);
    return true;
  } catch {
    return false;
  }
}

/**
 * Charge les données depuis localStorage
 */
export function loadStoredData(): StoredData {
  if (!isLocalStorageAvailable()) {
    console.warn('localStorage is not available');
    return getInitialStoredData();
  }

  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) {
      return getInitialStoredData();
    }

    const data: StoredData = JSON.parse(stored);

    // Migration de schéma si nécessaire
    if (data.schemaVersion !== CURRENT_SCHEMA_VERSION) {
      return migrateData(data);
    }

    return data;
  } catch (error) {
    console.error('Error loading stored data:', error);
    return getInitialStoredData();
  }
}

/**
 * Sauvegarde les données dans localStorage
 */
export function saveStoredData(data: StoredData): boolean {
  if (!isLocalStorageAvailable()) {
    console.warn('localStorage is not available');
    return false;
  }

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    return true;
  } catch (error) {
    console.error('Error saving stored data:', error);
    return false;
  }
}

/**
 * Migre les données si le schéma a changé
 */
function migrateData(oldData: StoredData): StoredData {
  // Pour l'instant, pas de migration nécessaire
  // À l'avenir, on pourra gérer les différentes versions ici
  return {
    ...oldData,
    schemaVersion: CURRENT_SCHEMA_VERSION,
  };
}

/**
 * Vérifie si un champion est marqué comme joué
 */
export function isPlayed(championId: string): boolean {
  const data = loadStoredData();
  return data.played.includes(championId);
}

/**
 * Bascule l'état "joué" d'un champion
 */
export function togglePlayed(championId: string): boolean {
  const data = loadStoredData();
  const index = data.played.indexOf(championId);

  if (index > -1) {
    // Retirer des joués
    data.played.splice(index, 1);
    delete data.playedAt[championId];
  } else {
    // Ajouter aux joués
    data.played.push(championId);
    data.playedAt[championId] = new Date().toISOString();
  }

  return saveStoredData(data);
}

/**
 * Force l'état "joué" d'un champion
 */
export function setPlayed(championId: string, played: boolean): boolean {
  const data = loadStoredData();
  const index = data.played.indexOf(championId);

  if (played && index === -1) {
    data.played.push(championId);
    data.playedAt[championId] = new Date().toISOString();
  } else if (!played && index > -1) {
    data.played.splice(index, 1);
    delete data.playedAt[championId];
  }

  return saveStoredData(data);
}

/**
 * Récupère le rôle lane assigné à un champion
 */
export function getLaneRole(championId: string): LaneRole | undefined {
  const data = loadStoredData();
  return data.laneRoles[championId];
}

/**
 * Assigne un rôle lane à un champion
 */
export function setLaneRole(championId: string, role: LaneRole | undefined): boolean {
  const data = loadStoredData();

  if (role) {
    data.laneRoles[championId] = role;
  } else {
    delete data.laneRoles[championId];
  }

  return saveStoredData(data);
}

/**
 * Récupère la date de jeu d'un champion
 */
export function getPlayedAt(championId: string): Date | undefined {
  const data = loadStoredData();
  const dateStr = data.playedAt[championId];
  return dateStr ? new Date(dateStr) : undefined;
}

/**
 * Exporte les données au format JSON
 */
export function exportData(): string {
  const data = loadStoredData();
  return JSON.stringify(data, null, 2);
}

/**
 * Importe des données depuis un JSON
 * @param json Le JSON à importer
 * @param merge Si true, fusionne avec les données existantes. Si false, écrase tout.
 */
export function importData(json: string, merge: boolean = true): boolean {
  try {
    const importedData: StoredData = JSON.parse(json);

    // Validation basique
    if (
      typeof importedData !== 'object' ||
      !Array.isArray(importedData.played) ||
      typeof importedData.laneRoles !== 'object' ||
      typeof importedData.playedAt !== 'object'
    ) {
      throw new Error('Invalid data format');
    }

    let data: StoredData;

    if (merge) {
      data = loadStoredData();

      // Fusionner les joués (union des deux sets)
      const playedSet = new Set([...data.played, ...importedData.played]);
      data.played = Array.from(playedSet);

      // Fusionner les lane roles (importé écrase local si conflit)
      data.laneRoles = { ...data.laneRoles, ...importedData.laneRoles };

      // Fusionner les playedAt (garder la date la plus récente)
      Object.entries(importedData.playedAt).forEach(([championId, dateStr]) => {
        const existingDate = data.playedAt[championId];
        if (!existingDate || new Date(dateStr) > new Date(existingDate)) {
          data.playedAt[championId] = dateStr;
        }
      });
    } else {
      // Mode écrasement
      data = {
        ...importedData,
        schemaVersion: CURRENT_SCHEMA_VERSION,
      };
    }

    return saveStoredData(data);
  } catch (error) {
    console.error('Error importing data:', error);
    return false;
  }
}

/**
 * Réinitialise toutes les données
 */
export function resetData(): boolean {
  return saveStoredData(getInitialStoredData());
}

/**
 * Récupère toutes les données
 */
export function getAllData(): StoredData {
  return loadStoredData();
}

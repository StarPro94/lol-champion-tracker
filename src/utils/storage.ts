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
function saveStoredData(data: StoredData): boolean {
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
function migrateData(oldData: any): StoredData {
  const migrated: StoredData = {
    played: [],
    laneRoles: {},
    playedAt: {},
    schemaVersion: CURRENT_SCHEMA_VERSION,
  };

  // Migrer les champions joués
  if (Array.isArray(oldData.played)) {
    migrated.played = oldData.played;
  }

  // Migrer les dates
  if (typeof oldData.playedAt === 'object') {
    migrated.playedAt = oldData.playedAt;
  }

  // Migrer les lane roles - version 1 -> 2 (single role -> array of roles)
  if (typeof oldData.laneRoles === 'object') {
    Object.entries(oldData.laneRoles).forEach(([championId, role]: [string, any]) => {
      // Si c'était un seul rôle, le mettre dans un tableau
      if (typeof role === 'string') {
        migrated.laneRoles[championId] = [role as LaneRole];
      } else if (Array.isArray(role)) {
        migrated.laneRoles[championId] = role as LaneRole[];
      }
    });
  }

  return migrated;
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
 * Récupère les rôles lanes assignés à un champion
 */
export function getLaneRoles(championId: string): LaneRole[] {
  const data = loadStoredData();
  return data.laneRoles[championId] || [];
}

/**
 * Assigne un rôle lane à un champion (ajoute au tableau existant)
 */
export function addLaneRole(championId: string, role: LaneRole): boolean {
  const data = loadStoredData();

  if (!data.laneRoles[championId]) {
    data.laneRoles[championId] = [];
  }

  if (!data.laneRoles[championId].includes(role)) {
    data.laneRoles[championId].push(role);
  }

  return saveStoredData(data);
}

/**
 * Retire un rôle lane d'un champion
 */
export function removeLaneRole(championId: string, role: LaneRole): boolean {
  const data = loadStoredData();

  if (data.laneRoles[championId]) {
    data.laneRoles[championId] = data.laneRoles[championId].filter((r) => r !== role);

    // Supprimer la clé si plus aucun rôle
    if (data.laneRoles[championId].length === 0) {
      delete data.laneRoles[championId];
    }
  }

  return saveStoredData(data);
}

/**
 * Toggle un rôle lane (ajoute si absent, retire si présent)
 */
export function toggleLaneRole(championId: string, role: LaneRole): boolean {
  const roles = getLaneRoles(championId);
  if (roles.includes(role)) {
    return removeLaneRole(championId, role);
  } else {
    return addLaneRole(championId, role);
  }
}

/**
 * Assigne tous les rôles lanes d'un champion (remplace)
 */
export function setLaneRoles(championId: string, roles: LaneRole[]): boolean {
  const data = loadStoredData();

  if (roles.length > 0) {
    data.laneRoles[championId] = roles;
  } else {
    delete data.laneRoles[championId];
  }

  return saveStoredData(data);
}

/**
 * Vérifie si un champion a un rôle spécifique
 */
export function hasLaneRole(championId: string, role: LaneRole): boolean {
  const roles = getLaneRoles(championId);
  return roles.includes(role);
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

      // Fusionner les lane roles (merge des tableaux)
      Object.entries(importedData.laneRoles).forEach(([championId, roles]: [string, any]) => {
        if (Array.isArray(roles)) {
          const existingRoles = data.laneRoles[championId] || [];
          const mergedRoles = Array.from(new Set([...existingRoles, ...roles]));
          if (mergedRoles.length > 0) {
            data.laneRoles[championId] = mergedRoles;
          }
        }
      });

      // Fusionner les playedAt (garder la date la plus récente)
      Object.entries(importedData.playedAt).forEach(([championId, dateStr]) => {
        const existingDate = data.playedAt[championId];
        if (!existingDate || new Date(dateStr) > new Date(existingDate)) {
          data.playedAt[championId] = dateStr;
        }
      });
    } else {
      // Mode écrasement avec migration si nécessaire
      data = {
        ...importedData,
        schemaVersion: CURRENT_SCHEMA_VERSION,
      };

      // S'assurer que les laneRoles sont bien des tableaux
      Object.entries(data.laneRoles).forEach(([championId, roles]: [string, any]) => {
        if (!Array.isArray(roles)) {
          data.laneRoles[championId] = [roles];
        }
      });
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

import type { ChampionWithState, ChampionFilters, LaneRole } from '../types/champion';

/**
 * Filtre une liste de champions selon les critères donnés
 */
export function filterChampions(
  champions: ChampionWithState[],
  filters: ChampionFilters
): ChampionWithState[] {
  let result = [...champions];

  // Filtre par recherche texte
  if (filters.search.trim()) {
    const searchLower = filters.search.toLowerCase().trim();
    result = result.filter(
      (champion) =>
        champion.name.toLowerCase().includes(searchLower) ||
        champion.title.toLowerCase().includes(searchLower) ||
        champion.tags.some((tag) => tag.toLowerCase().includes(searchLower))
    );
  }

  // Filtre par statut (tous / joués / non joués)
  if (filters.status === 'played') {
    result = result.filter((champion) => champion.isPlayed);
  } else if (filters.status === 'unplayed') {
    result = result.filter((champion) => !champion.isPlayed);
  }

  // Filtre par tags (classes) - multi-select
  if (filters.tags.length > 0) {
    result = result.filter((champion) =>
      filters.tags.some((tag) => champion.tags.includes(tag))
    );
  }

  // Filtre par partypes (ressources) - multi-select
  if (filters.partypes.length > 0) {
    result = result.filter((champion) => filters.partypes.includes(champion.partype));
  }

  // Filtre par lane roles custom - multi-select (un champion peut avoir plusieurs rôles)
  if (filters.laneRoles.length > 0) {
    result = result.filter((champion) =>
      // Inclure si au moins un des rôles du champion est dans les filtres
      champion.laneRoles.some((role) => filters.laneRoles.includes(role))
    );
  }

  // Tri
  result = sortChampions(result, filters.sort);

  return result;
}

/**
 * Trie une liste de champions selon le critère donné
 */
export function sortChampions(
  champions: ChampionWithState[],
  sort: ChampionFilters['sort']
): ChampionWithState[] {
  const result = [...champions];

  switch (sort) {
    case 'name-asc':
      return result.sort((a, b) => a.name.localeCompare(b.name));

    case 'name-desc':
      return result.sort((a, b) => b.name.localeCompare(a.name));

    case 'difficulty-asc':
      return result.sort((a, b) => a.info.difficulty - b.info.difficulty);

    case 'difficulty-desc':
      return result.sort((a, b) => b.info.difficulty - a.info.difficulty);

    case 'unplayed-first':
      return result.sort((a, b) => {
        if (a.isPlayed === b.isPlayed) return a.name.localeCompare(b.name);
        return a.isPlayed ? 1 : -1;
      });

    case 'last-played':
      return result.sort((a, b) => {
        const dateA = a.playedAt ? new Date(a.playedAt).getTime() : 0;
        const dateB = b.playedAt ? new Date(b.playedAt).getTime() : 0;

        // Ceux sans date vont à la fin
        if (!dateA && !dateB) return a.name.localeCompare(b.name);
        if (!dateA) return 1;
        if (!dateB) return -1;

        return dateB - dateA; // Plus récent d'abord
      });

    default:
      return result;
  }
}

/**
 * Compte les champions par tag
 */
export function countByTag(
  champions: ChampionWithState[],
  tag: string
): { total: number; played: number } {
  const withTag = champions.filter((champion) => champion.tags.includes(tag));
  return {
    total: withTag.length,
    played: withTag.filter((champion) => champion.isPlayed).length,
  };
}

/**
 * Compte les champions par rôle lane
 * Note: un champion peut avoir plusieurs rôles, donc la somme des totaux > nombre total de champions
 */
export function countByLaneRole(
  champions: ChampionWithState[],
  laneRole: LaneRole
): { total: number; played: number } {
  const withRole = champions.filter(
    (champion) => champion.laneRoles.includes(laneRole)
  );
  return {
    total: withRole.length,
    played: withRole.filter((champion) => champion.isPlayed).length,
  };
}

/**
 * Compte les champions par partype
 */
export function countByPartype(
  champions: ChampionWithState[],
  partype: string
): { total: number; played: number } {
  const withPartype = champions.filter((champion) => champion.partype === partype);
  return {
    total: withPartype.length,
    played: withPartype.filter((champion) => champion.isPlayed).length,
  };
}

/**
 * Sélectionne un champion au hasard parmi ceux non joués
 */
export function getRandomUnplayedChampion(
  champions: ChampionWithState[],
  filters?: Omit<Partial<ChampionFilters>, 'search' | 'sort' | 'status'>
): ChampionWithState | null {
  // Filtrer les champions non joués
  let unplayed = champions.filter((champion) => !champion.isPlayed);

  // Appliquer les filtres si fournis
  if (filters) {
    if (filters.tags && filters.tags.length > 0) {
      unplayed = unplayed.filter((champion) =>
        filters.tags!.some((tag) => champion.tags.includes(tag))
      );
    }

    if (filters.partypes && filters.partypes.length > 0) {
      unplayed = unplayed.filter((champion) => filters.partypes!.includes(champion.partype));
    }

    if (filters.laneRoles && filters.laneRoles.length > 0) {
      unplayed = unplayed.filter((champion) =>
        champion.laneRoles.some((role) => filters.laneRoles!.includes(role))
      );
    }
  }

  if (unplayed.length === 0) {
    return null;
  }

  return unplayed[Math.floor(Math.random() * unplayed.length)];
}

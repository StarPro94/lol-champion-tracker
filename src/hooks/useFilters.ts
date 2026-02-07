import { useState, useCallback, useMemo } from 'react';
import type { ChampionFilters, ChampionWithState } from '../types/champion';
import { filterChampions } from '../utils/filters';

interface UseFiltersResult {
  filters: ChampionFilters;
  setFilters: (filters: Partial<ChampionFilters>) => void;
  resetFilters: () => void;
  filteredChampions: ChampionWithState[];
  filterCount: number;
}

const DEFAULT_FILTERS: ChampionFilters = {
  search: '',
  status: 'all',
  tags: [],
  partypes: [],
  laneRoles: [],
  sort: 'name-asc',
};

export function useFilters(champions: ChampionWithState[]): UseFiltersResult {
  const [filters, setFiltersState] = useState<ChampionFilters>(DEFAULT_FILTERS);

  const setFilters = useCallback((newFilters: Partial<ChampionFilters>) => {
    setFiltersState((prev) => ({ ...prev, ...newFilters }));
  }, []);

  const resetFilters = useCallback(() => {
    setFiltersState(DEFAULT_FILTERS);
  }, []);

  // Compter le nombre de filtres actifs
  const filterCount = useMemo(() => {
    let count = 0;
    if (filters.search) count++;
    if (filters.status !== 'all') count++;
    if (filters.tags.length > 0) count++;
    if (filters.partypes.length > 0) count++;
    if (filters.laneRoles.length > 0) count++;
    return count;
  }, [filters]);

  // Appliquer les filtres
  const filteredChampions = useMemo(() => {
    return filterChampions(champions, filters);
  }, [champions, filters]);

  return {
    filters,
    setFilters,
    resetFilters,
    filteredChampions,
    filterCount,
  };
}

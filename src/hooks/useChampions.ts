import { useState, useEffect, useCallback } from 'react';
import type { Champion, ChampionWithState } from '../types/champion';
import { fetchChampions, getChampionImageUrl, getCurrentVersion } from '../utils/ddragon';
import { getAllData } from '../utils/storage';
import { getDefaultChampionRoles } from '../data/championRoles';

interface UseChampionsResult {
  champions: ChampionWithState[];
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export function useChampions(): UseChampionsResult {
  const [champions, setChampions] = useState<ChampionWithState[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadChampions = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const data: Champion[] = await fetchChampions();
      const storedData = getAllData();

      // Fusionner les champions avec leur état stocké
      // Si aucun rôle n'est assigné, utiliser les rôles par défaut
      const championsWithState: ChampionWithState[] = data.map((champion) => {
        const storedRoles = storedData.laneRoles[champion.id];
        const roles = storedRoles && storedRoles.length > 0
          ? storedRoles
          : getDefaultChampionRoles(champion.id);

        return {
          ...champion,
          isPlayed: storedData.played.includes(champion.id),
          laneRoles: roles,
          playedAt: storedData.playedAt[champion.id],
          imageUrl: getChampionImageUrl(champion, getCurrentVersion() || undefined),
        };
      });

      setChampions(championsWithState);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      setError(`Failed to load champions: ${message}`);
      console.error('Error loading champions:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadChampions();
  }, [loadChampions]);

  return {
    champions,
    isLoading,
    error,
    refetch: loadChampions,
  };
}

import { useState, useEffect } from 'react';
import { loadChampionStatus, saveChampionStatus } from '../utils/storage';
import type { ChampionStatus } from '../types/champion';

export function useLocalStorage(): [ChampionStatus, (id: string, played: boolean) => void, (status: ChampionStatus) => void] {
  const [status, setStatus] = useState<ChampionStatus>({});
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    setStatus(loadChampionStatus());
    setInitialized(true);
  }, []);

  const toggleChampion = (id: string, played: boolean) => {
    setStatus(prev => {
      const newStatus = { ...prev, [id]: played };
      if (initialized) {
        saveChampionStatus(newStatus);
      }
      return newStatus;
    });
  };

  const replaceStatus = (newStatus: ChampionStatus) => {
    setStatus(newStatus);
    saveChampionStatus(newStatus);
  };

  return [status, toggleChampion, replaceStatus];
}

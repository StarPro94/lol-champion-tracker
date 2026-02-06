import { useState, useEffect } from 'react';
import { getLatestVersion, fetchChampions } from '../utils/ddragon';
import type { ChampionInfo } from '../types/champion';

export function useChampions() {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [champions, setChampions] = useState<ChampionInfo[]>([]);
  const [version, setVersion] = useState('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setStatus('loading');
      setError(null);

      try {
        const latestVersion = await getLatestVersion();
        const latestChampions = await fetchChampions(latestVersion);

        if (!cancelled) {
          setStatus('success');
          setChampions(latestChampions);
          setVersion(latestVersion);
        }
      } catch (err) {
        if (!cancelled) {
          setStatus('error');
          setError(err instanceof Error ? err.message : 'Unknown error');
        }
      }
    }

    load();

    return () => {
      cancelled = true;
    };
  }, []);

  return { status, champions, version, error };
}

import { useMemo } from 'react';
import type { ChampionInfo } from '../types/champion';
import { ChampionCard } from './ChampionCard';
import type { ChampionStatus } from '../types/champion';

type Filter = 'all' | 'played' | 'unplayed';

interface ChampionGridProps {
  champions: ChampionInfo[];
  version: string;
  status: ChampionStatus;
  onToggle: (id: string, played: boolean) => void;
  searchQuery: string;
  filter: Filter;
}

export function ChampionGrid({ champions, version, status, onToggle, searchQuery, filter }: ChampionGridProps) {
  const filteredChampions = useMemo(() => {
    let filtered = champions;

    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(c => c.name.toLowerCase().includes(query));
    }

    // Apply status filter
    if (filter === 'played') {
      filtered = filtered.filter(c => status[c.id]);
    } else if (filter === 'unplayed') {
      filtered = filtered.filter(c => !status[c.id]);
    }

    return filtered;
  }, [champions, status, searchQuery, filter]);

  if (filteredChampions.length === 0) {
    return (
      <div className="empty-state">
        <p>Aucun champion trouvé</p>
      </div>
    );
  }

  return (
    <div className="champion-grid">
      {filteredChampions.map(champion => (
        <ChampionCard
          key={champion.id}
          champion={champion}
          version={version}
          isPlayed={!!status[champion.id]}
          onToggle={() => onToggle(champion.id, !status[champion.id])}
        />
      ))}
    </div>
  );
}

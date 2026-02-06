type Filter = 'all' | 'played' | 'unplayed';

interface FilterTabsProps {
  current: Filter;
  onChange: (filter: Filter) => void;
  playedCount: number;
  unplayedCount: number;
}

export function FilterTabs({ current, onChange, playedCount, unplayedCount }: FilterTabsProps) {
  const filters: Array<{ key: Filter; label: string; count: number }> = [
    { key: 'all', label: 'Tous', count: playedCount + unplayedCount },
    { key: 'played', label: 'Joués', count: playedCount },
    { key: 'unplayed', label: 'Non joués', count: unplayedCount },
  ];

  return (
    <div className="filter-tabs">
      {filters.map(filter => (
        <button
          key={filter.key}
          className={`filter-tab ${current === filter.key ? 'active' : ''}`}
          onClick={() => onChange(filter.key)}
          aria-label={`Filtrer: ${filter.label}`}
        >
          {filter.label}
          <span className="filter-count">{filter.count}</span>
        </button>
      ))}
    </div>
  );
}

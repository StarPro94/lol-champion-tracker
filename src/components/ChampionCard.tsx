import type { ChampionInfo } from '../types/champion';

interface ChampionCardProps {
  champion: ChampionInfo;
  version: string;
  isPlayed: boolean;
  onToggle: () => void;
}

export function ChampionCard({ champion, version, isPlayed, onToggle }: ChampionCardProps) {
  const iconUrl = `https://ddragon.leagueoflegends.com/cdn/${version}/img/champion/${champion.image.full}`;

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    e.currentTarget.src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="120" height="120"><rect fill="%23333" width="120" height="120"/><text fill="%23666" font-family="sans-serif" font-size="14" x="50%25" y="50%25" text-anchor="middle" dominant-baseline="middle">?</text></svg>';
  };

  return (
    <button
      onClick={onToggle}
      className={`champion-card ${isPlayed ? 'played' : ''}`}
      aria-label={`${champion.name} - ${isPlayed ? 'Joué' : 'Non joué'}`}
    >
      <div className="champion-icon-wrapper">
        <img
          src={iconUrl}
          alt={champion.name}
          className="champion-icon"
          loading="lazy"
          onError={handleImageError}
        />
        {isPlayed && <div className="played-badge">✓</div>}
      </div>
      <span className="champion-name">{champion.name}</span>
    </button>
  );
}

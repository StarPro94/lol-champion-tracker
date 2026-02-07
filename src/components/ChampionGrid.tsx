import React from 'react';
import type { ChampionWithState, LaneRole } from '../types/champion';
import { ChampionCard } from './ChampionCard';
import './ChampionGrid.css';

interface ChampionGridProps {
  champions: ChampionWithState[];
  isLoading?: boolean;
  onToggle: (championId: string) => void;
  onLaneRoleChange?: (championId: string, role: LaneRole | undefined) => void;
  emptyMessage?: string;
}

export const ChampionGrid: React.FC<ChampionGridProps> = ({
  champions,
  isLoading = false,
  onToggle,
  onLaneRoleChange,
  emptyMessage = 'Aucun champion trouvé',
}) => {
  if (isLoading) {
    return (
      <div className="champion-grid-container">
        <div className="champion-grid-loading">
          <div className="loading-spinner" />
          <p>Chargement des champions...</p>
        </div>
      </div>
    );
  }

  if (champions.length === 0) {
    return (
      <div className="champion-grid-container">
        <div className="champion-grid-empty">
          <svg
            width="64"
            height="64"
            viewBox="0 0 64 64"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle
              cx="32"
              cy="32"
              r="28"
              stroke="currentColor"
              strokeWidth="2"
              className="empty-icon"
            />
            <path
              d="M32 20V32L40 40"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              className="empty-icon"
            />
          </svg>
          <p className="empty-message">{emptyMessage}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="champion-grid-container">
      <p className="champion-count">{champions.length} champion{champions.length > 1 ? 's' : ''}</p>
      <div className="champion-grid">
        {champions.map((champion) => (
          <ChampionCard
            key={champion.id}
            champion={champion}
            onToggle={onToggle}
            onLaneRoleChange={onLaneRoleChange}
          />
        ))}
      </div>
    </div>
  );
};

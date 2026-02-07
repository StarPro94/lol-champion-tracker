import React, { useState, useRef, useEffect } from 'react';
import type { ChampionWithState, LaneRole } from '../types/champion';
import { LANE_ROLES } from '../types/champion';
import { getTagColor } from '../utils/ddragon';
import './ChampionCard.css';

interface ChampionCardProps {
  champion: ChampionWithState;
  onToggle: (championId: string) => void;
  onLaneRoleToggle?: (championId: string, role: LaneRole) => void;
}

export const ChampionCard: React.FC<ChampionCardProps> = ({
  champion,
  onToggle,
  onLaneRoleToggle,
}) => {
  const [showLaneMenu, setShowLaneMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Fermer le menu si on clique ailleurs
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowLaneMenu(false);
      }
    };

    if (showLaneMenu) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showLaneMenu]);

  const handleCardClick = () => {
    onToggle(champion.id);
  };

  const handleLaneClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowLaneMenu(!showLaneMenu);
  };

  const handleLaneToggle = (e: React.MouseEvent, role: LaneRole) => {
    e.stopPropagation();
    onLaneRoleToggle?.(champion.id, role);
  };

  // Rôles assignés au champion
  const assignedRoles = champion.laneRoles || [];
  const hasRoles = assignedRoles.length > 0;

  return (
    <div
      className={`champion-card ${champion.isPlayed ? 'played' : 'unplayed'}`}
      onClick={handleCardClick}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleCardClick();
        }
      }}
      role="button"
      tabIndex={0}
      aria-pressed={champion.isPlayed}
      aria-label={`${champion.name}, ${champion.isPlayed ? 'joué' : 'non joué'}${hasRoles ? `, rôles: ${assignedRoles.join(', ')}` : ''}`}
    >
      <div className="champion-image-container">
        <img
          src={champion.imageUrl}
          alt={champion.name}
          className="champion-image"
          loading="lazy"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="120" height="120"%3E%3Crect fill="%23091e33" width="120" height="120"/%3E%3Ctext fill="%23C89B3C" x="50%25" y="50%25" text-anchor="middle" dy=".3em" font-size="14"%3E?%3C/text%3E%3C/svg%3E';
          }}
        />
        <div className="champion-overlay" />
        {champion.isPlayed && (
          <div className="played-badge">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path
                d="M13.5 4.5L6 12L2.5 8.5"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        )}
      </div>

      <div className="champion-info">
        <div className="champion-header">
          <h3 className="champion-name">{champion.name}</h3>
          {onLaneRoleToggle && (
            <div className="lane-selector" ref={menuRef}>
              <button
                type="button"
                className={`lane-badge ${hasRoles ? '' : 'empty'} ${assignedRoles.length > 0 ? assignedRoles[0].toLowerCase() : ''}`}
                onClick={handleLaneClick}
                aria-label={`Assigner rôles lane${hasRoles ? `, actuels: ${assignedRoles.join(', ')}` : ''}`}
              >
                {hasRoles ? (
                  <span className="role-labels">
                    {assignedRoles.slice(0, 2).map((r) => (
                      <span key={r} className={`role-dot ${r.toLowerCase()}`}>{r}</span>
                    ))}
                    {assignedRoles.length > 2 && <span className="role-more">+{assignedRoles.length - 2}</span>}
                  </span>
                ) : (
                  <span className="role-placeholder">
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                      <path d="M6 2V10M2 6H10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                    </svg>
                  </span>
                )}
              </button>
              {showLaneMenu && (
                <div className="lane-menu">
                  <div className="lane-menu-title">Assigner rôles</div>
                  {LANE_ROLES.map((role) => {
                    const isChecked = assignedRoles.includes(role);
                    return (
                      <label
                        key={role}
                        className={`lane-option ${isChecked ? 'checked' : ''} ${role.toLowerCase()}`}
                      >
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => {}}
                          onClick={(e) => handleLaneToggle(e as any, role)}
                        />
                        <span className="lane-option-label">{role}</span>
                      </label>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>

        <p className="champion-title">{champion.title}</p>

        <div className="champion-tags">
          {champion.tags.slice(0, 2).map((tag) => (
            <span
              key={tag}
              className="champion-tag"
              style={{ backgroundColor: getTagColor(tag) }}
            >
              {tag}
            </span>
          ))}
        </div>

        <div className="champion-difficulty">
          <span className="difficulty-label">Difficulté:</span>
          <div className="difficulty-bar">
            {Array.from({ length: 10 }).map((_, i) => (
              <div
                key={i}
                className={`difficulty-segment ${
                  i < champion.info.difficulty ? 'filled' : ''
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

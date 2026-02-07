import React, { useState, useMemo } from 'react';
import type { ChampionFilters, ChampionWithState, LaneRole } from '../types/champion';
import { LANE_ROLES } from '../types/champion';
import { getAllTags, getAllPartypes, normalizePartype } from '../utils/ddragon';
import { getTagColor } from '../utils/ddragon';
import './FilterPanel.css';

interface FilterPanelProps {
  filters: ChampionFilters;
  onFiltersChange: (filters: Partial<ChampionFilters>) => void;
  onReset: () => void;
  champions: ChampionWithState[];
  filterCount: number;
}

export const FilterPanel: React.FC<FilterPanelProps> = ({
  filters,
  onFiltersChange,
  onReset,
  champions,
  filterCount,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  // Extraire toutes les options disponibles
  const availableTags = useMemo(() => getAllTags(champions), [champions]);
  const availablePartypes = useMemo(() => getAllPartypes(champions), [champions]);

  const toggleTag = (tag: string) => {
    const newTags = filters.tags.includes(tag)
      ? filters.tags.filter((t) => t !== tag)
      : [...filters.tags, tag];
    onFiltersChange({ tags: newTags });
  };

  const togglePartype = (partype: string) => {
    const newPartypes = filters.partypes.includes(partype)
      ? filters.partypes.filter((p) => p !== partype)
      : [...filters.partypes, partype];
    onFiltersChange({ partypes: newPartypes });
  };

  const toggleLaneRole = (role: LaneRole) => {
    const newRoles = filters.laneRoles.includes(role)
      ? filters.laneRoles.filter((r) => r !== role)
      : [...filters.laneRoles, role];
    onFiltersChange({ laneRoles: newRoles });
  };

  const hasActiveFilters = filterCount > 0;

  return (
    <div className={`filter-panel ${isExpanded ? 'expanded' : ''}`}>
      <div className="filter-header">
        <div className="filter-tabs">
          <button
            type="button"
            className={`filter-tab ${filters.status === 'all' ? 'active' : ''}`}
            onClick={() => onFiltersChange({ status: 'all' })}
          >
            Tous
          </button>
          <button
            type="button"
            className={`filter-tab ${filters.status === 'played' ? 'active' : ''}`}
            onClick={() => onFiltersChange({ status: 'played' })}
          >
            Joués
          </button>
          <button
            type="button"
            className={`filter-tab ${filters.status === 'unplayed' ? 'active' : ''}`}
            onClick={() => onFiltersChange({ status: 'unplayed' })}
          >
            Non joués
          </button>
        </div>

        <button
          type="button"
          className="filter-toggle"
          onClick={() => setIsExpanded(!isExpanded)}
          aria-label={isExpanded ? 'Masquer les filtres' : 'Afficher les filtres'}
          aria-expanded={isExpanded}
        >
          {hasActiveFilters && <span className="filter-badge">{filterCount}</span>}
          <svg
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
            className={`filter-toggle-icon ${isExpanded ? 'rotated' : ''}`}
          >
            <path
              d="M5 8L10 13L15 8"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </div>

      {isExpanded && (
        <div className="filter-content">
          {/* Sort */}
          <div className="filter-section">
            <h4 className="filter-section-title">Tri</h4>
            <div className="filter-options">
              <select
                value={filters.sort}
                onChange={(e) => onFiltersChange({ sort: e.target.value as ChampionFilters['sort'] })}
                className="filter-select"
              >
                <option value="name-asc">Nom A-Z</option>
                <option value="name-desc">Nom Z-A</option>
                <option value="difficulty-asc">Difficulté ↑</option>
                <option value="difficulty-desc">Difficulté ↓</option>
                <option value="unplayed-first">Non joués d'abord</option>
                <option value="last-played">Dernier joué</option>
              </select>
            </div>
          </div>

          {/* Tags (Classes) */}
          <div className="filter-section">
            <h4 className="filter-section-title">Classes</h4>
            <div className="filter-options filter-options-tags">
              {availableTags.map((tag) => (
                <button
                  key={tag}
                  type="button"
                  className={`filter-tag ${filters.tags.includes(tag) ? 'active' : ''}`}
                  onClick={() => toggleTag(tag)}
                  style={{
                    backgroundColor: filters.tags.includes(tag) ? getTagColor(tag) : undefined,
                  }}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>

          {/* Partypes */}
          <div className="filter-section">
            <h4 className="filter-section-title">Ressource</h4>
            <div className="filter-options filter-options-tags">
              {availablePartypes.map((partype) => (
                <button
                  key={partype}
                  type="button"
                  className={`filter-tag ${filters.partypes.includes(partype) ? 'active' : ''}`}
                  onClick={() => togglePartype(partype)}
                >
                  {normalizePartype(partype)}
                </button>
              ))}
            </div>
          </div>

          {/* Lane Roles */}
          <div className="filter-section">
            <h4 className="filter-section-title">Rôle Lane (Custom)</h4>
            <div className="filter-options filter-options-roles">
              {LANE_ROLES.map((role) => (
                <button
                  key={role}
                  type="button"
                  className={`filter-role ${filters.laneRoles.includes(role) ? 'active' : ''} ${role.toLowerCase()}`}
                  onClick={() => toggleLaneRole(role)}
                >
                  {role === 'UNKNOWN' ? 'Non défini' : role}
                </button>
              ))}
            </div>
          </div>

          {/* Reset */}
          {hasActiveFilters && (
            <div className="filter-actions">
              <button type="button" className="filter-reset" onClick={onReset}>
                Réinitialiser les filtres
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

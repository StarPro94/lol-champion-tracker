import React, { useState, useMemo } from 'react';
import type { ChampionWithState } from '../types/champion';
import { countByTag, countByLaneRole, countByPartype } from '../utils/filters';
import './StatsPanel.css';

interface StatsPanelProps {
  champions: ChampionWithState[];
}

export const StatsPanel: React.FC<StatsPanelProps> = ({ champions }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  // Calculer les stats
  const stats = useMemo(() => {
    const total = champions.length;
    const played = champions.filter((champion) => champion.isPlayed).length;
    const unplayed = total - played;
    const percentage = total > 0 ? Math.round((played / total) * 100) : 0;

    // Regrouper par tags
    const allTags = new Set<string>();
    champions.forEach((champion) => {
      champion.tags.forEach((tag) => allTags.add(tag));
    });

    const byTag: Record<string, { total: number; played: number }> = {};
    allTags.forEach((tag) => {
      byTag[tag] = countByTag(champions, tag);
    });

    // Regrouper par lane role
    const allLaneRoles = new Set(champions.map((c) => c.laneRole || 'UNKNOWN'));
    const byLaneRole: Record<string, { total: number; played: number }> = {};
    allLaneRoles.forEach((role) => {
      byLaneRole[role] = countByLaneRole(champions, role);
    });

    // Regrouper par partype
    const allPartypes = new Set(champions.map((c) => c.partype));
    const byPartype: Record<string, { total: number; played: number }> = {};
    allPartypes.forEach((partype) => {
      byPartype[partype] = countByPartype(champions, partype);
    });

    return {
      total,
      played,
      unplayed,
      percentage,
      byTag,
      byLaneRole,
      byPartype,
    };
  }, [champions]);

  return (
    <div className={`stats-panel ${isExpanded ? 'expanded' : ''}`}>
      <button
        type="button"
        className="stats-toggle"
        onClick={() => setIsExpanded(!isExpanded)}
        aria-expanded={isExpanded}
        aria-label={isExpanded ? 'Masquer les statistiques' : 'Afficher les statistiques'}
      >
        <div className="stats-summary">
          <span className="stats-summary-text">Statistiques détaillées</span>
          <svg
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
            className={`stats-toggle-icon ${isExpanded ? 'rotated' : ''}`}
          >
            <path
              d="M5 8L10 13L15 8"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      </button>

      {isExpanded && (
        <div className="stats-content">
          {/* Stats globales */}
          <div className="stats-section">
            <h4 className="stats-section-title">Progression globale</h4>
            <div className="stats-grid">
              <div className="stat-item">
                <span className="stat-value">{stats.played}</span>
                <span className="stat-label">Joués</span>
              </div>
              <div className="stat-item">
                <span className="stat-value">{stats.unplayed}</span>
                <span className="stat-label">Restants</span>
              </div>
              <div className="stat-item">
                <span className="stat-value">{stats.percentage}%</span>
                <span className="stat-label">Complété</span>
              </div>
            </div>
          </div>

          {/* Stats par classe */}
          <div className="stats-section">
            <h4 className="stats-section-title">Par classe</h4>
            <div className="stats-list">
              {Object.entries(stats.byTag)
                .sort(([, a], [, b]) => b.played - a.played)
                .map(([tag, data]) => (
                  <div key={tag} className="stats-list-item">
                    <span className="stats-list-label">{tag}</span>
                    <span className="stats-list-value">
                      {data.played} / {data.total}
                    </span>
                  </div>
                ))}
            </div>
          </div>

          {/* Stats par rôle lane */}
          <div className="stats-section">
            <h4 className="stats-section-title">Par rôle lane</h4>
            <div className="stats-list">
              {Object.entries(stats.byLaneRole)
                .filter(([, data]) => data.total > 0)
                .sort(([, a], [, b]) => b.played - a.played)
                .map(([role, data]) => (
                  <div key={role} className="stats-list-item">
                    <span className="stats-list-label">
                      {role === 'UNKNOWN' ? 'Non défini' : role}
                    </span>
                    <span className="stats-list-value">
                      {data.played} / {data.total}
                    </span>
                  </div>
                ))}
            </div>
          </div>

          {/* Stats par ressource */}
          <div className="stats-section">
            <h4 className="stats-section-title">Par ressource</h4>
            <div className="stats-list">
              {Object.entries(stats.byPartype)
                .filter(([, data]) => data.total > 0)
                .sort(([, a], [, b]) => b.played - a.played)
                .map(([partype, data]) => (
                  <div key={partype} className="stats-list-item">
                    <span className="stats-list-label">{partype}</span>
                    <span className="stats-list-value">
                      {data.played} / {data.total}
                    </span>
                  </div>
                ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

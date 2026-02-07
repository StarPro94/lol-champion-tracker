import { useState, useMemo } from 'react';
import type { ChampionWithState } from '../types/champion';
import './AdvancedStats.css';

type StatsTab = 'overview' | 'roles' | 'timeline' | 'heatmap';

interface AdvancedStatsProps {
  champions: ChampionWithState[];
  playHistory?: { championId: string; timestamp: number }[];
}

export const AdvancedStats: React.FC<AdvancedStatsProps> = ({
  champions,
  playHistory = [],
}) => {
  const [activeTab, setActiveTab] = useState<StatsTab>('overview');
  const [tooltip, setTooltip] = useState<{ x: number; y: number; content: string } | null>(null);

  const playedChampions = champions.filter(c => c.isPlayed);
  const unplayedChampions = champions.filter(c => !c.isPlayed);
  const playCount = playedChampions.length;
  const playPercentage = champions.length > 0 ? (playCount / champions.length) * 100 : 0;

  // Calculate role distribution
  const roleDistribution = useMemo(() => {
    const roles: Record<string, { played: number; total: number }> = {
      'TOP': { played: 0, total: 0 },
      'JUNGLE': { played: 0, total: 0 },
      'MID': { played: 0, total: 0 },
      'BOT': { played: 0, total: 0 },
      'SUPPORT': { played: 0, total: 0 },
      'FLEX': { played: 0, total: 0 },
    };

    champions.forEach((champion) => {
      const champRoles = champion.laneRoles || [];
      champRoles.forEach((role) => {
        if (roles[role]) {
          roles[role].total++;
          if (champion.isPlayed) {
            roles[role].played++;
          }
        }
      });
    });

    return roles;
  }, [champions]);

  // Generate timeline data
  const timelineData = useMemo(() => {
    const now = Date.now();
    const dayInMs = 24 * 60 * 60 * 1000;

    // Get plays grouped by day
    const playsByDay: Record<number, number> = {};
    playHistory.forEach(({ timestamp }) => {
      const dayKey = Math.floor(timestamp / dayInMs);
      playsByDay[dayKey] = (playsByDay[dayKey] || 0) + 1;
    });

    // Generate last 30 days of data
    const data = [];
    for (let i = 29; i >= 0; i--) {
      const dayKey = Math.floor((now - i * dayInMs) / dayInMs);
      const date = new Date(dayKey * dayInMs);
      data.push({
        date: date.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit' }),
        count: playsByDay[dayKey] || 0,
        total: playHistory.filter(h => h.timestamp < (dayKey + 1) * dayInMs).length,
      });
    }

    return data;
  }, [playHistory]);

  // Calculate completion prediction
  const predictionDays = useMemo(() => {
    if (playHistory.length < 2) return null;

    const recentPlays = playHistory.slice(-20);
    const timeSpan = recentPlays[recentPlays.length - 1].timestamp - recentPlays[0].timestamp;
    const playsPerDay = timeSpan > 0 ? (recentPlays.length / (timeSpan / (24 * 60 * 60 * 1000))) : 0;

    if (playsPerDay <= 0) return null;

    const remaining = unplayedChampions.length;
    const daysToComplete = Math.ceil(remaining / playsPerDay);

    return {
      daysToComplete,
      completionDate: new Date(Date.now() + daysToComplete * 24 * 60 * 60 * 1000),
      playsPerDay: playsPerDay.toFixed(1),
    };
  }, [playHistory, unplayedChampions.length]);

  // Calculate heatmap data (plays by champion index)
  const heatmapData = useMemo(() => {
    return champions.map((champion, index) => ({
      champion,
      index,
      isPlayed: champion.isPlayed,
      // Calculate "heat" based on how recently it was played
      heat: playHistory.find(h => h.championId === champion.id)?.timestamp || 0,
    }));
  }, [champions, playHistory]);

  // Generate chart SVG path
  const chartPath = useMemo(() => {
    if (timelineData.length === 0) return '';

    const width = 100;
    const height = 100;
    const padding = 5;

    const maxTotal = Math.max(...timelineData.map(d => d.total), 1);
    const points = timelineData.map((d, i) => {
      const x = padding + (i / (timelineData.length - 1)) * (width - 2 * padding);
      const y = height - padding - (d.total / maxTotal) * (height - 2 * padding);
      return `${x},${y}`;
    });

    return `M ${points.join(' L ')}`;
  }, [timelineData]);

  const renderOverview = () => (
    <>
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-card-value">{playCount}</div>
          <div className="stat-card-label">Champions Joués</div>
          <div className="stat-card-change positive">
            {playPercentage.toFixed(1)}% complété
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-card-value">{unplayedChampions.length}</div>
          <div className="stat-card-label">Restants</div>
        </div>
        <div className="stat-card">
          <div className="stat-card-value">{playHistory.length}</div>
          <div className="stat-card-label">Interactions Totales</div>
        </div>
        <div className="stat-card">
          <div className="stat-card-value">{playedChampions.length > 0 ? '🎮' : '🌱'}</div>
          <div className="stat-card-label">Statut</div>
        </div>
      </div>

      {predictionDays && (
        <div className="prediction-card">
          <div className="prediction-title">Prédiction de Complétion</div>
          <div className="prediction-value">{predictionDays.daysToComplete} jours</div>
          <div className="prediction-subtitle">
            Au rythme actuel de {predictionDays.playsPerDay} champions/jour
          </div>
          <div className="prediction-subtitle">
            Vers le {predictionDays.completionDate.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}
          </div>
        </div>
      )}

      <div className="progress-chart">
        <div className="progress-chart-title">Progression Totale</div>
        <svg className="progress-chart-svg" viewBox="0 0 100 100" preserveAspectRatio="none">
          <defs>
            <linearGradient id="progressGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="var(--color-accent-blue)" stopOpacity="0.5" />
              <stop offset="100%" stopColor="var(--color-accent-blue)" stopOpacity="0" />
            </linearGradient>
          </defs>
          <path className="progress-chart-area" d={`${chartPath} L 100,100 L 0,100 Z`} />
          <path className="progress-chart-line" d={chartPath} />
          {timelineData.map((d, i) => {
            const x = 5 + (i / (timelineData.length - 1)) * 90;
            const maxTotal = Math.max(...timelineData.map(d => d.total), 1);
            const y = 95 - (d.total / maxTotal) * 90;
            return (
              <circle
                key={i}
                className="progress-chart-dot"
                cx={x}
                cy={y}
                onMouseEnter={(e) => setTooltip({
                  x: e.clientX,
                  y: e.clientY,
                  content: `${d.date}: ${d.total} champions`,
                })}
                onMouseLeave={() => setTooltip(null)}
              />
            );
          })}
        </svg>
        {tooltip && (
          <div
            className="progress-chart-tooltip visible"
            style={{ left: tooltip.x + 10, top: tooltip.y - 30 }}
          >
            {tooltip.content}
          </div>
        )}
      </div>
    </>
  );

  const renderRoles = () => (
    <div className="role-distribution">
      {Object.entries(roleDistribution).map(([role, data]) => {
        const percentage = data.total > 0 ? (data.played / data.total) * 100 : 0;
        return (
          <div key={role} className={`role-distribution-item role-${role.toLowerCase()}`}>
            <div className="role-distribution-label">{role}</div>
            <div className="role-distribution-bar">
              <div className="role-distribution-fill" style={{ width: `${percentage}%` }} />
            </div>
            <div className="role-distribution-value">{data.played}/{data.total}</div>
          </div>
        );
      })}
    </div>
  );

  const renderTimeline = () => (
    <div className="timeline">
      {playHistory.slice(-10).reverse().map((item, index) => {
        const champion = champions.find(c => c.id === item.championId);
        if (!champion) return null;
        const isMilestone = (playHistory.length - index) % 10 === 0;
        return (
          <div key={index} className={`timeline-item ${isMilestone ? 'milestone' : ''}`}>
            <div className="timeline-item-icon">
              {isMilestone ? '🏆' : '✓'}
            </div>
            <div className="timeline-item-content">
              <div className="timeline-item-title">{champion.name}</div>
              <div className="timeline-item-time">
                {new Date(item.timestamp).toLocaleString('fr-FR')}
              </div>
            </div>
          </div>
        );
      })}
      {playHistory.length === 0 && (
        <div style={{ textAlign: 'center', color: 'var(--color-text-muted)', padding: '2rem' }}>
          Aucune activité récente
        </div>
      )}
    </div>
  );

  const renderHeatmap = () => (
    <div className="champion-heatmap">
      {heatmapData.map((item) => {
        const now = Date.now();
        const daysSincePlay = item.heat > 0 ? (now - item.heat) / (24 * 60 * 60 * 1000) : Infinity;
        let heatClass = 'unplayed';
        if (item.isPlayed) {
          if (daysSincePlay < 7) heatClass = 'hot';
          else if (daysSincePlay < 30) heatClass = 'warm';
          else heatClass = 'cold';
        }

        return (
          <div
            key={item.index}
            className={`heatmap-cell ${heatClass}`}
            onMouseEnter={(e) => setTooltip({
              x: e.clientX,
              y: e.clientY,
              content: `${item.champion.name}${item.isPlayed ? ` (joué il y a ${Math.floor(daysSincePlay)} jours)` : ''}`,
            })}
            onMouseLeave={() => setTooltip(null)}
          >
            <div className="heatmap-cell-tooltip">
              {item.champion.name}
            </div>
          </div>
        );
      })}
    </div>
  );

  return (
    <div className="advanced-stats">
      <div className="advanced-stats-header">
        <h2 className="advanced-stats-title">📊 Statistiques Avancées</h2>
        <div className="advanced-stats-tabs">
          <button
            className={`stats-tab ${activeTab === 'overview' ? 'active' : ''}`}
            onClick={() => setActiveTab('overview')}
          >
            Vue d'ensemble
          </button>
          <button
            className={`stats-tab ${activeTab === 'roles' ? 'active' : ''}`}
            onClick={() => setActiveTab('roles')}
          >
            Rôles
          </button>
          <button
            className={`stats-tab ${activeTab === 'timeline' ? 'active' : ''}`}
            onClick={() => setActiveTab('timeline')}
          >
            Historique
          </button>
          <button
            className={`stats-tab ${activeTab === 'heatmap' ? 'active' : ''}`}
            onClick={() => setActiveTab('heatmap')}
          >
            Carte
          </button>
        </div>
      </div>

      {activeTab === 'overview' && renderOverview()}
      {activeTab === 'roles' && renderRoles()}
      {activeTab === 'timeline' && renderTimeline()}
      {activeTab === 'heatmap' && renderHeatmap()}
    </div>
  );
};

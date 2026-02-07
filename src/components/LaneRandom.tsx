import { useState, useEffect, useCallback } from 'react';
import type { ChampionWithState, LaneRole } from '../types/champion';
import { LANE_ROLES } from '../types/champion';
import './LaneRandom.css';

interface LaneRandomProps {
  champions: ChampionWithState[];
  onClose: () => void;
  onSelectChampion: (championId: string) => void;
}

type Stage = 'role' | 'roulette' | 'result';

export const LaneRandom: React.FC<LaneRandomProps> = ({
  champions,
  onClose,
  onSelectChampion,
}) => {
  const [stage, setStage] = useState<Stage>('role');
  const [selectedRole, setSelectedRole] = useState<LaneRole | 'random' | null>(null);
  const [isSpinning, setIsSpinning] = useState(false);
  const [selectedChampion, setSelectedChampion] = useState<ChampionWithState | null>(null);

  // Get unplayed champions for a role
  const getChampionsForRole = useCallback((role: LaneRole): ChampionWithState[] => {
    return champions.filter(c =>
      !c.isPlayed && (c.laneRoles?.includes(role) ?? false)
    );
  }, [champions]);

  // Get all unplayed champions (for random role)
  const allUnplayed = champions.filter(c => !c.isPlayed);

  // Weighted random - champions with more total champions in their roles have less chance
  const weightedRandom = useCallback((pool: ChampionWithState[]): ChampionWithState => {
    if (pool.length === 0) {
      // Fallback to any unplayed champion
      return allUnplayed[Math.floor(Math.random() * allUnplayed.length)];
    }

    // Create weights based on how "rare" they are
    // Champions that appear in fewer role filters get higher weight
    const weights = pool.map((champion) => {
      const roleCount = champion.laneRoles?.length || 1;
      // Base weight + bonus for being in fewer roles
      return 1 + (6 - roleCount) * 0.5;
    });

    const totalWeight = weights.reduce((sum, w) => sum + w, 0);
    let random = Math.random() * totalWeight;

    for (let i = 0; i < pool.length; i++) {
      random -= weights[i];
      if (random <= 0) {
        return pool[i];
      }
    }

    return pool[pool.length - 1];
  }, [allUnplayed]);

  const handleRoleSelect = (role: LaneRole | 'random') => {
    setSelectedRole(role);
    setStage('roulette');

    // Determine champion pool
    let pool: ChampionWithState[];
    if (role === 'random') {
      pool = allUnplayed;
    } else {
      pool = getChampionsForRole(role);
    }

    // If no champions for this role, fallback to all unplayed
    if (pool.length === 0) {
      pool = allUnplayed;
    }

    // Start spinning animation
    setIsSpinning(true);

    // Select champion after animation
    setTimeout(() => {
      const champion = weightedRandom(pool);
      setSelectedChampion(champion);
      setIsSpinning(false);

      // Move to result stage after a short delay
      setTimeout(() => {
        setStage('result');
      }, 500);
    }, 3000);
  };

  const handlePlayChampion = () => {
    if (selectedChampion) {
      onSelectChampion(selectedChampion.id);
    }
  };

  const handleReroll = () => {
    setStage('role');
    setSelectedRole(null);
    setSelectedChampion(null);
  };

  const getRoleIcon = (role: LaneRole | 'random'): string => {
    const icons: Record<string, string> = {
      'TOP': '⬆️',
      'JUNGLE': '🌴',
      'MID': '↔️',
      'BOT': '➡️',
      'SUPPORT': '🛡️',
      'FLEX': '🔄',
      'UNKNOWN': '❓',
      'random': '🎲',
    };
    return icons[role] || '❓';
  };

  const getRoleColor = (role: LaneRole | 'random'): string => {
    const colors: Record<string, string> = {
      'TOP': '#ff6b6b',
      'JUNGLE': '#51cf66',
      'MID': '#339af0',
      'BOT': '#ffd43b',
      'SUPPORT': '#cc5de8',
      'FLEX': '#868e96',
      'UNKNOWN': '#6b7280',
      'random': '#A855F7',
    };
    return colors[role] || '#fff';
  };

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  return (
    <div className="lane-random-overlay" onClick={onClose}>
      <div className="lane-random-content" onClick={(e) => e.stopPropagation()}>
        <button className="lane-random-close" onClick={onClose} aria-label="Fermer">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M5 5L15 15M5 15L15 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        </button>

        <h1 className="lane-random-title">Lane Random</h1>
        <p className="lane-random-subtitle">Choisissez un rôle pour randomiser votre champion</p>

        {stage === 'role' && (
          <div className="role-selection-stage">
            <p className="role-selection-title">Sélectionnez un rôle</p>
            <div className="role-buttons">
              {LANE_ROLES.map((role) => (
                <button
                  key={role}
                  className="role-button role-button-${role.toLowerCase()}"
                  onClick={() => handleRoleSelect(role)}
                >
                  <span className="role-button-icon">{getRoleIcon(role)}</span>
                  <span className="role-button-label">{role}</span>
                </button>
              ))}
              <button
                className="role-button role-button-random"
                onClick={() => handleRoleSelect('random')}
              >
                <span className="role-button-icon">🎲</span>
                <span className="role-button-label">Random</span>
              </button>
            </div>
            <p className="weighted-hint">Les champions moins joués ont plus de chances !</p>
          </div>
        )}

        {stage === 'roulette' && (
          <div className="roulette-stage">
            <div className="roulette-container">
              <div className="roulette-pointer" />
              <div
                className={`roulette-wheel ${isSpinning ? 'spinning' : ''}`}
                style={{
                  '--spin-degrees': `${1800 + Math.random() * 360}deg`,
                } as React.CSSProperties}
              >
                <div className="roulette-center">?</div>
              </div>
            </div>
            <div className="roulette-champion-display">
              {isSpinning ? (
                <>
                  <p className="roulette-champion-name">Spinning...</p>
                  <p className="roulette-champion-title">Your fate is being decided</p>
                </>
              ) : selectedChampion ? (
                <>
                  <img
                    src={selectedChampion.imageUrl}
                    alt={selectedChampion.name}
                    className="roulette-champion-image"
                  />
                  <h2 className="roulette-champion-name">{selectedChampion.name}</h2>
                  <p className="roulette-champion-title">{selectedChampion.title}</p>
                </>
              ) : null}
            </div>
          </div>
        )}

        {stage === 'result' && selectedChampion && (
          <div className="result-stage">
            <div className="result-champion-card">
              <img
                src={selectedChampion.imageUrl}
                alt={selectedChampion.name}
                className="result-champion-image"
              />
              <h2 className="roulette-champion-name">{selectedChampion.name}</h2>
              <p className="roulette-champion-title">{selectedChampion.title}</p>
              {selectedRole && selectedRole !== 'random' && (
                <span className="result-role-badge" style={{ borderColor: getRoleColor(selectedRole) }}>
                  {getRoleIcon(selectedRole)} {selectedRole}
                </span>
              )}
              <div className="result-actions">
                <button className="result-button result-button-play" onClick={handlePlayChampion}>
                  ✓ Jouer
                </button>
                <button className="result-button result-button-reroll" onClick={handleReroll}>
                  🔄 Reroll
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

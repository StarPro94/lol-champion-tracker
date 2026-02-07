import { useState, useEffect, useCallback } from 'react';
import './XPBar.css';

interface Level {
  level: number;
  name: string;
  color: string;
  emoji: string;
  requiredXP: number;
}

const LEVELS: Level[] = [
  { level: 1, name: 'Unranked', color: '#8a8a8a', emoji: '🌱', requiredXP: 0 },
  { level: 2, name: 'Iron', color: '#7a7a7a', emoji: '⚙️', requiredXP: 5 },
  { level: 3, name: 'Bronze', color: '#cd7f32', emoji: '🥉', requiredXP: 15 },
  { level: 4, name: 'Silver', color: '#c0c0c0', emoji: '🥈', requiredXP: 30 },
  { level: 5, name: 'Gold', color: '#ffd700', emoji: '🥇', requiredXP: 50 },
  { level: 6, name: 'Platinum', color: '#00d4ff', emoji: '💎', requiredXP: 75 },
  { level: 7, name: 'Diamond', color: '#b9f2ff', emoji: '💠', requiredXP: 100 },
  { level: 8, name: 'Master', color: '#c4976a', emoji: '👑', requiredXP: 133 },
  { level: 9, name: 'Grandmaster', color: '#ff3366', emoji: '🔥', requiredXP: 167 },
  { level: 10, name: 'Challenger', color: '#ffcc00', emoji: '⚡', requiredXP: 999 },
];

const getXPForChampion = (count: number) => {
  // More XP for first champions, less for later
  if (count <= 10) return 3;
  if (count <= 50) return 2;
  return 1;
};

export const useXP = () => {
  const [totalXP, setTotalXP] = useState(() => {
    const saved = localStorage.getItem('totalXP');
    return saved ? parseInt(saved, 10) : 0;
  });

  const [showLevelUp, setShowLevelUp] = useState(false);

  useEffect(() => {
    localStorage.setItem('totalXP', String(totalXP));
  }, [totalXP]);

  const getCurrentLevel = useCallback((): Level => {
    for (let i = LEVELS.length - 1; i >= 0; i--) {
      if (totalXP >= LEVELS[i].requiredXP) {
        return LEVELS[i];
      }
    }
    return LEVELS[0];
  }, [totalXP]);

  const getNextLevel = useCallback((): Level | null => {
    const current = getCurrentLevel();
    const currentIndex = LEVELS.findIndex(l => l.level === current.level);
    if (currentIndex < LEVELS.length - 1) {
      return LEVELS[currentIndex + 1];
    }
    return null;
  }, [getCurrentLevel]);

  const addXP = useCallback((amount: number) => {
    const oldLevel = getCurrentLevel();
    setTotalXP((prev: number) => prev + amount);
    // Check for level up after state update
    setTimeout(() => {
      const newLevel = getCurrentLevel();
      if (newLevel.level > oldLevel.level) {
        setShowLevelUp(true);
        setTimeout(() => setShowLevelUp(false), 3000);
      }
    }, 0);
  }, [getCurrentLevel]);

  const currentLevel = getCurrentLevel();
  const nextLevel = getNextLevel();

  const progress = nextLevel
    ? ((totalXP - currentLevel.requiredXP) / (nextLevel.requiredXP - currentLevel.requiredXP)) * 100
    : 100;

  return {
    totalXP,
    currentLevel,
    nextLevel,
    progress,
    addXP,
    getXpForChampion: getXPForChampion,
    showLevelUp,
    dismissLevelUp: () => setShowLevelUp(false),
  };
};

interface XPBarProps {
  totalXP: number;
  currentLevel: Level;
  nextLevel: Level | null;
  progress: number;
}

export const XPBar: React.FC<XPBarProps> = ({ totalXP, currentLevel, nextLevel, progress }) => {
  return (
    <div className="xp-bar-container">
      <div className="xp-bar-header">
        <div className="xp-level-info">
          <span className="xp-level-emoji">{currentLevel.emoji}</span>
          <span className="xp-level-name" style={{ color: currentLevel.color }}>
            {currentLevel.name}
          </span>
          <span className="xp-level-number">Lvl {currentLevel.level}</span>
        </div>
        <div className="xp-total">{totalXP} XP</div>
      </div>
      <div className="xp-bar-track">
        <div
          className="xp-bar-fill"
          style={{
            width: `${progress}%`,
            background: `linear-gradient(90deg, ${currentLevel.color}, ${nextLevel?.color || currentLevel.color})`,
          }}
        />
      </div>
      {nextLevel && (
        <div className="xp-bar-footer">
          <span className="xp-progress-text">{progress.toFixed(0)}%</span>
          <span className="xp-next-level">
            {nextLevel.requiredXP - totalXP} XP vers {nextLevel.name}
          </span>
        </div>
      )}
    </div>
  );
};

interface LevelUpNotificationProps {
  level: Level;
  onDismiss: () => void;
}

export const LevelUpNotification: React.FC<LevelUpNotificationProps> = ({ level, onDismiss }) => {
  useEffect(() => {
    const timer = setTimeout(onDismiss, 3000);
    return () => clearTimeout(timer);
  }, [onDismiss]);

  return (
    <div className="levelup-notification" onClick={onDismiss}>
      <div className="levelup-content">
        <div className="levelup-particles">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="levelup-particle"
              style={{
                '--angle': `${i * 18}deg`,
                '--color': level.color,
                '--delay': `${i * 30}ms`,
              } as React.CSSProperties}
            />
          ))}
        </div>
        <div className="levelup-emoji">{level.emoji}</div>
        <h2 className="levelup-title">LEVEL UP!</h2>
        <p className="levelup-subtitle" style={{ color: level.color }}>
          {level.name} - Level {level.level}
        </p>
      </div>
    </div>
  );
};

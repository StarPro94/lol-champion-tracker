import React, { useEffect } from 'react';
import type { Milestone } from '../hooks/useMilestone';
import './MilestoneCelebration.css';

interface MilestoneCelebrationProps {
  milestone: Milestone;
  onClose: () => void;
}

export const MilestoneCelebration: React.FC<MilestoneCelebrationProps> = ({
  milestone,
  onClose,
}) => {
  // Handle click outside and escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [onClose]);

  const typeColors: Record<Milestone['type'], string> = {
    bronze: '#cd7f32',
    silver: '#c0c0c0',
    gold: '#C89B3C',
    diamond: '#b9f2ff',
    master: '#c4976a',
  };

  const typeGradients: Record<Milestone['type'], string> = {
    bronze: 'linear-gradient(135deg, #cd7f32, #8b5a2b)',
    silver: 'linear-gradient(135deg, #c0c0c0, #a0a0a0)',
    gold: 'linear-gradient(135deg, #C89B3C, #ffd700)',
    diamond: 'linear-gradient(135deg, #b9f2ff, #00d4ff)',
    master: 'linear-gradient(135deg, #c4976a, #ff6b35)',
  };

  return (
    <div className="milestone-overlay" onClick={onClose}>
      <div
        className="milestone-content"
        onClick={(e) => e.stopPropagation()}
        style={{
          '--milestone-color': typeColors[milestone.type],
          '--milestone-gradient': typeGradients[milestone.type],
        } as React.CSSProperties}
      >
        <div className="milestone-emoji">{milestone.emoji}</div>
        <div className="milestone-icon-wrapper">
          <svg
            className="milestone-trophy"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M12 2L15 8H9L12 2Z"
              fill="url(#trophyGradient)"
              stroke="currentColor"
              strokeWidth="1"
            />
            <path
              d="M5 8C5 6.34315 6.34315 5 8 5H16C17.6569 5 19 6.34315 19 8V10C19 12.2091 17.2091 14 15 14H9C6.79086 14 5 12.2091 5 10V8Z"
              fill="url(#trophyGradient)"
              stroke="currentColor"
              strokeWidth="1"
            />
            <path
              d="M8 14V16C8 17.1046 8.89543 18 10 18H14C15.1046 18 16 17.1046 16 16V14"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
            <path
              d="M12 18V22M9 22H15"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
            <circle cx="7" cy="8" r="1.5" fill="var(--milestone-color)" />
            <circle cx="17" cy="8" r="1.5" fill="var(--milestone-color)" />
            <defs>
              <linearGradient
                id="trophyGradient"
                x1="5"
                y1="5"
                x2="19"
                y2="14"
                gradientUnits="userSpaceOnUse"
              >
                <stop stopColor={typeColors[milestone.type]} />
                <stop offset="1" stopColor="#ffffff" stopOpacity="0.5" />
              </linearGradient>
            </defs>
          </svg>
        </div>
        <h2 className="milestone-title">Milestone Atteint !</h2>
        <p className="milestone-message">{milestone.message}</p>
        <div className="milestone-type-badge">{milestone.type.toUpperCase()}</div>
        <button className="milestone-btn" onClick={onClose}>
          Continue 🚀
        </button>
      </div>
    </div>
  );
};

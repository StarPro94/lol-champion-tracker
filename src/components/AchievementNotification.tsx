import { useEffect, useState } from 'react';
import type { Achievement } from '../hooks/useAchievements';
import './AchievementNotification.css';

interface AchievementNotificationProps {
  achievement: Achievement;
  onDismiss: () => void;
}

export const AchievementNotification: React.FC<AchievementNotificationProps> = ({
  achievement,
  onDismiss,
}) => {
  const [hiding, setHiding] = useState(false);
  const [showConfetti, setShowConfetti] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setHiding(true);
    }, 3500);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => setShowConfetti(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  const handleClick = () => {
    setHiding(true);
    setTimeout(onDismiss, 300);
  };

  // Generate confetti particles
  const confetti = Array.from({ length: 20 }, (_, i) => ({
    id: i,
    left: Math.random() * 100,
    delay: Math.random() * 0.3,
    color: ['#ffd700', '#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4'][Math.floor(Math.random() * 5)],
  }));

  return (
    <div className={`achievement-notification ${hiding ? 'hiding' : ''}`} onClick={handleClick}>
      <div className={`achievement-content ${achievement.rarity}`}>
        {showConfetti && (
          <div className="achievement-confetti">
            {confetti.map((c) => (
              <span
                key={c.id}
                style={{
                  left: `${c.left}%`,
                  animationDelay: `${c.delay}s`,
                  background: c.color,
                }}
              />
            ))}
          </div>
        )}
        <button className="achievement-close" onClick={(e) => { e.stopPropagation(); handleClick(); }}>
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M1 1L13 13M1 13L13 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        </button>
        <div className="achievement-header">
          <div className="achievement-icon">{achievement.icon}</div>
          <div className="achievement-text">
            <h3 className="achievement-title">Achievement Unlocked!</h3>
            <span className={`achievement-rarity ${achievement.rarity}`}>{achievement.rarity}</span>
          </div>
        </div>
        <p className="achievement-description">
          <strong>{achievement.name}</strong>: {achievement.description}
        </p>
      </div>
    </div>
  );
};

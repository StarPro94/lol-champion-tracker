import React from 'react';
import './StreakCounter.css';

interface StreakCounterProps {
  count: number;
}

export const StreakCounter: React.FC<StreakCounterProps> = ({ count }) => {
  if (count < 3) return null;

  const fireCount = Math.min(Math.floor(count / 5), 5); // Max 5 fires
  const fires = '🔥'.repeat(fireCount);

  // Determine intensity based on streak
  const getIntensity = () => {
    if (count >= 20) return 'intense';
    if (count >= 10) return 'hot';
    if (count >= 5) return 'warm';
    return 'mild';
  };

  const intensity = getIntensity();

  return (
    <div className={`streak-counter streak-${intensity}`}>
      <span className="streak-fires">{fires}</span>
      <span className="streak-count">{count}x Streak!</span>
    </div>
  );
};

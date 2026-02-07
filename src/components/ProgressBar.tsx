import React from 'react';
import './ProgressBar.css';

interface ProgressBarProps {
  played: number;
  total: number;
  showLabel?: boolean;
  size?: 'small' | 'medium' | 'large';
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  played,
  total,
  showLabel = true,
  size = 'medium',
}) => {
  const percentage = total > 0 ? Math.round((played / total) * 100) : 0;

  return (
    <div className={`progress-container progress-${size}`}>
      {showLabel && (
        <div className="progress-label">
          <span className="progress-text">
            {played} / {total}
          </span>
          <span className="progress-percentage">{percentage}%</span>
        </div>
      )}
      <div className="progress-bar-bg">
        <div
          className="progress-bar-fill"
          style={{ width: `${percentage}%` }}
          role="progressbar"
          aria-valuenow={played}
          aria-valuemin={0}
          aria-valuemax={total}
          aria-label={`${played} champions joués sur ${total}`}
        />
      </div>
    </div>
  );
};

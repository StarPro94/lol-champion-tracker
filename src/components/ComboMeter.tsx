import { useEffect } from 'react';
import { ComboState } from '../hooks/useCombo';
import './ComboMeter.css';

interface ComboMeterProps {
  combo: ComboState;
}

export const ComboMeter: React.FC<ComboMeterProps> = ({ combo }) => {
  const { count, multiplier, isJuggernaut, timeLeft } = combo;
  const isVisible = count > 0;

  // Timer animation
  useEffect(() => {
    if (!isVisible) return;
  }, [isVisible]);

  const timerPercent = timeLeft > 0 ? (timeLeft / 2000) * 100 : 0;
  const juggernautPercent = timeLeft > 0 ? (timeLeft / 5000) * 100 : 0;

  if (!isVisible) return null;

  return (
    <div className={`combo-meter ${isJuggernaut ? 'juggernaut' : ''}`}>
      <div className="combo-content">
        {isJuggernaut && (
          <div className="combo-xp-boost">+50% XP</div>
        )}
        <div className="combo-number">{count}</div>
        <div className="combo-label">Combo</div>
        <div className="combo-multiplier">x{multiplier}</div>
        <div className="combo-timer-bar">
          <div
            className="combo-timer-fill"
            style={{ width: `${isJuggernaut ? juggernautPercent : timerPercent}%` }}
          />
        </div>
        {isJuggernaut && (
          <div className="combo-break-bar" style={{ width: `${juggernautPercent}%` }} />
        )}
      </div>
    </div>
  );
};

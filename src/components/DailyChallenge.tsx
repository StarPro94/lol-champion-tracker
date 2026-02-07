import { useMemo } from 'react';
import type { ChampionWithState } from '../types/champion';
import './DailyChallenge.css';

interface DailyChallengeProps {
  champions: ChampionWithState[];
  onToggle: (championId: string) => void;
}

export const DailyChallenge: React.FC<DailyChallengeProps> = ({ champions, onToggle }) => {
  // Seed based on current date (changes daily)
  const today = new Date();
  const seed = `${today.getFullYear()}-${today.getMonth()}-${today.getDate()}`;

  // Seeded random number generator
  const seededRandom = useMemo(() => {
    let seedValue = 0;
    for (let i = 0; i < seed.length; i++) {
      seedValue = (seedValue + seed.charCodeAt(i)) | 0;
    }
    return () => {
      seedValue = (seedValue * 9301 + 49297) % 233280;
      return seedValue / 233280;
    };
  }, [seed]);

  // Generate 3 random challenges for the day
  const challenges = useMemo(() => {
    const unplayed = champions.filter(c => !c.isPlayed);
    const shuffled = [...unplayed].sort(() => seededRandom() - 0.5);
    return shuffled.slice(0, 3);
  }, [champions, seededRandom]);

  const completedCount = challenges.filter(c => c.isPlayed).length;
  const isComplete = completedCount === challenges.length;

  return (
    <div className="daily-challenge">
      <div className="daily-header">
        <span className="daily-emoji">🎯</span>
        <h3 className="daily-title">Défi du Jour</h3>
        <span className="daily-progress">{completedCount}/{challenges.length}</span>
      </div>
      <div className="daily-champions">
        {challenges.map((champion, index) => (
          <div
            key={champion.id}
            className={`daily-champion-card ${champion.isPlayed ? 'completed' : ''}`}
            onClick={() => !champion.isPlayed && onToggle(champion.id)}
          >
            <div className="daily-champion-number">{index + 1}</div>
            <img
              src={champion.imageUrl}
              alt={champion.name}
              className="daily-champion-image"
            />
            <div className="daily-champion-name">{champion.name}</div>
            {champion.isPlayed && (
              <div className="daily-checkmark">✓</div>
            )}
          </div>
        ))}
      </div>
      {isComplete && (
        <div className="daily-complete">
          <span className="daily-complete-emoji">🏆</span>
          <span>Défi complété !</span>
        </div>
      )}
    </div>
  );
};

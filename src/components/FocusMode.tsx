import React, { useState, useEffect, useCallback } from 'react';
import type { ChampionWithState } from '../types/champion';
import './FocusMode.css';

interface FocusModeProps {
  champions: ChampionWithState[];
  onToggle: (championId: string) => void;
  onClose: () => void;
  startingIndex?: number;
}

export const FocusMode: React.FC<FocusModeProps> = ({
  champions,
  onToggle,
  onClose,
  startingIndex = 0,
}) => {
  // Filter to only unplayed champions
  const unplayedChampions = champions.filter(c => !c.isPlayed);

  // Find starting position or start at 0
  const [currentIndex, setCurrentIndex] = useState(() => {
    if (unplayedChampions.length === 0) return 0;
    const startPos = startingIndex >= 0 && startingIndex < unplayedChampions.length ? startingIndex : 0;
    return startPos;
  });

  const [startTime] = useState(Date.now());
  const [completedCount, setCompletedCount] = useState(0);

  const currentChampion = unplayedChampions[currentIndex];
  const remaining = unplayedChampions.length - completedCount;

  // Calculate speed (champions per minute)
  const speed = completedCount > 0
    ? ((completedCount / ((Date.now() - startTime) / 1000)) * 60).toFixed(1)
    : '0.0';

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowRight':
        case 'ArrowDown':
          e.preventDefault();
          setCurrentIndex((i) => (i + 1) % unplayedChampions.length);
          break;
        case 'ArrowLeft':
        case 'ArrowUp':
          e.preventDefault();
          setCurrentIndex((i) => (i - 1 + unplayedChampions.length) % unplayedChampions.length);
          break;
        case ' ':
        case 'Enter':
          e.preventDefault();
          if (currentChampion && !currentChampion.isPlayed) {
            handleToggle();
          }
          break;
        case 'Escape':
          e.preventDefault();
          onClose();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [unplayedChampions.length, currentChampion]);

  const handleToggle = useCallback(() => {
    if (!currentChampion) return;

    onToggle(currentChampion.id);
    setCompletedCount(c => c + 1);

    // Auto-advance to next unplayed champion after a short delay
    setTimeout(() => {
      setCurrentIndex((i) => {
        const nextIndex = (i + 1) % unplayedChampions.length;
        // Skip already played champions
        let attempts = 0;
        let checkIndex = nextIndex;
        while (attempts < unplayedChampions.length) {
          if (!unplayedChampions[checkIndex].isPlayed) {
            return checkIndex;
          }
          checkIndex = (checkIndex + 1) % unplayedChampions.length;
          attempts++;
        }
        return 0;
      });
    }, 200);
  }, [currentChampion, onToggle, unplayedChampions]);

  if (!currentChampion) {
    return (
      <div className="focus-mode-overlay" onClick={onClose}>
        <div className="focus-mode-content" onClick={(e) => e.stopPropagation()}>
          <h2>🎉 Tous les champions joués !</h2>
          <p>Vous avez complété tous les champions !</p>
          <button className="focus-close-btn" onClick={onClose}>Fermer</button>
        </div>
      </div>
    );
  }

  return (
    <div className="focus-mode-overlay" onClick={onClose}>
      <div className="focus-mode-content" onClick={(e) => e.stopPropagation()}>
        <button className="focus-close-btn" onClick={onClose} aria-label="Fermer">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        </button>

        <div className="focus-header">
          <div className="focus-stats">
            <div className="focus-stat">
              <span className="focus-stat-value">{remaining}</span>
              <span className="focus-stat-label">Restants</span>
            </div>
            <div className="focus-stat">
              <span className="focus-stat-value">{completedCount}</span>
              <span className="focus-stat-label">Complétés</span>
            </div>
            <div className="focus-stat">
              <span className="focus-stat-value">{speed}</span>
              <span className="focus-stat-label">/min</span>
            </div>
          </div>
        </div>

        <div className="focus-champion-container">
          <button
            className="focus-nav-btn focus-prev"
            onClick={() => setCurrentIndex((i) => (i - 1 + unplayedChampions.length) % unplayedChampions.length)}
            aria-label="Précédent"
          >
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
              <path d="M15 18l-6-6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>

          <div className="focus-champion-card" onClick={handleToggle}>
            <img
              src={currentChampion.imageUrl}
              alt={currentChampion.name}
              className="focus-champion-image"
            />
            <div className="focus-champion-info">
              <h2 className="focus-champion-name">{currentChampion.name}</h2>
              <p className="focus-champion-title">{currentChampion.title}</p>
              <div className="focus-champion-tags">
                {currentChampion.tags.map((tag: string) => (
                  <span key={tag} className="focus-tag">{tag}</span>
                ))}
              </div>
              <div className="focus-hint">
                Appuyez sur <kbd>Espace</kbd> ou cliquez pour marquer comme joué
              </div>
            </div>
          </div>

          <button
            className="focus-nav-btn focus-next"
            onClick={() => setCurrentIndex((i) => (i + 1) % unplayedChampions.length)}
            aria-label="Suivant"
          >
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
              <path d="M9 18l6-6-6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>

        <div className="focus-progress">
          <div
            className="focus-progress-bar"
            style={{ width: `${(currentIndex / unplayedChampions.length) * 100}%` }}
          />
        </div>
      </div>
    </div>
  );
};

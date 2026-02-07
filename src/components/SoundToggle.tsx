import React from 'react';
import { useSound } from '../hooks/useSound';
import './SoundToggle.css';

export const SoundToggle: React.FC = () => {
  const { enabled, setEnabled, volume, setVolume } = useSound();

  return (
    <div className="sound-toggle">
      <button
        type="button"
        className={`sound-button ${enabled ? 'sound-on' : 'sound-off'}`}
        onClick={() => setEnabled(!enabled)}
        aria-label={enabled ? 'Désactiver les sons' : 'Activer les sons'}
        title={enabled ? 'Sons activés' : 'Sons désactivés'}
      >
        {enabled ? (
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
            <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07" />
          </svg>
        ) : (
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
            <line x1="23" y1="9" x2="17" y2="15" />
            <line x1="17" y1="9" x2="23" y2="15" />
          </svg>
        )}
      </button>
      {enabled && (
        <div className="volume-slider-container">
          <input
            type="range"
            min="0"
            max="100"
            value={volume * 100}
            onChange={(e) => setVolume(Number(e.target.value) / 100)}
            className="volume-slider"
            aria-label="Volume"
          />
        </div>
      )}
    </div>
  );
};

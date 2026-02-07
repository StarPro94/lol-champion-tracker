import { useState, useEffect } from 'react';

interface CustomizationSettings {
  theme: 'hextech' | 'project' | 'starGuardian' | 'spiritBlossom';
  cardStyle: 'default' | 'compact' | 'minimal' | 'glass';
  particleStyle: 'confetti' | 'fire' | 'ice' | 'rainbow';
  soundEnabled: boolean;
  volume: number;
  screenShake: boolean;
  animations: boolean;
  cursorTrail: boolean;
}

const THEMES = {
  hextech: {
    name: 'Hextech',
    colors: ['#00D4FF', '#091428', '#C89B3C'],
    gradient: 'linear-gradient(135deg, #00D4FF 0%, #A855F7 100%)',
  },
  project: {
    name: 'PROJECT',
    colors: ['#00FFFF', '#0A0A0A', '#FFFFFF'],
    gradient: 'linear-gradient(135deg, #00FFFF 0%, #FFFFFF 100%)',
  },
  starGuardian: {
    name: 'Star Guardian',
    colors: ['#FF69B4', '#4B0082', '#FFD700'],
    gradient: 'linear-gradient(135deg, #FF69B4 0%, #FFD700 100%)',
  },
  spiritBlossom: {
    name: 'Spirit Blossom',
    colors: ['#FF4500', '#1A1A2E', '#FFB6C1'],
    gradient: 'linear-gradient(135deg, #FF4500 0%, #8B0000 100%)',
  },
};

const CARD_STYLES = [
  { id: 'default', name: 'Default', icon: '🎴' },
  { id: 'compact', name: 'Compact', icon: '📋' },
  { id: 'minimal', name: 'Minimal', icon: '◻️' },
  { id: 'glass', name: 'Glass', icon: '💎' },
];

const PARTICLE_STYLES = [
  { id: 'confetti', name: 'Confetti', icon: '🎊' },
  { id: 'fire', name: 'Fire', icon: '🔥' },
  { id: 'ice', name: 'Ice', icon: '❄️' },
  { id: 'rainbow', name: 'Rainbow', icon: '🌈' },
];

const STORAGE_KEY = 'customization';

const DEFAULT_SETTINGS: CustomizationSettings = {
  theme: 'hextech',
  cardStyle: 'default',
  particleStyle: 'confetti',
  soundEnabled: true,
  volume: 0.3,
  screenShake: true,
  animations: true,
  cursorTrail: true,
};

export const useCustomization = () => {
  const [settings, setSettings] = useState<CustomizationSettings>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? { ...DEFAULT_SETTINGS, ...JSON.parse(saved) } : DEFAULT_SETTINGS;
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
    applyTheme(settings.theme);
  }, [settings]);

  const updateSetting = <K extends keyof CustomizationSettings>(
    key: K,
    value: CustomizationSettings[K]
  ) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const resetSettings = () => {
    setSettings(DEFAULT_SETTINGS);
  };

  return { settings, updateSetting, resetSettings };
};

const applyTheme = (theme: keyof typeof THEMES) => {
  const themeData = THEMES[theme];
  const root = document.documentElement;

  root.style.setProperty('--color-primary', themeData.colors[0]);
  root.style.setProperty('--color-secondary', themeData.colors[1]);
  root.style.setProperty('--color-accent', themeData.colors[2]);
};

interface CustomizationPanelProps {
  onClose?: () => void;
}

export const CustomizationPanel: React.FC<CustomizationPanelProps> = ({ onClose }) => {
  const { settings, updateSetting, resetSettings } = useCustomization();

  return (
    <div className="customization-panel">
      <div className="customization-header">
        <h2 className="customization-title">⚙️ Personnalisation</h2>
        {onClose && (
          <button
            className="lane-random-close"
            onClick={onClose}
            aria-label="Fermer"
            style={{ position: 'static', width: 32, height: 32 }}
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M2 2L14 14M2 14L14 2" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </button>
        )}
      </div>

      <div className="customization-sections">
        {/* Theme Selection */}
        <div className="customization-section">
          <h3 className="customization-section-title">
            <span className="customization-section-icon">🎨</span>
            Thème
          </h3>
          <div className="theme-options">
            {Object.entries(THEMES).map(([key, theme]) => (
              <div
                key={key}
                className={`theme-option ${settings.theme === key ? 'active' : ''}`}
                onClick={() => updateSetting('theme', key as 'hextech' | 'project' | 'starGuardian' | 'spiritBlossom')}
                style={{ '--theme-gradient': theme.gradient } as React.CSSProperties}
              >
                <div className="theme-option-preview">
                  {theme.colors.slice(0, 3).map((color, i) => (
                    <div
                      key={i}
                      className="theme-option-color"
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
                <div className="theme-option-name">{theme.name}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Card Style */}
        <div className="customization-section">
          <h3 className="customization-section-title">
            <span className="customization-section-icon">🃏</span>
            Style de Carte
          </h3>
          <div className="card-style-options">
            {CARD_STYLES.map((style) => (
              <div
                key={style.id}
                className={`card-style-option ${settings.cardStyle === style.id ? 'active' : ''}`}
                data-style={style.id}
                onClick={() => updateSetting('cardStyle', style.id as 'default' | 'compact' | 'minimal' | 'glass')}
              >
                <div className="card-style-preview">{style.icon}</div>
                <div className="card-style-name">{style.name}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Particle Style */}
        <div className="customization-section">
          <h3 className="customization-section-title">
            <span className="customization-section-icon">✨</span>
            Style de Particules
          </h3>
          <div className="particle-style-grid">
            {PARTICLE_STYLES.map((style) => (
              <div
                key={style.id}
                className={`particle-style-option ${settings.particleStyle === style.id ? 'active' : ''}`}
                data-style={style.id}
                onClick={() => updateSetting('particleStyle', style.id as 'confetti' | 'fire' | 'ice' | 'rainbow')}
              >
                <div className="animation-preview">
                  <div className="animation-preview-dot" />
                </div>
                <div className="particle-style-icon">{style.icon}</div>
                <div className="particle-style-name">{style.name}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Toggles */}
        <div className="customization-section">
          <h3 className="customization-section-title">
            <span className="customization-section-icon">🔧</span>
            Options
          </h3>
          <div className="toggle-options">
            {/* Sound */}
            <div className="toggle-option">
              <div className="toggle-option-label">
                <span className="toggle-option-icon">🔊</span>
                <div>
                  <div className="toggle-option-text">Sons</div>
                  <div className="toggle-option-description">Effets sonores de clic</div>
                </div>
              </div>
              <div
                className={`toggle-switch ${settings.soundEnabled ? 'active' : ''}`}
                onClick={() => updateSetting('soundEnabled', !settings.soundEnabled)}
              />
            </div>

            {/* Volume */}
            {settings.soundEnabled && (
              <div className="toggle-option">
                <div className="toggle-option-label">
                  <span className="toggle-option-icon">🎚️</span>
                  <div>
                    <div className="toggle-option-text">Volume</div>
                    <div className="toggle-option-description">Niveau sonore</div>
                  </div>
                </div>
                <div className="volume-slider-container">
                  <span className="volume-icon">{settings.volume > 0.5 ? '🔊' : settings.volume > 0 ? '🔉' : '🔇'}</span>
                  <input
                    type="range"
                    className="volume-slider"
                    min="0"
                    max="1"
                    step="0.05"
                    value={settings.volume}
                    onChange={(e) => updateSetting('volume', parseFloat(e.target.value))}
                  />
                  <span className="volume-value">{Math.round(settings.volume * 100)}%</span>
                </div>
              </div>
            )}

            {/* Screen Shake */}
            <div className="toggle-option">
              <div className="toggle-option-label">
                <span className="toggle-option-icon">📳</span>
                <div>
                  <div className="toggle-option-text">Screen Shake</div>
                  <div className="toggle-option-description">Tremblement d'écran</div>
                </div>
              </div>
              <div
                className={`toggle-switch ${settings.screenShake ? 'active' : ''}`}
                onClick={() => updateSetting('screenShake', !settings.screenShake)}
              />
            </div>

            {/* Animations */}
            <div className="toggle-option">
              <div className="toggle-option-label">
                <span className="toggle-option-icon">🎬</span>
                <div>
                  <div className="toggle-option-text">Animations</div>
                  <div className="toggle-option-description">Animations des cartes</div>
                </div>
              </div>
              <div
                className={`toggle-switch ${settings.animations ? 'active' : ''}`}
                onClick={() => updateSetting('animations', !settings.animations)}
              />
            </div>

            {/* Cursor Trail */}
            <div className="toggle-option">
              <div className="toggle-option-label">
                <span className="toggle-option-icon">💫</span>
                <div>
                  <div className="toggle-option-text">Trail de Curseur</div>
                  <div className="toggle-option-description">Particules au curseur</div>
                </div>
              </div>
              <div
                className={`toggle-switch ${settings.cursorTrail ? 'active' : ''}`}
                onClick={() => updateSetting('cursorTrail', !settings.cursorTrail)}
              />
            </div>
          </div>
        </div>

        {/* Reset Button */}
        <button className="reset-button" onClick={resetSettings}>
          🔄 Réinitialiser les Paramètres
        </button>
      </div>
    </div>
  );
};

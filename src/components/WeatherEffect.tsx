import { useEffect, useState } from 'react';
import './WeatherEffect.css';

type WeatherType = 'snow' | 'fire' | 'rain' | 'leaves' | 'petals' | 'magic' | 'lightning' | 'fog' | null;

interface WeatherEffectProps {
  championName: string;
  tags: string[];
  isHovered?: boolean;
}

// Champion-specific weather mappings
const CHAMPION_WEATHER: Record<string, WeatherType> = {
  // Ice/Snow champions
  'Anivia': 'snow',
  'Lissandra': 'snow',
  'Braum': 'snow',
  'Ornn': 'snow',
  'Nunu': 'snow',
  'Willump': 'snow',

  // Fire/Ember champions
  'Brand': 'fire',
  'Annie': 'fire',
  'Zyra': 'fire',
  'Diana': 'fire',
  'Shyvana': 'fire',
  'Kegan': 'fire',

  // Shadow/Dark champions
  'Nocturne': 'rain',
  'Zed': 'magic',
  'Kayn': 'lightning',
  'Aphelios': 'fog',
  'Viego': 'fog',

  // Magic/Arcane champions
  'Lux': 'magic',
  'Syndra': 'magic',
  'Xerath': 'magic',
  'Veigar': 'magic',
  'Seraphine': 'petals',

  // Nature champions
  'Ivern': 'leaves',
  'Maokai': 'leaves',
  'Kindred': 'leaves',
  'Yorick': 'fog',

  // Spirit champions
  'Ahri': 'petals',
  'Yuumi': 'petals',
  'Lillia': 'magic',

  // Water/Rain champions
  'Nami': 'rain',
  'Fizz': 'rain',
  'Pyke': 'rain',
  'TahmKench': 'rain',

  // Storm/Lightning champions
  'Volibear': 'lightning',
  'Kruger': 'lightning',
  'Storm': 'lightning',
};

// Tag-based weather fallbacks
const TAG_WEATHER: Record<string, WeatherType> = {
  'Iceborn': 'snow',
  'Frost': 'snow',
  'Fire': 'fire',
  'Flame': 'fire',
  'Shadow': 'fog',
  'Light': 'magic',
  'Cosmic': 'magic',
  'Tundra': 'snow',
  'Infernal': 'fire',
  'Mountain': 'leaves',
  'Ocean': 'rain',
  'Cloud': 'rain',
  'Mystic': 'petals',
  'Celestial': 'magic',
};

export const getWeatherForChampion = (name: string, tags: string[]): WeatherType => {
  // Check champion-specific mapping
  if (CHAMPION_WEATHER[name]) {
    return CHAMPION_WEATHER[name];
  }

  // Check tag-based mapping
  for (const tag of tags) {
    if (TAG_WEATHER[tag]) {
      return TAG_WEATHER[tag];
    }
  }

  return null;
};

export const WeatherEffect: React.FC<WeatherEffectProps> = ({
  championName,
  tags,
  isHovered = false,
}) => {
  const [weather] = useState<WeatherType>(() => getWeatherForChampion(championName, tags));
  const [particles, setParticles] = useState<Array<{ id: number; left: number; delay: number; duration: number }>>([]);

  useEffect(() => {
    if (!weather || !isHovered) return;

    // Generate particles based on weather type
    const particleCount = weather === 'rain' ? 20 : weather === 'snow' ? 15 : 10;
    const newParticles = Array.from({ length: particleCount }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      delay: Math.random() * 2,
      duration: 2 + Math.random() * 2,
    }));

    setParticles(newParticles);
  }, [weather, isHovered]);

  if (!weather || !isHovered) return null;

  return (
    <div className={`weather-effect ${weather}`}>
      {weather === 'snow' && particles.map((p) => (
        <div
          key={p.id}
          className="snowflake"
          style={{
            left: `${p.left}%`,
            animationDelay: `${p.delay}s`,
            animationDuration: `${p.duration}s`,
          }}
        >
          ❄
        </div>
      ))}

      {weather === 'fire' && particles.map((p) => (
        <div
          key={p.id}
          className="ember"
          style={{
            left: `${p.left}%`,
            animationDelay: `${p.delay}s`,
            animationDuration: `${p.duration * 0.8}s`,
          }}
        />
      ))}

      {weather === 'rain' && particles.map((p) => (
        <div
          key={p.id}
          className="raindrop"
          style={{
            left: `${p.left}%`,
            animationDelay: `${p.delay * 0.5}s`,
            animationDuration: `${p.duration * 0.5}s`,
          }}
        />
      ))}

      {weather === 'leaves' && particles.slice(0, 5).map((p) => (
        <div
          key={p.id}
          className="leaf"
          style={{
            left: `${p.left}%`,
            animationDelay: `${p.delay}s`,
            animationDuration: `${p.duration * 2}s`,
          }}
        />
      ))}

      {weather === 'petals' && particles.slice(0, 6).map((p) => (
        <div
          key={p.id}
          className="petal"
          style={{
            left: `${p.left}%`,
            animationDelay: `${p.delay}s`,
            animationDuration: `${p.duration * 2.5}s`,
          }}
        />
      ))}

      {weather === 'magic' && particles.slice(0, 8).map((p) => (
        <div
          key={p.id}
          className="magic-sparkle"
          style={{
            left: `${p.left}%`,
            top: `${20 + Math.random() * 60}%`,
            animationDelay: `${p.delay}s`,
            animationDuration: `${1 + Math.random()}s`,
          }}
        />
      ))}

      {weather === 'lightning' && (
        <div className="lightning-flash" />
      )}

      {weather === 'fog' && (
        <>
          <div className="fog-layer" style={{ animationDuration: '15s' }} />
          <div className="fog-layer" style={{ animationDuration: '20s', animationDelay: '-5s' }} />
        </>
      )}
    </div>
  );
};

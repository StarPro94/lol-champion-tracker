import React from 'react';
import './ClickParticles.css';

export type ParticleType = 'star' | 'sparkle' | 'ring' | 'trail';

interface Particle {
  id: number;
  type: ParticleType;
  angle: number;
  distance: number;
  size: number;
  delay: number;
  duration: number;
  color: string;
  rotation: number;
}

interface ClickParticlesProps {
  x: number;
  y: number;
  color?: string;
}

// Enhanced particle generation with multiple types
const generateParticles = (count: number): Particle[] => {
  const particles: Particle[] = [];
  const colors = [
    '#C89B3C', // Gold
    '#FFD700', // Bright gold
    '#FFF8DC', // Cornsilk
    '#00D4FF', // Hextech cyan
    '#0AC8B9', // Teal
  ];

  const starCount = Math.floor(count * 0.5); // 50% stars
  const sparkleCount = Math.floor(count * 0.3); // 30% sparkles
  const ringCount = Math.floor(count * 0.1); // 10% rings
  const trailCount = count - starCount - sparkleCount - ringCount; // Remaining trails

  let particleIndex = 0;

  // Gold stars - medium speed, medium distance
  for (let i = 0; i < starCount; i++) {
    const angle = (i / starCount) * Math.PI * 2 + (Math.random() - 0.5) * 0.3;
    particles.push({
      id: particleIndex++,
      type: 'star',
      angle,
      distance: 60 + Math.random() * 50,
      size: 8 + Math.random() * 8,
      delay: Math.random() * 30,
      duration: 0.6 + Math.random() * 0.3,
      color: colors[Math.floor(Math.random() * 3)],
      rotation: Math.random() * 360,
    });
  }

  // Sparkles - fast, short distance, bright white
  for (let i = 0; i < sparkleCount; i++) {
    const angle = Math.random() * Math.PI * 2;
    particles.push({
      id: particleIndex++,
      type: 'sparkle',
      angle,
      distance: 30 + Math.random() * 40,
      size: 4 + Math.random() * 6,
      delay: Math.random() * 50,
      duration: 0.4 + Math.random() * 0.2,
      color: '#FFFFFF',
      rotation: 0,
    });
  }

  // Rings - expanding circles
  for (let i = 0; i < ringCount; i++) {
    particles.push({
      id: particleIndex++,
      type: 'ring',
      angle: 0,
      distance: 80 + i * 20,
      size: 20 + i * 10,
      delay: i * 50,
      duration: 0.8,
      color: 'rgba(200, 155, 60, 0.6)',
      rotation: 0,
    });
  }

  // Trails - long, colorful trails
  for (let i = 0; i < trailCount; i++) {
    const angle = Math.random() * Math.PI * 2;
    particles.push({
      id: particleIndex++,
      type: 'trail',
      angle,
      distance: 80 + Math.random() * 60,
      size: 3 + Math.random() * 4,
      delay: Math.random() * 40,
      duration: 0.8 + Math.random() * 0.3,
      color: colors[3 + Math.floor(Math.random() * 2)],
      rotation: 0,
    });
  }

  return particles;
};

export const ClickParticles: React.FC<ClickParticlesProps> = ({
  x,
  y,
  color: _color, // Unused but kept for API compatibility
}) => {
  const particles = React.useMemo(() => generateParticles(30), []);

  return (
    <div
      className="particles-container"
      style={{
        position: 'fixed',
        left: x,
        top: y,
        pointerEvents: 'none',
        zIndex: 9999,
      }}
    >
      {particles.map((p) => (
        <div
          key={p.id}
          className={`particle particle-${p.type}`}
          style={
            {
              '--angle': p.angle,
              '--distance': `${p.distance}px`,
              '--size': `${p.size}px`,
              '--color': p.color,
              '--delay': `${p.delay}ms`,
              '--duration': `${p.duration}s`,
              '--rotation': `${p.rotation}deg`,
            } as React.CSSProperties
          }
        >
          {p.type === 'star' && (
            <svg viewBox="0 0 24 24" fill="currentColor" className="particle-svg">
              <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
            </svg>
          )}
          {p.type === 'sparkle' && (
            <svg viewBox="0 0 24 24" fill="currentColor" className="particle-svg">
              <path d="M12 0L14.59 9.41L24 12L14.59 14.59L12 24L9.41 14.59L0 12L9.41 9.41L12 0Z" />
            </svg>
          )}
        </div>
      ))}
    </div>
  );
};

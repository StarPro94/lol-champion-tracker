import React from 'react';
import './ClickParticles.css';

interface Particle {
  id: number;
  angle: number;
  distance: number;
  size: number;
  delay: number;
}

interface ClickParticlesProps {
  x: number;
  y: number;
  color?: string;
}

const generateParticles = (count: number): Particle[] => {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    angle: (i * (360 / count)) * (Math.PI / 180),
    distance: 40 + Math.random() * 30,
    size: 4 + Math.random() * 4,
    delay: Math.random() * 50,
  }));
};

export const ClickParticles: React.FC<ClickParticlesProps> = ({
  x,
  y,
  color = '#C89B3C',
}) => {
  const particles = React.useMemo(() => generateParticles(12), []);

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
          className="particle"
          style={
            {
              '--angle': p.angle,
              '--distance': `${p.distance}px`,
              '--size': `${p.size}px`,
              '--color': color,
              '--delay': `${p.delay}ms`,
            } as React.CSSProperties
          }
        />
      ))}
    </div>
  );
};

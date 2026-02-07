import React from 'react';
import './Shockwave.css';

interface ShockwaveProps {
  x: number;
  y: number;
  color?: string;
}

export const Shockwave: React.FC<ShockwaveProps> = ({
  x,
  y,
  color = 'rgba(200, 155, 60, 0.6)',
}) => {
  // Create multiple expanding rings
  const rings = React.useMemo(() => [1, 2, 3], []);

  return (
    <div
      className="shockwave-container"
      style={{
        position: 'fixed',
        left: x,
        top: y,
        pointerEvents: 'none',
        zIndex: 9998,
      }}
    >
      {rings.map((ring, index) => (
        <div
          key={ring}
          className="shockwave-ring"
          style={
            {
              '--delay': `${index * 80}ms`,
              '--color': color,
            } as React.CSSProperties
          }
        />
      ))}
    </div>
  );
};

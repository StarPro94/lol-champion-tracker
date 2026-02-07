import React, { useEffect, useRef, useState } from 'react';
import './CursorTrail.css';

interface TrailParticle {
  id: number;
  x: number;
  y: number;
  life: number;
}

export const CursorTrail: React.FC = () => {
  const [particles, setParticles] = useState<TrailParticle[]>([]);
  const [isEnabled, setIsEnabled] = useState(true);
  const lastPos = useRef({ x: 0, y: 0 });
  const particleId = useRef(0);

  useEffect(() => {
    // Check if user prefers reduced motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      setIsEnabled(false);
      return;
    }

    // Only enable on desktop
    if (window.innerWidth < 1024) {
      setIsEnabled(false);
      return;
    }

    let animationFrame: number;
    let lastTime = 0;
    const throttleDelay = 30; // ms between trail updates

    const handleMouseMove = (e: MouseEvent) => {
      const now = Date.now();
      if (now - lastTime < throttleDelay) return;
      lastTime = now;

      const { clientX, clientY } = e;

      // Only add particle if mouse moved enough
      const dx = clientX - lastPos.current.x;
      const dy = clientY - lastPos.current.y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance > 20) {
        const newParticle: TrailParticle = {
          id: particleId.current++,
          x: clientX,
          y: clientY,
          life: 1,
        };

        setParticles(prev => {
          const updated = [...prev, newParticle];
          // Keep only last 8 particles
          return updated.slice(-8);
        });

        lastPos.current = { x: clientX, y: clientY };
      }
    };

    // Animate particles
    const animate = () => {
      setParticles(prev => {
        return prev
          .map(p => ({ ...p, life: p.life - 0.05 }))
          .filter(p => p.life > 0);
      });
      animationFrame = requestAnimationFrame(animate);
    };

    animate();

    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animationFrame);
    };
  }, []);

  if (!isEnabled) return null;

  return (
    <div className="cursor-trail-container">
      {particles.map(p => (
        <div
          key={p.id}
          className="cursor-trail-particle"
          style={{
            left: p.x,
            top: p.y,
            opacity: p.life,
            transform: `translate(-50%, -50%) scale(${p.life})`,
          }}
        />
      ))}
    </div>
  );
};

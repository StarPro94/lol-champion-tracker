import React, { useEffect, useRef } from 'react';
import './ConfettiCanon.css';

export const ConfettiCanon: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const particles: ConfettiParticle[] = [];
    const colors = [
      '#C89B3C', // Gold
      '#00D4FF', // Cyan
      '#A855F7', // Purple
      '#EC4899', // Pink
      '#0AC8B9', // Teal
      '#FFD700', // Bright Gold
    ];

    const shapes = ['circle', 'square', 'triangle'];

    // Create initial burst
    for (let i = 0; i < 150; i++) {
      particles.push(createParticle(canvas.width / 2, canvas.height / 2, colors, shapes));
    }

    function createParticle(x: number, y: number, colors: string[], shapes: string[]): ConfettiParticle {
      const angle = (Math.random() * 360) * (Math.PI / 180);
      const velocity = 10 + Math.random() * 15;

      return {
        x,
        y,
        vx: Math.cos(angle) * velocity,
        vy: Math.sin(angle) * velocity - 5, // Upward bias
        size: 5 + Math.random() * 10,
        color: colors[Math.floor(Math.random() * colors.length)],
        shape: shapes[Math.floor(Math.random() * shapes.length)],
        rotation: Math.random() * 360,
        rotationSpeed: (Math.random() - 0.5) * 10,
        gravity: 0.2,
        drag: 0.99,
        life: 1,
        decay: 0.005 + Math.random() * 0.01,
      };
    }

    function drawParticle(p: ConfettiParticle) {
      if (!ctx) return;
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate((p.rotation * Math.PI) / 180);
      ctx.globalAlpha = p.life;

      ctx.fillStyle = p.color;

      if (p.shape === 'circle') {
        ctx.beginPath();
        ctx.arc(0, 0, p.size / 2, 0, Math.PI * 2);
        ctx.fill();
      } else if (p.shape === 'square') {
        ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
      } else if (p.shape === 'triangle') {
        ctx.beginPath();
        ctx.moveTo(0, -p.size / 2);
        ctx.lineTo(p.size / 2, p.size / 2);
        ctx.lineTo(-p.size / 2, p.size / 2);
        ctx.closePath();
        ctx.fill();
      }

      ctx.restore();
    }

    function update() {
      if (!ctx || !canvas) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      let aliveCount = 0;

      for (const particle of particles) {
        if (particle.life <= 0) continue;

        particle.vy += particle.gravity;
        particle.vx *= particle.drag;
        particle.vy *= particle.drag;
        particle.x += particle.vx;
        particle.y += particle.vy;
        particle.rotation += particle.rotationSpeed;
        particle.life -= particle.decay;

        if (particle.life > 0) {
          drawParticle(particle);
          aliveCount++;
        }
      }

      if (aliveCount > 0) {
        animationRef.current = requestAnimationFrame(update);
      }
    }

    update();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="confetti-canvas"
      style={{
        position: 'fixed',
        inset: 0,
        pointerEvents: 'none',
        zIndex: 9999,
      }}
    />
  );
};

interface ConfettiParticle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  shape: string;
  rotation: number;
  rotationSpeed: number;
  gravity: number;
  drag: number;
  life: number;
  decay: number;
}

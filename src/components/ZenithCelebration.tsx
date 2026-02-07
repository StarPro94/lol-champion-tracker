import { useEffect, useRef, useState } from 'react';
import type { Achievement } from '../hooks/useAchievements';
import './ZenithCelebration.css';

interface ZenithCelebrationProps {
  totalChampions: number;
  totalTime: number;
  achievements: Achievement[];
  onClose: () => void;
}

export const ZenithCelebration: React.FC<ZenithCelebrationProps> = ({
  totalChampions,
  totalTime,
  achievements,
  onClose,
}) => {
  const [isClosing, setIsClosing] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Generate stars
  const stars = Array.from({ length: 100 }, (_, i) => ({
    id: i,
    left: Math.random() * 100,
    top: Math.random() * 100,
    delay: Math.random() * 2,
    size: Math.random() * 2 + 1,
  }));

  // Legendary achievements to showcase
  const legendaryAchievements = achievements.filter(a => a.unlocked && a.rarity === 'legendary');
  const epicAchievements = achievements.filter(a => a.unlocked && a.rarity === 'epic').slice(0, 5);
  const showcaseAchievements = [...legendaryAchievements, ...epicAchievements].slice(0, 6);

  // Format time
  const formatTime = (ms: number) => {
    const hours = Math.floor(ms / (1000 * 60 * 60));
    const minutes = Math.floor((ms % (1000 * 60 * 60)) / (1000 * 60));
    const days = Math.floor(hours / 24);
    const displayHours = hours % 24;

    if (days > 0) {
      return `${days}j ${displayHours}h`;
    }
    if (hours > 0) {
      return `${hours}h ${minutes}min`;
    }
    return `${minutes} minutes`;
  };

  // Fireworks effect
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const fireworks: Firework[] = [];
    const particles: Particle[] = [];

    class Firework {
      x: number;
      y: number;
      targetX: number;
      targetY: number;
      color: string;
      dead = false;

      constructor() {
        if (!canvas) {
          this.x = 0;
          this.y = 0;
          this.targetX = 0;
          this.targetY = 0;
          this.color = '#fff';
          this.dead = true;
          return;
        }
        this.x = Math.random() * canvas.width;
        this.y = canvas.height;
        this.targetX = Math.random() * canvas.width;
        this.targetY = Math.random() * canvas.height * 0.5;
        this.color = `hsl(${Math.random() * 360}, 100%, 50%)`;
      }

      update() {
        if (!canvas) return;
        const dy = this.targetY - this.y;
        const dx = this.targetX - this.x;
        this.y += dy * 0.1;
        this.x += dx * 0.05;

        if (Math.abs(dy) < 10) {
          this.dead = true;
          // Explode
          for (let i = 0; i < 50; i++) {
            const angle = (i / 50) * Math.PI * 2;
            particles.push(new Particle(this.x, this.y, this.color, angle));
          }
        }
      }

      draw() {
        if (!ctx) return;
        ctx.beginPath();
        ctx.arc(this.x, this.y, 3, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill();
      }
    }

    class Particle {
      x: number;
      y: number;
      vx: number;
      vy: number;
      color: string;
      alpha = 1;
      dead = false;

      constructor(x: number, y: number, color: string, angle: number) {
        this.x = x;
        this.y = y;
        const speed = Math.random() * 5 + 2;
        this.vx = Math.cos(angle) * speed;
        this.vy = Math.sin(angle) * speed;
        this.color = color;
      }

      update() {
        this.vy += 0.1; // Gravity
        this.x += this.vx;
        this.y += this.vy;
        this.alpha -= 0.02;

        if (this.alpha <= 0) {
          this.dead = true;
        }
      }

      draw() {
        if (!ctx) return;
        ctx.globalAlpha = this.alpha;
        ctx.beginPath();
        ctx.arc(this.x, this.y, 2, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill();
        ctx.globalAlpha = 1;
      }
    }

    let lastFirework = 0;
    const fireworkInterval = 500;

    const animate = (timestamp: number) => {
      if (!ctx || !canvas) return;
      ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Spawn fireworks
      if (timestamp - lastFirework > fireworkInterval && !isClosing) {
        fireworks.push(new Firework());
        lastFirework = timestamp;
      }

      // Update and draw fireworks
      for (let i = fireworks.length - 1; i >= 0; i--) {
        fireworks[i].update();
        fireworks[i].draw();
        if (fireworks[i].dead) {
          fireworks.splice(i, 1);
        }
      }

      // Update and draw particles
      for (let i = particles.length - 1; i >= 0; i--) {
        particles[i].update();
        particles[i].draw();
        if (particles[i].dead) {
          particles.splice(i, 1);
        }
      }

      if (!isClosing || fireworks.length > 0 || particles.length > 0) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);

    return () => {
      // Cleanup
    };
  }, [isClosing]);

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(onClose, 1000);
  };

  return (
    <div className={`zenith-overlay ${isClosing ? 'closing' : ''}`}>
      <canvas ref={canvasRef} className="zenith-fireworks" />

      <div className="zenith-background">
        <div className="zenith-stars">
          {stars.map((star) => (
            <div
              key={star.id}
              className="zenith-star"
              style={{
                left: `${star.left}%`,
                top: `${star.top}%`,
                width: `${star.size}px`,
                height: `${star.size}px`,
                animationDelay: `${star.delay}s`,
              }}
            />
          ))}
        </div>
        <div className="zenith-aurora" />
      </div>

      <div className="zenith-content">
        <div className="zenith-trophy">🏆</div>
        <h1 className="zenith-title">ZENITH ATTEINT</h1>
        <p className="zenith-subtitle">Vous avez complété tous les champions !</p>

        <div className="zenith-stats">
          <div className="zenith-stat">
            <div className="zenith-stat-value">{totalChampions}</div>
            <div className="zenith-stat-label">Champions</div>
          </div>
          <div className="zenith-stat">
            <div className="zenith-stat-value">{achievements.filter(a => a.unlocked).length}</div>
            <div className="zenith-stat-label">Achievements</div>
          </div>
          <div className="zenith-stat">
            <div className="zenith-stat-value">{formatTime(totalTime)}</div>
            <div className="zenith-stat-label">Temps de Jeu</div>
          </div>
        </div>

        {showcaseAchievements.length > 0 && (
          <div className="zenith-achievements">
            {showcaseAchievements.map((achievement) => (
              <div
                key={achievement.id}
                className={`zenith-achievement ${achievement.rarity}`}
              >
                <div className="zenith-achievement-icon">{achievement.icon}</div>
                <div className="zenith-achievement-name">{achievement.name}</div>
              </div>
            ))}
          </div>
        )}

        <div className="zenith-actions">
          <button className="zenith-button zenith-button-secondary" onClick={handleClose}>
            Fermer
          </button>
          <button
            className="zenith-button zenith-button-primary"
            onClick={() => {
              // Share functionality could go here
              handleClose();
            }}
          >
            Partager
          </button>
        </div>
      </div>

      <div className="zenith-credits">
        LoL Champion Tracker - Merci pour votre dedication !
      </div>
    </div>
  );
};

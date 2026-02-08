import { useEffect, useState, useRef } from 'react';
import './DancingDwarves.css';

interface DancingDwarvesProps {
  trigger?: number;
  isMilestone?: boolean;
  onComplete?: () => void;
}

export const DancingDwarves: React.FC<DancingDwarvesProps> = ({
  trigger,
  isMilestone = false,
  onComplete,
}) => {
  const [showDwarf, setShowDwarf] = useState(false);
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 50, y: 50 });
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (!trigger && trigger !== 0) return;

    // Random position for the dwarf
    setPosition({
      x: Math.random() * 60 + 20, // 20-80% of screen
      y: Math.random() * 40 + 30, // 30-70% of screen
    });

    // Show dwarf
    setShowDwarf(true);

    // Scale animation
    setScale(0);
    const scaleTimer = setTimeout(() => setScale(1), 50);

    // Play video
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
      videoRef.current.play().catch(() => {
        // Auto-play might be blocked, that's okay
      });
    }

    // Auto-clear
    const clearTime = isMilestone ? 4000 : 2500;
    const timer = setTimeout(() => {
      setShowDwarf(false);
      setScale(0);
      onComplete?.();
    }, clearTime);

    return () => {
      clearTimeout(scaleTimer);
      clearTimeout(timer);
    };
  }, [trigger, isMilestone, onComplete]);

  if (!showDwarf) return null;

  const dwarfSize = isMilestone ? 300 : 150;

  return (
    <div className="dancing-dwarves-container">
      <div
        className="dwarf-video-wrapper"
        style={{
          left: `${position.x}%`,
          top: `${position.y}%`,
          transform: `translate(-50%, -50%) scale(${scale})`,
          width: `${dwarfSize}px`,
          height: `${dwarfSize}px`,
        }}
      >
        <video
          ref={videoRef}
          className="dwarf-video"
          src="/dance-dancing.mp4"
          autoPlay
          muted
          playsInline
          loop
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'contain',
          }}
        />
      </div>

      {/* Multiple dwarves for milestones */}
      {isMilestone && (
        <>
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={`mini-${i}`}
              className="dwarf-video-wrapper dwarf-mini"
              style={{
                left: `${20 + i * 20}%`,
                top: `${60 + (i % 2) * 20}%`,
                transform: `translate(-50%, -50%) scale(${scale})`,
                width: `${dwarfSize * 0.5}px`,
                height: `${dwarfSize * 0.5}px`,
                animationDelay: `${i * 0.1}s`,
              }}
            >
              <video
                className="dwarf-video"
                src="/dance-dancing.mp4"
                autoPlay
                muted
                playsInline
                loop
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'contain',
                }}
              />
            </div>
          ))}
        </>
      )}
    </div>
  );
};

// Hook for easy usage
export const useDancingDwarves = () => {
  const [trigger, setTrigger] = useState(0);
  const [isMilestone, setIsMilestone] = useState(false);

  const triggerDwarves = (milestone = false) => {
    setIsMilestone(milestone);
    setTrigger(prev => prev + 1);
  };

  return { trigger, isMilestone, triggerDwarves };
};

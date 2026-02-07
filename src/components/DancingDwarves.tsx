import { useEffect, useState } from 'react';
import './DancingDwarves.css';

interface DancingDwarvesProps {
  trigger?: number;
  isMilestone?: boolean;
  onComplete?: () => void;
}

const DWARF_EMOJIS = ['🧔', '👷', '🧙', '🧛', '🥷', '💂', '👮', '🧑‍🌾', '🧑‍🏭'];
const DANCE_STYLES = ['style-spin', 'style-bounce', 'style-wave', 'style-disco'] as const;

const CELEBRATION_ITEMS = [
  '🎸', '🎹', '🎺', '🎷', '🪗', '🥁', '🪘',
  '🍺', '🍻', '🎉', '🎊', '💎', '💠', '🪩',
  '⭐', '✨', '💫', '🌟', '⚡', '🔥', '💥',
];

export const DancingDwarves: React.FC<DancingDwarvesProps> = ({
  trigger,
  isMilestone = false,
  onComplete,
}) => {
  const [dwarves, setDwarves] = useState<Array<{
    id: number;
    x: number;
    y: number;
    emoji: string;
    style: string;
  }>>([]);

  const [showGiant, setShowGiant] = useState(false);
  const [showParade, setShowParade] = useState(false);
  const [extras, setExtras] = useState<Array<{
    id: number;
    emoji: string;
    x: number;
    y: number;
    delay: number;
  }>>([]);

  useEffect(() => {
    if (!trigger && trigger !== 0) return;

    // Generate dancing dwarves
    const dwarfCount = isMilestone ? 15 : 8;
    const newDwarves = Array.from({ length: dwarfCount }, (_, i) => ({
      id: Date.now() + i,
      x: Math.random() * 80 + 10, // 10-90% of screen
      y: Math.random() * 60 + 20, // 20-80% of screen
      emoji: DWARF_EMOJIS[Math.floor(Math.random() * DWARF_EMOJIS.length)],
      style: DANCE_STYLES[Math.floor(Math.random() * DANCE_STYLES.length)],
    }));

    setDwarves(newDwarves);

    // Show giant dwarf for milestones
    if (isMilestone) {
      setShowGiant(true);
      setShowParade(true);
    }

    // Generate celebration extras
    const extraCount = isMilestone ? 30 : 15;
    const newExtras = Array.from({ length: extraCount }, (_, i) => ({
      id: Date.now() + 1000 + i,
      emoji: CELEBRATION_ITEMS[Math.floor(Math.random() * CELEBRATION_ITEMS.length)],
      x: Math.random() * 100,
      y: Math.random() * 100,
      delay: Math.random() * 2,
    }));

    setExtras(newExtras);

    // Auto-clear
    const clearTime = isMilestone ? 5000 : 2500;
    const timer = setTimeout(() => {
      setDwarves([]);
      setShowGiant(false);
      setShowParade(false);
      setExtras([]);
      onComplete?.();
    }, clearTime);

    return () => clearTimeout(timer);
  }, [trigger, isMilestone, onComplete]);

  if (dwarves.length === 0 && !showGiant && !showParade) return null;

  return (
    <div className="dancing-dwarves-container">
      {/* Dancing dwarves */}
      {dwarves.map((dwarf) => (
        <div
          key={dwarf.id}
          className={`dwarf ${dwarf.style}`}
          style={{
            left: `${dwarf.x}%`,
            top: `${dwarf.y}%`,
          }}
        >
          {dwarf.emoji}
        </div>
      ))}

      {/* Giant dwarf for milestones */}
      {showGiant && (
        <div className="dwarf-giant">
          🧔‍♂️
        </div>
      )}

      {/* Parade line */}
      {showParade && (
        <div className="dwarf-parade">
          {Array.from({ length: 10 }).map((_, i) => (
            <div
              key={`parade-${i}`}
              className="parade-dwarf"
              style={{ animationDelay: `${i * 0.05}s` }}
            >
              {DWARF_EMOJIS[i % DWARF_EMOJIS.length]}
            </div>
          ))}
        </div>
      )}

      {/* Celebration extras */}
      {extras.map((extra) => {
        const isBeer = extra.emoji === '🍺' || extra.emoji === '🍻';
        const isDiamond = extra.emoji === '💎' || extra.emoji === '💠';
        const isMusic = ['🎸', '🎹', '🎺', '🎷', '🪗', '🥁', '🪘'].includes(extra.emoji);

        let className = 'dwarf-confetti';
        if (isBeer) className = 'dwarf-beer';
        if (isDiamond) className = 'dwarf-diamond';
        if (isMusic) className = 'dwarf-music-note';

        return (
          <div
            key={extra.id}
            className={className}
            style={{
              left: `${extra.x}%`,
              top: `${extra.y}%`,
              animationDelay: `${extra.delay}s`,
            }}
          >
            {extra.emoji}
          </div>
        );
      })}
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

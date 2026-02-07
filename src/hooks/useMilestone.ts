import { useState, useEffect, useRef } from 'react';

export type MilestoneType = 'bronze' | 'silver' | 'gold' | 'diamond' | 'master';

export interface Milestone {
  count: number;
  message: string;
  type: MilestoneType;
  emoji: string;
}

const MILESTONES: Milestone[] = [
  { count: 5, message: 'Premiers pas ! 5 champions !', type: 'bronze', emoji: '🌱' },
  { count: 10, message: 'Bien parti ! 10 champions !', type: 'bronze', emoji: '🌿' },
  { count: 25, message: 'En bonne voie ! 25 champions !', type: 'silver', emoji: '✨' },
  { count: 50, message: 'Demi-siècle ! 50 champions !', type: 'silver', emoji: '💫' },
  { count: 75, message: 'Vrai collectionneur ! 75 champions !', type: 'gold', emoji: '🏆' },
  { count: 100, message: 'Century Club ! 100 champions !', type: 'gold', emoji: '🎖️' },
  { count: 125, message: 'Maître incontesté ! 125 champions !', type: 'diamond', emoji: '💎' },
  { count: 150, message: 'Légende ! 150 champions !', type: 'diamond', emoji: '👑' },
  { count: 167, message: 'PERFECTION ! Tous les champions !', type: 'master', emoji: '🏅' },
];

export const useMilestone = (playedCount: number, totalChampions: number) => {
  const [celebration, setCelebration] = useState<Milestone | null>(null);
  const previousCount = useRef(playedCount);
  const celebratedRef = useRef<Set<number>>(new Set());

  useEffect(() => {
    // Check if we just reached a milestone
    if (playedCount > previousCount.current) {
      const milestone = MILESTONES.find((m) => m.count === playedCount);

      // Only celebrate if not already celebrated this milestone
      if (milestone && !celebratedRef.current.has(milestone.count)) {
        celebratedRef.current.add(milestone.count);
        setCelebration(milestone);

        // Auto-dismiss after 4 seconds
        const timeout = setTimeout(() => setCelebration(null), 4000);
        return () => clearTimeout(timeout);
      }
    }

    // Also handle case where total changes (new champions added)
    // Re-check if current played count is now a milestone
    const currentMilestone = MILESTONES.find((m) => m.count === playedCount);
    if (currentMilestone && !celebratedRef.current.has(currentMilestone.count)) {
      celebratedRef.current.add(currentMilestone.count);
      setCelebration(currentMilestone);
      const timeout = setTimeout(() => setCelebration(null), 4000);
      return () => clearTimeout(timeout);
    }

    previousCount.current = playedCount;
  }, [playedCount, totalChampions]);

  const dismissCelebration = () => setCelebration(null);

  return { celebration, dismissCelebration, MILESTONES };
};

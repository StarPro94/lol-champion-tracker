import { useState, useEffect, useCallback } from 'react';

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  unlocked: boolean;
  unlockedAt?: number;
  progress?: number;
  maxProgress?: number;
}

const ACHIEVEMENTS: Omit<Achievement, 'unlocked' | 'unlockedAt' | 'progress'>[] = [
  // Basic Achievements
  {
    id: 'first_blood',
    name: 'First Blood',
    description: 'Jouer votre premier champion',
    icon: '🩸',
    rarity: 'common',
  },
  {
    id: 'double_kill',
    name: 'Double Kill',
    description: 'Jouer 2 champions en 30 secondes',
    icon: '⚔️',
    rarity: 'common',
  },
  {
    id: 'triple_kill',
    name: 'Triple Kill',
    description: 'Jouer 3 champions en 30 secondes',
    icon: '🔱',
    rarity: 'rare',
  },
  {
    id: 'quadra_kill',
    name: 'Quadra Kill',
    description: 'Jouer 4 champions en 30 secondes',
    icon: '💀',
    rarity: 'epic',
  },
  {
    id: 'penta_kill',
    name: 'Penta Kill',
    description: 'Jouer 5 champions en 30 secondes',
    icon: '👑',
    rarity: 'legendary',
  },

  // Count-based
  {
    id: 'ten_champions',
    name: 'Apprenti',
    description: 'Jouer 10 champions',
    icon: '📚',
    rarity: 'common',
  },
  {
    id: 'fifty_champions',
    name: 'Vétéran',
    description: 'Jouer 50 champions',
    icon: '🎖️',
    rarity: 'rare',
  },
  {
    id: 'hundred_champions',
    name: 'Maître',
    description: 'Jouer 100 champions',
    icon: '🏆',
    rarity: 'epic',
  },
  {
    id: 'all_champions',
    name: 'Légende',
    description: 'Jouer tous les champions',
    icon: '🌟',
    rarity: 'legendary',
  },

  // Speed-based
  {
    id: 'speed_demon',
    name: 'Speed Demon',
    description: 'Cocher 20 champions/minute en mode Focus',
    icon: '⚡',
    rarity: 'epic',
  },
  {
    id: 'lightning_fast',
    name: 'Lightning Fast',
    description: 'Cocher 40 champions/minute en mode Focus',
    icon: '🌩️',
    rarity: 'legendary',
  },

  // Streak-based
  {
    id: 'on_fire',
    name: 'On Fire!',
    description: 'Atteindre un combo de 5',
    icon: '🔥',
    rarity: 'common',
  },
  {
    id: 'unstoppable',
    name: 'Unstoppable',
    description: 'Atteindre un combo de 10',
    icon: '💪',
    rarity: 'rare',
  },
  {
    id: 'godlike',
    name: 'Godlike',
    description: 'Atteindre un combo de 20',
    icon: '⚡',
    rarity: 'legendary',
  },

  // Daily streak
  {
    id: 'daily_starter',
    name: 'Première Journée',
    description: 'Compléter le défi du jour',
    icon: '📅',
    rarity: 'common',
  },
  {
    id: 'daily_warrior',
    name: 'Guerrier Quotidien',
    description: '7 jours consécutifs de défis complétés',
    icon: '🗡️',
    rarity: 'rare',
  },
  {
    id: 'daily_legend',
    name: 'Légende du Quotidien',
    description: '30 jours consécutifs de défis complétés',
    icon: '🏅',
    rarity: 'legendary',
  },

  // Role-based
  {
    id: 'role_master',
    name: 'Maître des Rôles',
    description: 'Assigner des rôles à 50 champions',
    icon: '🎯',
    rarity: 'rare',
  },
  {
    id: 'complete_top',
    name: 'Roi de la Top',
    description: 'Jouer tous les champions Top',
    icon: '⬆️',
    rarity: 'epic',
  },
  {
    id: 'complete_jungle',
    name: 'Seigneur de la Jungle',
    description: 'Jouer tous les champions Jungle',
    icon: '🌴',
    rarity: 'epic',
  },
  {
    id: 'complete_mid',
    name: 'Empereur du Mid',
    description: 'Jouer tous les champions Mid',
    icon: '↔️',
    rarity: 'epic',
  },
  {
    id: 'complete_bot',
    name: 'Tyrant du Bot',
    description: 'Jouer tous les champions ADC',
    icon: '➡️',
    rarity: 'epic',
  },
  {
    id: 'complete_support',
    name: 'Gardien du Support',
    description: 'Jouer tous les champions Support',
    icon: '🛡️',
    rarity: 'epic',
  },

  // Special
  {
    id: 'night_owl',
    name: 'Hibou Nocturne',
    description: 'Jouer un champion entre minuit et 5h',
    icon: '🦉',
    rarity: 'rare',
  },
  {
    id: 'early_bird',
    name: 'Lève-Tôt',
    description: 'Jouer un champion entre 5h et 8h',
    icon: '🐓',
    rarity: 'rare',
  },
  {
    id: 'perfectionist',
    name: 'Perfectionniste',
    description: 'Atteindre le niveau 10 (Challenger)',
    icon: '💎',
    rarity: 'legendary',
  },
  {
    id: 'socialite',
    name: 'Sociable',
    description: 'Utiliser le mode Focus 10 fois',
    icon: '👥',
    rarity: 'common',
  },
  {
    id: 'marathon',
    name: 'Marathonien',
    description: 'Passer 30 minutes en mode Focus',
    icon: '🏃',
    rarity: 'rare',
  },
  {
    id: 'collector',
    name: 'Collectionneur',
    description: 'Débloquer 10 achievements',
    icon: '🎁',
    rarity: 'rare',
  },
  {
    id: 'completionist',
    name: 'Completioniste',
    description: 'Débloquer tous les achievements',
    icon: '🏆',
    rarity: 'legendary',
  },
  {
    id: 'lucky_star',
    name: 'Étoile Filante',
    description: 'Le premier champion du défi du jour était votre préféré',
    icon: '🌠',
    rarity: 'rare',
  },
  {
    id: 'comeback',
    name: 'Le Retour',
    description: 'Rejouer après 7 jours d\'absence',
    icon: '🔄',
    rarity: 'common',
  },
];

const STORAGE_KEY = 'achievements';

export const useAchievements = () => {
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [justUnlocked, setJustUnlocked] = useState<Achievement | null>(null);

  // Load achievements from localStorage
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed: Record<string, { unlockedAt: number }> = JSON.parse(saved);
      const loaded = ACHIEVEMENTS.map((ach) => ({
        ...ach,
        unlocked: parsed[ach.id]?.unlockedAt ? true : false,
        unlockedAt: parsed[ach.id]?.unlockedAt,
      }));
      setAchievements(loaded);
    } else {
      setAchievements(ACHIEVEMENTS.map((ach) => ({ ...ach, unlocked: false })));
    }
  }, []);

  const saveAchievements = useCallback((updated: Achievement[]) => {
    const toSave: Record<string, { unlockedAt: number }> = {};
    updated.forEach((ach) => {
      if (ach.unlocked && ach.unlockedAt) {
        toSave[ach.id] = { unlockedAt: ach.unlockedAt };
      }
    });
    localStorage.setItem(STORAGE_KEY, JSON.stringify(toSave));
  }, []);

  const unlockAchievement = useCallback((id: string) => {
    setAchievements((prev) => {
      const index = prev.findIndex((a) => a.id === id);
      if (index === -1 || prev[index].unlocked) return prev;

      const updated = [...prev];
      updated[index] = {
        ...updated[index],
        unlocked: true,
        unlockedAt: Date.now(),
      };

      saveAchievements(updated);
      setJustUnlocked(updated[index]);

      // Auto-hide notification after 4 seconds
      setTimeout(() => setJustUnlocked(null), 4000);

      return updated;
    });
  }, [saveAchievements]);

  const checkAchievements = useCallback((
    playedCount: number,
    comboCount: number,
    lastPlayTime: number,
    focusSessionCount: number,
    totalFocusTime: number,
    roleAssignmentCount: number,
    level: number,
  ) => {
    // Count-based achievements
    if (playedCount >= 1) unlockAchievement('first_blood');
    if (playedCount >= 10) unlockAchievement('ten_champions');
    if (playedCount >= 50) unlockAchievement('fifty_champions');
    if (playedCount >= 100) unlockAchievement('hundred_champions');

    // Combo-based
    if (comboCount >= 5) unlockAchievement('on_fire');
    if (comboCount >= 10) unlockAchievement('unstoppable');
    if (comboCount >= 20) unlockAchievement('godlike');

    // Role-based
    if (roleAssignmentCount >= 50) unlockAchievement('role_master');

    // Level-based
    if (level >= 10) unlockAchievement('perfectionist');

    // Focus-based
    if (focusSessionCount >= 10) unlockAchievement('socialite');
    if (totalFocusTime >= 30 * 60 * 1000) unlockAchievement('marathon');

    // Time-based
    const hour = new Date().getHours();
    if (hour >= 0 && hour < 5) unlockAchievement('night_owl');
    if (hour >= 5 && hour < 8) unlockAchievement('early_bird');

    // Comeback (7 days since last play)
    const daysSinceLastPlay = (Date.now() - lastPlayTime) / (1000 * 60 * 60 * 24);
    if (daysSinceLastPlay >= 7 && lastPlayTime > 0) unlockAchievement('comeback');

    // Count unlocked achievements
    const unlockedCount = achievements.filter((a) => a.unlocked).length;
    if (unlockedCount >= 10) unlockAchievement('collector');
  }, [achievements, unlockAchievement]);

  const checkSpeedAchievement = useCallback((championsPerMinute: number) => {
    if (championsPerMinute >= 20) unlockAchievement('speed_demon');
    if (championsPerMinute >= 40) unlockAchievement('lightning_fast');
  }, [unlockAchievement]);

  const checkDailyAchievement = useCallback((dayStreak: number) => {
    if (dayStreak >= 1) unlockAchievement('daily_starter');
    if (dayStreak >= 7) unlockAchievement('daily_warrior');
    if (dayStreak >= 30) unlockAchievement('daily_legend');
  }, [unlockAchievement]);

  const checkKillStreak = useCallback((killsInTime: number, timeWindow: number) => {
    if (killsInTime >= 2 && timeWindow <= 30000) unlockAchievement('double_kill');
    if (killsInTime >= 3 && timeWindow <= 30000) unlockAchievement('triple_kill');
    if (killsInTime >= 4 && timeWindow <= 30000) unlockAchievement('quadra_kill');
    if (killsInTime >= 5 && timeWindow <= 30000) unlockAchievement('penta_kill');
  }, [unlockAchievement]);

  const dismissNotification = useCallback(() => {
    setJustUnlocked(null);
  }, []);

  return {
    achievements,
    justUnlocked,
    unlockAchievement,
    checkAchievements,
    checkSpeedAchievement,
    checkDailyAchievement,
    checkKillStreak,
    dismissNotification,
  };
};

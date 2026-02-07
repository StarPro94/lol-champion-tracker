import { useState, useRef, useCallback } from 'react';

interface UseStreakOptions {
  resetDelay?: number; // milliseconds before streak resets
  minStreak?: number; // minimum streak to show counter
}

export const useStreak = (options: UseStreakOptions = {}) => {
  const { resetDelay = 5000, minStreak = 3 } = options;

  const [streak, setStreak] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const resetStreak = useCallback(() => {
    setStreak(0);
    setIsVisible(false);
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  }, []);

  const incrementStreak = useCallback(() => {
    setStreak((prev) => {
      const newStreak = prev + 1;

      // Show counter if we reach min streak
      if (newStreak >= minStreak && !isVisible) {
        setIsVisible(true);
      }

      // Clear existing timeout
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      // Set new timeout to reset streak
      timeoutRef.current = setTimeout(() => {
        setStreak(0);
        setIsVisible(false);
      }, resetDelay);

      return newStreak;
    });
  }, [minStreak, isVisible, resetDelay]);

  // Clean up timeout on unmount
  const cleanup = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
  }, []);

  return {
    streak,
    isVisible,
    incrementStreak,
    resetStreak,
    cleanup,
  };
};

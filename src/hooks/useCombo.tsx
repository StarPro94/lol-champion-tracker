import { useState, useEffect, useCallback, useRef } from 'react';

export interface ComboState {
  count: number;
  multiplier: number;
  isJuggernaut: boolean;
  timeLeft: number;
}

const COMBO_WINDOW = 2000; // 2 seconds to keep combo
const JUGGERNAUT_THRESHOLD = 10; // 10 clicks for juggernaut mode
const JUGGERNAUT_DURATION = 5000; // 5 seconds of juggernaut mode

export const useCombo = () => {
  const [combo, setCombo] = useState<ComboState>({
    count: 0,
    multiplier: 1,
    isJuggernaut: false,
    timeLeft: 0,
  });

  const comboTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const juggernautTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Clear combo timer
  useEffect(() => {
    return () => {
      if (comboTimerRef.current) clearTimeout(comboTimerRef.current);
      if (juggernautTimerRef.current) clearTimeout(juggernautTimerRef.current);
    };
  }, []);

  const addCombo = useCallback(() => {
    setCombo((prev) => {
      const newCount = prev.isJuggernaut ? prev.count : prev.count + 1;
      const newMultiplier = prev.isJuggernaut ? prev.multiplier : Math.min(5, 1 + Math.floor(newCount / 3));
      const isNowJuggernaut = newCount >= JUGGERNAUT_THRESHOLD || prev.isJuggernaut;

      // Clear existing timers
      if (comboTimerRef.current) clearTimeout(comboTimerRef.current);

      // Set combo timeout
      if (!prev.isJuggernaut && !isNowJuggernaut) {
        comboTimerRef.current = setTimeout(() => {
          setCombo({ count: 0, multiplier: 1, isJuggernaut: false, timeLeft: 0 });
        }, COMBO_WINDOW);
      }

      // Start juggernaut mode if threshold reached
      if (isNowJuggernaut && !prev.isJuggernaut) {
        if (juggernautTimerRef.current) clearTimeout(juggernautTimerRef.current);

        juggernautTimerRef.current = setTimeout(() => {
          setCombo((prev) => ({
            ...prev,
            count: 0,
            multiplier: 1,
            isJuggernaut: false,
            timeLeft: 0,
          }));
        }, JUGGERNAUT_DURATION);
      }

      return {
        count: newCount,
        multiplier: newMultiplier,
        isJuggernaut: isNowJuggernaut,
        timeLeft: isNowJuggernaut ? JUGGERNAUT_DURATION : COMBO_WINDOW,
      };
    });
  }, []);

  const resetCombo = useCallback(() => {
    if (comboTimerRef.current) clearTimeout(comboTimerRef.current);
    if (juggernautTimerRef.current) clearTimeout(juggernautTimerRef.current);
    setCombo({ count: 0, multiplier: 1, isJuggernaut: false, timeLeft: 0 });
  }, []);

  return { combo, addCombo, resetCombo };
};

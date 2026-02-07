import { useState, useCallback, useEffect, useRef } from 'react';

interface UseSoundReturn {
  enabled: boolean;
  volume: number;
  setEnabled: (enabled: boolean) => void;
  setVolume: (volume: number) => void;
  playClickSound: () => void;
  playMilestoneSound: () => void;
  playStreakSound: (streakLevel: number) => void;
}

// Check if Web Audio API is available
const isAudioAvailable = (): boolean => {
  return typeof window !== 'undefined' &&
    ('AudioContext' in window || 'webkitAudioContext' in window);
};

const getAudioContext = (): AudioContext | null => {
  if (!isAudioAvailable()) return null;
  return new (window.AudioContext || (window as any).webkitAudioContext)();
};

export const useSound = (): UseSoundReturn => {
  const [enabled, setEnabled] = useState(false);
  const [volume, setVolume] = useState(0.3);
  const audioContextRef = useRef<AudioContext | null>(null);

  // Initialize audio context on first user interaction (browser requirement)
  const initAudioContext = useCallback(() => {
    if (!audioContextRef.current && isAudioAvailable()) {
      audioContextRef.current = getAudioContext();
    }
    // Resume if suspended (browser autoplay policy)
    if (audioContextRef.current && audioContextRef.current.state === 'suspended') {
      audioContextRef.current.resume();
    }
    return audioContextRef.current;
  }, []);

  // Load saved preferences
  useEffect(() => {
    const savedEnabled = localStorage.getItem('soundEnabled');
    const savedVolume = localStorage.getItem('soundVolume');

    if (savedEnabled !== null) {
      setEnabled(savedEnabled === 'true');
    }
    if (savedVolume !== null) {
      setVolume(parseFloat(savedVolume));
    }
  }, []);

  // Save preferences when they change
  useEffect(() => {
    localStorage.setItem('soundEnabled', String(enabled));
  }, [enabled]);

  useEffect(() => {
    localStorage.setItem('soundVolume', String(volume));
  }, [volume]);

  const playClickSound = useCallback(() => {
    if (!enabled) return;

    const ctx = initAudioContext();
    if (!ctx) return;

    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);

    // Satisfying "pop" sound
    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(600, ctx.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(300, ctx.currentTime + 0.08);

    gainNode.gain.setValueAtTime(volume * 0.5, ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.1);

    oscillator.start(ctx.currentTime);
    oscillator.stop(ctx.currentTime + 0.1);
  }, [enabled, volume, initAudioContext]);

  const playMilestoneSound = useCallback(() => {
    if (!enabled) return;

    const ctx = initAudioContext();
    if (!ctx) return;

    // Create a chord for milestone (C major arpeggio)
    const frequencies = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6

    frequencies.forEach((freq, i) => {
      const oscillator = ctx.createOscillator();
      const gainNode = ctx.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(ctx.destination);

      oscillator.type = 'sine';
      oscillator.frequency.value = freq;

      const startTime = ctx.currentTime + i * 0.08;
      const duration = 0.4;

      gainNode.gain.setValueAtTime(0, startTime);
      gainNode.gain.linearRampToValueAtTime(volume * 0.3, startTime + 0.02);
      gainNode.gain.exponentialRampToValueAtTime(0.01, startTime + duration);

      oscillator.start(startTime);
      oscillator.stop(startTime + duration);
    });
  }, [enabled, volume, initAudioContext]);

  const playStreakSound = useCallback((streakLevel: number) => {
    if (!enabled) return;

    const ctx = initAudioContext();
    if (!ctx) return;

    // Higher pitch for higher streaks
    const baseFreq = 400 + (streakLevel * 20);

    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);

    oscillator.type = 'triangle';
    oscillator.frequency.setValueAtTime(baseFreq, ctx.currentTime);
    oscillator.frequency.linearRampToValueAtTime(baseFreq + 100, ctx.currentTime + 0.1);

    gainNode.gain.setValueAtTime(volume * 0.25, ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.15);

    oscillator.start(ctx.currentTime);
    oscillator.stop(ctx.currentTime + 0.15);
  }, [enabled, volume, initAudioContext]);

  return {
    enabled,
    volume,
    setEnabled,
    setVolume,
    playClickSound,
    playMilestoneSound,
    playStreakSound,
  };
};

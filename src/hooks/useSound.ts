import { useState, useCallback, useEffect, useRef } from 'react';

interface UseSoundReturn {
  enabled: boolean;
  volume: number;
  setEnabled: (enabled: boolean) => void;
  setVolume: (volume: number) => void;
  playClickSound: () => void;
  playMilestoneSound: () => void;
  playStreakSound: (streakLevel: number) => void;
  hasInteracted: boolean;
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
  // Start with sound enabled by default at low volume
  const [enabled, setEnabled] = useState(true);
  const [volume, setVolume] = useState(0.15); // Lower default volume
  const [hasInteracted, setHasInteracted] = useState(false);
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
    setHasInteracted(true);
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
    const ctx = initAudioContext();
    if (!ctx || !enabled) return;

    // Layered click sound for more impact
    // Main pop
    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);

    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(800, ctx.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(200, ctx.currentTime + 0.1);

    gainNode.gain.setValueAtTime(volume * 0.6, ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.12);

    oscillator.start(ctx.currentTime);
    oscillator.stop(ctx.currentTime + 0.12);

    // Secondary "tick" for punch
    const oscillator2 = ctx.createOscillator();
    const gainNode2 = ctx.createGain();

    oscillator2.connect(gainNode2);
    gainNode2.connect(ctx.destination);

    oscillator2.type = 'triangle';
    oscillator2.frequency.setValueAtTime(1200, ctx.currentTime);
    oscillator2.frequency.exponentialRampToValueAtTime(600, ctx.currentTime + 0.05);

    gainNode2.gain.setValueAtTime(volume * 0.3, ctx.currentTime);
    gainNode2.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.06);

    oscillator2.start(ctx.currentTime);
    oscillator2.stop(ctx.currentTime + 0.06);
  }, [enabled, volume, initAudioContext]);

  const playMilestoneSound = useCallback(() => {
    const ctx = initAudioContext();
    if (!ctx || !enabled) return;

    // Epic chord progression for milestone
    const frequencies = [523.25, 659.25, 783.99, 1046.50, 1318.51]; // C5, E5, G5, C6, E6

    frequencies.forEach((freq, i) => {
      const oscillator = ctx.createOscillator();
      const gainNode = ctx.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(ctx.destination);

      oscillator.type = i < 3 ? 'sine' : 'triangle';
      oscillator.frequency.value = freq;

      const startTime = ctx.currentTime + i * 0.06;
      const duration = 0.6;

      gainNode.gain.setValueAtTime(0, startTime);
      gainNode.gain.linearRampToValueAtTime(volume * 0.35, startTime + 0.02);
      gainNode.gain.exponentialRampToValueAtTime(0.01, startTime + duration);

      oscillator.start(startTime);
      oscillator.stop(startTime + duration);
    });

    // Add a bass drop
    const bassOsc = ctx.createOscillator();
    const bassGain = ctx.createGain();
    bassOsc.connect(bassGain);
    bassGain.connect(ctx.destination);
    bassOsc.type = 'sine';
    bassOsc.frequency.setValueAtTime(130.81, ctx.currentTime); // C3
    bassOsc.frequency.linearRampToValueAtTime(65.41, ctx.currentTime + 0.3);
    bassGain.gain.setValueAtTime(volume * 0.4, ctx.currentTime);
    bassGain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.5);
    bassOsc.start(ctx.currentTime);
    bassOsc.stop(ctx.currentTime + 0.5);
  }, [enabled, volume, initAudioContext]);

  const playStreakSound = useCallback((streakLevel: number) => {
    const ctx = initAudioContext();
    if (!ctx || !enabled) return;

    // Increasing pitch for higher streaks
    const baseFreq = 400 + (streakLevel * 30);

    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);

    oscillator.type = 'square';
    oscillator.frequency.setValueAtTime(baseFreq, ctx.currentTime);
    oscillator.frequency.linearRampToValueAtTime(baseFreq + 200, ctx.currentTime + 0.08);

    gainNode.gain.setValueAtTime(volume * 0.2, ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.12);

    oscillator.start(ctx.currentTime);
    oscillator.stop(ctx.currentTime + 0.12);
  }, [enabled, volume, initAudioContext]);

  return {
    enabled,
    volume,
    setEnabled,
    setVolume,
    playClickSound,
    playMilestoneSound,
    playStreakSound,
    hasInteracted,
  };
};

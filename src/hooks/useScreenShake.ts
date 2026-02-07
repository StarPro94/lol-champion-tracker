import { useCallback, useEffect, useRef } from 'react';

interface UseScreenShakeOptions {
  intensity?: 'light' | 'medium' | 'heavy';
  duration?: number;
}

const prefersReducedMotion = () => {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
};

export const useScreenShake = (options: UseScreenShakeOptions = {}) => {
  const { intensity = 'light', duration = 300 } = options;
  const timeoutRef = useRef<number | null>(null);

  const shake = useCallback(() => {
    // Don't shake if user prefers reduced motion
    if (prefersReducedMotion()) {
      return;
    }

    // Clear any existing shake
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      document.body.classList.remove('screen-shake', 'screen-shake-medium', 'screen-shake-heavy');
    }

    // Add the appropriate shake class
    const shakeClass = intensity === 'heavy' ? 'screen-shake-heavy' :
                      intensity === 'medium' ? 'screen-shake-medium' :
                      'screen-shake';
    document.body.classList.add(shakeClass);

    // Remove after duration
    timeoutRef.current = window.setTimeout(() => {
      document.body.classList.remove(shakeClass);
      timeoutRef.current = null;
    }, duration);
  }, [intensity, duration]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      document.body.classList.remove('screen-shake', 'screen-shake-medium', 'screen-shake-heavy');
    };
  }, []);

  return { shake };
};

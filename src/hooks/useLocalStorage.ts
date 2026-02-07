import { useState, useEffect, useCallback } from 'react';
import type { StoredData } from '../types/champion';
import { STORAGE_KEY } from '../types/champion';
import { isLocalStorageAvailable } from '../utils/storage';

export function useLocalStorage<T>(key: string, initialValue: T): [T, (value: T | ((val: T) => T)) => void, boolean] {
  // État pour stocker la valeur
  const [storedValue, setStoredValue] = useState<T>(initialValue);
  const [isAvailable, setIsAvailable] = useState<boolean>(true);

  // Charger la valeur au montage
  useEffect(() => {
    const available = isLocalStorageAvailable();
    setIsAvailable(available);

    if (!available) {
      return;
    }

    try {
      const item = window.localStorage.getItem(key);
      if (item) {
        setStoredValue(JSON.parse(item));
      }
    } catch (error) {
      console.error(`Error loading ${key} from localStorage:`, error);
      setIsAvailable(false);
    }
  }, [key]);

  // Fonction pour mettre à jour la valeur
  const setValue = useCallback(
    (value: T | ((val: T) => T)) => {
      try {
        // Permettre de passer une fonction pour mettre à jour la valeur
        const valueToStore = value instanceof Function ? value(storedValue) : value;

        setStoredValue(valueToStore);

        if (isAvailable) {
          window.localStorage.setItem(key, JSON.stringify(valueToStore));
        }

        // Déclencher un event pour les autres onglets
        if (typeof window !== 'undefined') {
          window.dispatchEvent(new Event('local-storage'));
        }
      } catch (error) {
        console.error(`Error setting ${key} in localStorage:`, error);
      }
    },
    [key, storedValue, isAvailable]
  );

  // Écouter les changements depuis d'autres onglets
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent | Event) => {
      if ('key' in e && e.key !== key && e.type !== 'local-storage') {
        return;
      }

      try {
        const item = window.localStorage.getItem(key);
        if (item) {
          setStoredValue(JSON.parse(item));
        } else {
          setStoredValue(initialValue);
        }
      } catch (error) {
        console.error(`Error handling storage change for ${key}:`, error);
      }
    };

    window.addEventListener('storage', handleStorageChange as EventListener);
    window.addEventListener('local-storage', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange as EventListener);
      window.removeEventListener('local-storage', handleStorageChange);
    };
  }, [key, initialValue]);

  return [storedValue, setValue, isAvailable];
}

// Hook spécifique pour les données du tracker
export function useTrackerData() {
  const [data, setData, isAvailable] = useLocalStorage<StoredData>(STORAGE_KEY, {
    played: [],
    laneRoles: {},
    playedAt: {},
    schemaVersion: 1,
  });

  const refreshData = useCallback(() => {
    try {
      const item = window.localStorage.getItem(STORAGE_KEY);
      if (item) {
        setData(JSON.parse(item));
      }
    } catch (error) {
      console.error('Error refreshing tracker data:', error);
    }
  }, [setData]);

  return { data, setData, isAvailable, refreshData };
}

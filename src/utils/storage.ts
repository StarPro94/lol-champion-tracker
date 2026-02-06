import type { ChampionStatus } from '../types/champion';

const STORAGE_KEY = 'lol-champion-checklist:v1';

export function loadChampionStatus(): ChampionStatus {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : {};
  } catch {
    return {};
  }
}

export function saveChampionStatus(status: ChampionStatus): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(status));
}

export function exportToFile(status: ChampionStatus): void {
  const data = JSON.stringify(status, null, 2);
  const blob = new Blob([data], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `lol-champions-${new Date().toISOString().split('T')[0]}.json`;
  a.click();
  URL.revokeObjectURL(url);
}

export function importFromFile(file: File): Promise<ChampionStatus> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const status = JSON.parse(e.target?.result as string);
        resolve(status);
      } catch {
        reject(new Error('Invalid file format'));
      }
    };
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsText(file);
  });
}

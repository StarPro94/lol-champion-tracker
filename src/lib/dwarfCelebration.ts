export const DWARF_CELEBRATION_DURATION_SECONDS = 7;
export const DWARF_CELEBRATION_DURATION_MS = DWARF_CELEBRATION_DURATION_SECONDS * 1000;
export const DWARF_AUDIO_FADE_DURATION_MS = 450;

let dwarfCelebrationAudio: HTMLAudioElement | null = null;

function clampRandomValue(value: number): number {
  if (!Number.isFinite(value)) {
    return 0;
  }

  if (value < 0) {
    return 0;
  }

  if (value > 1) {
    return 1;
  }

  return value;
}

export function getRandomAudioStartTime(
  trackDurationSeconds: number,
  clipDurationSeconds = DWARF_CELEBRATION_DURATION_SECONDS,
  randomValue = Math.random(),
): number {
  if (!Number.isFinite(trackDurationSeconds) || trackDurationSeconds <= clipDurationSeconds) {
    return 0;
  }

  const maxStartTime = Math.max(trackDurationSeconds - clipDurationSeconds, 0);
  return maxStartTime * clampRandomValue(randomValue);
}

export function getDwarfCelebrationAudio(): HTMLAudioElement | null {
  if (typeof window === "undefined") {
    return null;
  }

  if (dwarfCelebrationAudio === null) {
    dwarfCelebrationAudio = new Audio("/dwarf-theme.mp3");
    dwarfCelebrationAudio.preload = "auto";

    if (!window.navigator.userAgent.toLowerCase().includes("jsdom")) {
      dwarfCelebrationAudio.load();
    }
  }

  return dwarfCelebrationAudio;
}

export function getCelebrationAudioVolume(
  elapsedMs: number,
  totalDurationMs = DWARF_CELEBRATION_DURATION_MS,
  fadeDurationMs = DWARF_AUDIO_FADE_DURATION_MS,
): number {
  if (totalDurationMs <= 0 || fadeDurationMs <= 0) {
    return 1;
  }

  const effectiveFadeDuration = Math.min(fadeDurationMs, totalDurationMs / 2);

  if (elapsedMs <= 0) {
    return 0;
  }

  if (elapsedMs < effectiveFadeDuration) {
    return elapsedMs / effectiveFadeDuration;
  }

  const remainingMs = totalDurationMs - elapsedMs;
  if (remainingMs < effectiveFadeDuration) {
    return Math.max(remainingMs / effectiveFadeDuration, 0);
  }

  return 1;
}

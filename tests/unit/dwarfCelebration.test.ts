import { describe, expect, it } from "vitest";

import {
  DWARF_CELEBRATION_DURATION_MS,
  DWARF_CELEBRATION_DURATION_SECONDS,
  getRandomAudioStartTime,
} from "../../src/lib/dwarfCelebration";

describe("dwarf celebration timing", () => {
  it("keeps the celebration fixed at seven seconds", () => {
    expect(DWARF_CELEBRATION_DURATION_SECONDS).toBe(7);
    expect(DWARF_CELEBRATION_DURATION_MS).toBe(7000);
  });

  it("returns zero when the track is shorter than the clip", () => {
    expect(getRandomAudioStartTime(5, 7, 0.8)).toBe(0);
  });

  it("returns a bounded random start time inside the playable window", () => {
    expect(getRandomAudioStartTime(40, 7, 0)).toBe(0);
    expect(getRandomAudioStartTime(40, 7, 0.5)).toBe(16.5);
    expect(getRandomAudioStartTime(40, 7, 1)).toBe(33);
  });

  it("clamps invalid random values", () => {
    expect(getRandomAudioStartTime(40, 7, -1)).toBe(0);
    expect(getRandomAudioStartTime(40, 7, 2)).toBe(33);
    expect(getRandomAudioStartTime(40, 7, Number.NaN)).toBe(0);
  });
});

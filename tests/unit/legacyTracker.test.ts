import { describe, expect, it } from "vitest";

import { parseLegacyTrackerPayload, shouldTriggerDwarf } from "../../shared/legacyTracker";

describe("parseLegacyTrackerPayload", () => {
  it("returns normalized entries for the legacy tracker payload", () => {
    const result = parseLegacyTrackerPayload(
      JSON.stringify({
        played: ["Ahri", "Braum"],
        playedAt: {
          Ahri: "2025-02-01T10:00:00.000Z",
        },
        schemaVersion: 2,
      }),
      1_700_000_000_000,
    );

    expect(result).toEqual({
      entries: [
        { championId: "Ahri", validatedAt: Date.parse("2025-02-01T10:00:00.000Z") },
        { championId: "Braum", validatedAt: 1_700_000_000_000 },
      ],
    });
  });

  it("deduplicates champion ids and ignores invalid ids", () => {
    const result = parseLegacyTrackerPayload(
      JSON.stringify({
        played: ["Ahri", "", "Ahri", 42, "Leona"],
        playedAt: {},
      }),
      42,
    );

    expect(result).toEqual({
      entries: [
        { championId: "Ahri", validatedAt: 42 },
        { championId: "Leona", validatedAt: 42 },
      ],
    });
  });

  it("returns null when the payload is corrupt", () => {
    expect(parseLegacyTrackerPayload("not-json", 42)).toBeNull();
    expect(parseLegacyTrackerPayload(JSON.stringify({ played: "Ahri" }), 42)).toBeNull();
    expect(parseLegacyTrackerPayload(null, 42)).toBeNull();
  });
});

describe("shouldTriggerDwarf", () => {
  it("only triggers when validation flips from false to true", () => {
    expect(shouldTriggerDwarf(false, true)).toBe(true);
    expect(shouldTriggerDwarf(true, true)).toBe(false);
    expect(shouldTriggerDwarf(true, false)).toBe(false);
    expect(shouldTriggerDwarf(false, false)).toBe(false);
  });
});
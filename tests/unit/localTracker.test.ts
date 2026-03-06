import { describe, expect, it } from "vitest";

import {
  LEGACY_STORAGE_KEY,
  readLocalProgress,
  toggleLocalChampionValidation,
  writeLocalProgress,
} from "../../src/lib/localTracker";

function createStorage(initialValue: string | null = null) {
  let value = initialValue;

  return {
    getItem(key: string) {
      return key === LEGACY_STORAGE_KEY ? value : null;
    },
    setItem(key: string, nextValue: string) {
      if (key === LEGACY_STORAGE_KEY) {
        value = nextValue;
      }
    },
    removeItem(key: string) {
      if (key === LEGACY_STORAGE_KEY) {
        value = null;
      }
    },
    snapshot() {
      return value;
    },
  };
}

describe("localTracker", () => {
  it("returns an empty list when storage is empty or invalid", () => {
    expect(readLocalProgress(createStorage(), 42)).toEqual([]);
    expect(readLocalProgress(createStorage("not-json"), 42)).toEqual([]);
  });

  it("reads the legacy tracker payload as current local progress", () => {
    const storage = createStorage(
      JSON.stringify({
        played: ["Ahri"],
        playedAt: {
          Ahri: "2025-02-01T10:00:00.000Z",
        },
      }),
    );

    expect(readLocalProgress(storage, 42)).toEqual([
      {
        championId: "Ahri",
        validatedAt: Date.parse("2025-02-01T10:00:00.000Z"),
      },
    ]);
  });

  it("writes local progress using the shared legacy storage shape", () => {
    const storage = createStorage();

    writeLocalProgress(storage, [
      { championId: "Braum", validatedAt: 10 },
      { championId: "Ahri", validatedAt: 20 },
    ]);

    expect(JSON.parse(storage.snapshot() ?? "null")).toEqual({
      played: ["Ahri", "Braum"],
      playedAt: {
        Ahri: new Date(20).toISOString(),
        Braum: new Date(10).toISOString(),
      },
    });
  });

  it("toggles a champion on and off locally", () => {
    const storage = createStorage();

    const first = toggleLocalChampionValidation(storage, "Ahri", 100);
    expect(first).toEqual({
      championId: "Ahri",
      isValidated: true,
      validatedAt: 100,
      progress: [{ championId: "Ahri", validatedAt: 100 }],
    });

    const second = toggleLocalChampionValidation(storage, "Ahri", 200);
    expect(second).toEqual({
      championId: "Ahri",
      isValidated: false,
      progress: [],
    });
    expect(storage.snapshot()).toBeNull();
  });
});

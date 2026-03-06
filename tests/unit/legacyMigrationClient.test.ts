import { describe, expect, it } from "vitest";

import { LEGACY_STORAGE_KEY, LEGACY_MIGRATION_SOURCE, readLegacyProgressFromStorage } from "../../src/lib/legacyMigration";

describe("readLegacyProgressFromStorage", () => {
  it("reads and normalizes the old localStorage payload", () => {
    const storage: Pick<Storage, "getItem"> = {
      getItem(key: string) {
        if (key !== LEGACY_STORAGE_KEY) {
          return null;
        }

        return JSON.stringify({
          played: ["Ahri"],
          playedAt: {
            Ahri: "2025-02-01T10:00:00.000Z",
          },
        });
      },
    };

    expect(readLegacyProgressFromStorage(storage, 42)).toEqual({
      source: LEGACY_MIGRATION_SOURCE,
      entries: [{ championId: "Ahri", validatedAt: Date.parse("2025-02-01T10:00:00.000Z") }],
    });
  });

  it("returns null when there is no legacy payload", () => {
    const storage: Pick<Storage, "getItem"> = {
      getItem() {
        return null;
      },
    };

    expect(readLegacyProgressFromStorage(storage, 42)).toBeNull();
  });
});

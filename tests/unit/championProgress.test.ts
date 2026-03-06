import { describe, expect, it } from "vitest";

import { mergeCatalogWithProgress } from "../../shared/championProgress";
import type { ChampionCatalogEntry } from "../../shared/champions";

const catalog: ChampionCatalogEntry[] = [
  {
    id: "Ahri",
    key: "103",
    name: "Ahri",
    title: "the Nine-Tailed Fox",
    imageUrl: "https://example.com/ahri.png",
    tags: ["Mage", "Assassin"],
    partype: "Mana",
  },
  {
    id: "Braum",
    key: "201",
    name: "Braum",
    title: "the Heart of the Freljord",
    imageUrl: "https://example.com/braum.png",
    tags: ["Support", "Tank"],
    partype: "Mana",
  },
];

describe("mergeCatalogWithProgress", () => {
  it("marks catalog items as validated when progress exists", () => {
    const merged = mergeCatalogWithProgress(catalog, [
      { championId: "Braum", validatedAt: 1_700_000_000_000 },
    ]);

    expect(merged).toEqual([
      {
        ...catalog[0],
        isValidated: false,
        validatedAt: null,
      },
      {
        ...catalog[1],
        isValidated: true,
        validatedAt: new Date(1_700_000_000_000).toISOString(),
      },
    ]);
  });
});
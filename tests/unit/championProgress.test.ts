import { describe, expect, it } from "vitest";

import { mergeCatalogWithProgress } from "../../shared/championProgress";
import type { ChampionCatalogEntry } from "../../shared/champions";

const catalog: ChampionCatalogEntry[] = [
  {
    id: "Ahri",
    key: "103",
    name: "Ahri",
    title: "the Nine-Tailed Fox",
    titleFr: "Renarde a neuf queues",
    imageUrl: "https://example.com/ahri.png",
    splashImageUrl: "https://example.com/ahri-splash.jpg",
    tags: ["Mage", "Assassin"],
    tagsFr: ["Mage", "Assassin"],
    partype: "Mana",
    resourceFr: "Mana",
  },
  {
    id: "Braum",
    key: "201",
    name: "Braum",
    title: "the Heart of the Freljord",
    titleFr: "Coeur de Freljord",
    imageUrl: "https://example.com/braum.png",
    splashImageUrl: "https://example.com/braum-splash.jpg",
    tags: ["Support", "Tank"],
    tagsFr: ["Support", "Tank"],
    partype: "Mana",
    resourceFr: "Mana",
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

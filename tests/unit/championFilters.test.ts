import { describe, expect, it } from "vitest";

import { applyChampionFilters, computeChampionProgress } from "../../shared/championFilters";
import type { ChampionFilters, ChampionListItem } from "../../shared/champions";

const champions: ChampionListItem[] = [
  {
    id: "Ahri",
    key: "103",
    name: "Ahri",
    title: "the Nine-Tailed Fox",
    imageUrl: "https://example.com/ahri.png",
    tags: ["Mage", "Assassin"],
    partype: "Mana",
    isValidated: true,
    validatedAt: "2025-03-01T10:00:00.000Z",
  },
  {
    id: "Braum",
    key: "201",
    name: "Braum",
    title: "the Heart of the Freljord",
    imageUrl: "https://example.com/braum.png",
    tags: ["Support", "Tank"],
    partype: "Mana",
    isValidated: false,
    validatedAt: null,
  },
  {
    id: "Garen",
    key: "86",
    name: "Garen",
    title: "The Might of Demacia",
    imageUrl: "https://example.com/garen.png",
    tags: ["Fighter", "Tank"],
    partype: "None",
    isValidated: true,
    validatedAt: "2025-03-03T10:00:00.000Z",
  },
];

const baseFilters: ChampionFilters = {
  search: "",
  status: "all",
  tag: "all",
  resource: "all",
  sort: "name-asc",
};

describe("applyChampionFilters", () => {
  it("filters by search, status, tag, and resource together", () => {
    const filtered = applyChampionFilters(champions, {
      ...baseFilters,
      search: "fox",
      status: "validated",
      tag: "Mage",
      resource: "Mana",
    });

    expect(filtered.map((champion) => champion.id)).toEqual(["Ahri"]);
  });

  it("sorts unvalidated champions first", () => {
    const filtered = applyChampionFilters(champions, {
      ...baseFilters,
      sort: "unvalidated-first",
    });

    expect(filtered.map((champion) => champion.id)).toEqual(["Braum", "Ahri", "Garen"]);
  });

  it("sorts by most recently validated when requested", () => {
    const filtered = applyChampionFilters(champions, {
      ...baseFilters,
      sort: "recently-validated",
    });

    expect(filtered.map((champion) => champion.id)).toEqual(["Garen", "Ahri", "Braum"]);
  });
});

describe("computeChampionProgress", () => {
  it("computes summary progress counts", () => {
    expect(computeChampionProgress(champions)).toEqual({
      total: 3,
      validated: 2,
      remaining: 1,
      percentage: 67,
    });
  });
});
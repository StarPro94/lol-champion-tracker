import { describe, expect, it } from "vitest";

import { championCatalog } from "../../shared/championCatalog";

describe("championCatalog localization", () => {
  it("exposes french labels and a splash visual for each champion card", () => {
    const ahri = championCatalog.champions.find((champion) => champion.id === "Ahri");

    expect(ahri).toBeDefined();
    expect(ahri?.titleFr).toBeTruthy();
    expect(ahri?.tagsFr.length).toBe(ahri?.tags.length);
    expect(ahri?.resourceFr).toBeTruthy();
    expect(ahri?.splashImageUrl).toContain("/img/champion/");
  });
});

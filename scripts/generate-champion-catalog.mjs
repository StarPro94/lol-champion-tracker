import { readFile, writeFile } from "node:fs/promises";

const TAG_LABELS_FR = {
  Assassin: "Assassin",
  Fighter: "Combattant",
  Mage: "Mage",
  Marksman: "Tireur",
  Support: "Support",
  Tank: "Tank",
};

const RESOURCE_LABELS_FR = {
  "": "Aucune",
  "None": "Aucune",
  "Blood Well": "Puits de sang",
  "Courage": "Courage",
  "Crimson Rush": "Afflux écarlate",
  "Energy": "Énergie",
  "Ferocity": "Férocité",
  "Flow": "Flux",
  "Fury": "Furie",
  "Grit": "Cran",
  "Heat": "Chaleur",
  "Mana": "Mana",
  "Rage": "Rage",
  "Shield": "Bouclier",
};

function buildIconUrl(version, imageFull) {
  return `https://ddragon.leagueoflegends.com/cdn/${version}/img/champion/${imageFull}`;
}

function buildSplashUrl(championId) {
  return `https://ddragon.leagueoflegends.com/cdn/img/champion/splash/${championId}_0.jpg`;
}

function toFrenchTags(tags) {
  return tags.map((tag) => TAG_LABELS_FR[tag] ?? tag);
}

function toFrenchResource(partype) {
  return RESOURCE_LABELS_FR[partype] ?? partype;
}

async function main() {
  const existingCatalog = JSON.parse(
    await readFile(new URL("../convex/data/championCatalog.json", import.meta.url), "utf8"),
  );
  const version = process.argv[2] ?? existingCatalog.version;

  const [englishResponse, frenchResponse] = await Promise.all([
    fetch(`https://ddragon.leagueoflegends.com/cdn/${version}/data/en_US/champion.json`),
    fetch(`https://ddragon.leagueoflegends.com/cdn/${version}/data/fr_FR/champion.json`),
  ]);

  if (!englishResponse.ok || !frenchResponse.ok) {
    throw new Error(`Unable to fetch Riot catalog for version ${version}`);
  }

  const englishCatalog = await englishResponse.json();
  const frenchCatalog = await frenchResponse.json();

  const champions = Object.values(englishCatalog.data).map((champion) => {
    const frenchChampion = frenchCatalog.data[champion.id];

    if (!frenchChampion) {
      throw new Error(`Missing french champion payload for ${champion.id}`);
    }

    return {
      id: champion.id,
      key: champion.key,
      name: champion.name,
      title: champion.title,
      titleFr: frenchChampion.title,
      imageUrl: buildIconUrl(version, champion.image.full),
      splashImageUrl: buildSplashUrl(champion.id),
      tags: champion.tags,
      tagsFr: toFrenchTags(champion.tags),
      partype: champion.partype,
      resourceFr: toFrenchResource(champion.partype),
    };
  });

  champions.sort((left, right) => left.name.localeCompare(right.name, undefined, { sensitivity: "base" }));

  const output = {
    version,
    champions,
  };

  await writeFile(
    new URL("../convex/data/championCatalog.json", import.meta.url),
    `${JSON.stringify(output, null, 2)}\n`,
    "utf8",
  );
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

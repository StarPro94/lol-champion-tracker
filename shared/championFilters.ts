import type {
  ChampionFilters,
  ChampionListItem,
  ChampionProgressSummary,
} from "./champions";

function normalizedSearchValue(value: string): string {
  return value.trim().toLocaleLowerCase();
}

function normalizedPartype(partype: string): string {
  return partype.trim() === "" ? "None" : partype;
}

function compareByName(left: ChampionListItem, right: ChampionListItem): number {
  return left.name.localeCompare(right.name, undefined, { sensitivity: "base" });
}

export function applyChampionFilters(
  champions: ChampionListItem[],
  filters: ChampionFilters,
): ChampionListItem[] {
  const search = normalizedSearchValue(filters.search);

  const filtered = champions.filter((champion) => {
    if (search !== "") {
      const haystack = [
        champion.name,
        champion.title,
        champion.titleFr,
        champion.tagsFr.join(" "),
        champion.resourceFr,
      ]
        .join(" ")
        .toLocaleLowerCase();
      if (!haystack.includes(search)) {
        return false;
      }
    }

    if (filters.status === "validated" && !champion.isValidated) {
      return false;
    }

    if (filters.status === "unvalidated" && champion.isValidated) {
      return false;
    }

    if (filters.tag !== "all" && !champion.tags.includes(filters.tag)) {
      return false;
    }

    if (
      filters.resource !== "all" &&
      normalizedPartype(champion.partype) !== filters.resource
    ) {
      return false;
    }

    return true;
  });

  return filtered.sort((left, right) => {
    switch (filters.sort) {
      case "name-desc":
        return compareByName(right, left);
      case "recently-validated": {
        const rightTimestamp = right.validatedAt ? Date.parse(right.validatedAt) : -Infinity;
        const leftTimestamp = left.validatedAt ? Date.parse(left.validatedAt) : -Infinity;
        if (rightTimestamp !== leftTimestamp) {
          return rightTimestamp - leftTimestamp;
        }
        return compareByName(left, right);
      }
      case "unvalidated-first":
        if (left.isValidated !== right.isValidated) {
          return Number(left.isValidated) - Number(right.isValidated);
        }
        return compareByName(left, right);
      case "name-asc":
      default:
        return compareByName(left, right);
    }
  });
}

export function computeChampionProgress(
  champions: ChampionListItem[],
): ChampionProgressSummary {
  const validated = champions.filter((champion) => champion.isValidated).length;
  const total = champions.length;
  const percentage = total === 0 ? 0 : Math.round((validated / total) * 100);

  return {
    total,
    validated,
    remaining: total - validated,
    percentage,
  };
}

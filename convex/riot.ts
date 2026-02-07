import { action } from "./_generated/server";
import { v } from "convex/values";

const REGIONS: Record<string, string> = {
  euw1: "europe",
  na1: "americas",
  eun1: "europe",
  kr: "asia",
  br1: "americas",
  la1: "americas",
  la2: "americas",
  oc1: "sea",
  tr1: "europe",
  ru: "europe",
  jp1: "asia",
  me1: "europe",
  ph2: "sea",
  sg2: "sea",
  th2: "sea",
  tw2: "sea",
  vn2: "sea",
};

export const syncRiotHistory = action({
  args: {
    riotApiKey: v.string(),
    summonerName: v.string(),
    region: v.optional(v.string()),
    matchCount: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const region = args.region || "euw1";
    const regional = REGIONS[region] || "europe";
    const count = args.matchCount || 100;

    try {
      // Get summoner
      const summonerRes = await fetch(
        `https://${region}.api.riotgames.com/lol/summoner/v4/summoners/by-name/${encodeURIComponent(args.summonerName)}`,
        { headers: { "X-Riot-Token": args.riotApiKey } }
      );

      if (!summonerRes.ok) {
        const errorText = await summonerRes.text();
        if (summonerRes.status === 404) {
          return { error: "Summoner not found", champions: [] };
        }
        if (summonerRes.status === 403) {
          return { error: "Invalid API key", champions: [] };
        }
        if (summonerRes.status === 429) {
          return { error: "Rate limit exceeded", champions: [] };
        }
        return { error: `Riot API error: ${summonerRes.status}`, champions: [] };
      }

      const summoner = await summonerRes.json();

      // Get match history
      const matchesRes = await fetch(
        `https://${regional}.api.riotgames.com/lol/match/v5/matches/by-puuid/${summoner.puuid}/ids?count=${count}`,
        { headers: { "X-Riot-Token": args.riotApiKey } }
      );

      if (!matchesRes.ok) {
        return { error: "Failed to fetch match history", champions: [] };
      }

      const matches: string[] = await matchesRes.json();

      // Extract champions from matches
      const champions = new Set<string>();
      const championDetails: Array<{ name: string; timestamp: number }> = [];

      for (const matchId of matches) {
        try {
          const matchRes = await fetch(
            `https://${regional}.api.riotgames.com/lol/match/v5/matches/${matchId}`,
            { headers: { "X-Riot-Token": args.riotApiKey } }
          );

          if (!matchRes.ok) continue;

          const match = await matchRes.json();
          const participant = match.info.participants.find(
            (p: any) => p.puuid === summoner.puuid
          );

          if (participant) {
            const champName = participant.championName;
            if (!champions.has(champName)) {
              champions.add(champName);
              championDetails.push({
                name: champName,
                timestamp: match.info.gameCreation,
              });
            }
          }
        } catch (e) {
          // Continue with other matches if one fails
          console.error(`Failed to fetch match ${matchId}:`, e);
        }
      }

      return {
        success: true,
        champions: Array.from(champions),
        summoner: {
          name: summoner.name,
          id: summoner.id,
          puuid: summoner.puuid,
          level: summoner.summonerLevel,
          profileIconId: summoner.profileIconId,
        },
      };
    } catch (error) {
      return {
        error: error instanceof Error ? error.message : "Unknown error",
        champions: [],
      };
    }
  },
});

export const getSummonerByName = action({
  args: {
    riotApiKey: v.string(),
    summonerName: v.string(),
    region: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const region = args.region || "euw1";

    const summonerRes = await fetch(
      `https://${region}.api.riotgames.com/lol/summoner/v4/summoners/by-name/${encodeURIComponent(args.summonerName)}`,
      { headers: { "X-Riot-Token": args.riotApiKey } }
    );

    if (!summonerRes.ok) {
      return { error: `Failed to fetch summoner: ${summonerRes.status}` };
    }

    const summoner = await summonerRes.json();

    return {
      name: summoner.name,
      id: summoner.id,
      puuid: summoner.puuid,
      level: summoner.summonerLevel,
      profileIconId: summoner.profileIconId,
    };
  },
});

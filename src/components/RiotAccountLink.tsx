import React, { useState } from "react";
import "./RiotAccountLink.css";

interface RiotAccountLinkProps {
  onSyncComplete?: (championCount: number) => void;
}

export const RiotAccountLink: React.FC<RiotAccountLinkProps> = ({
  onSyncComplete,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [summonerName, setSummonerName] = useState("");
  const [region, setRegion] = useState("euw1");
  const [apiKey, setApiKey] = useState("");
  const [isSyncing, setIsSyncing] = useState(false);
  const [result, setResult] = useState<{
    success: boolean;
    champions: string[];
    error?: string;
    summoner?: { name: string; level: number; profileIconId: number };
  } | null>(null);

  const regions = [
    { value: "euw1", label: "EU West" },
    { value: "eun1", label: "EU Nordic & East" },
    { value: "na1", label: "North America" },
    { value: "kr", label: "Korea" },
    { value: "br1", label: "Brazil" },
    { value: "la1", label: "Latin America North" },
    { value: "la2", label: "Latin America South" },
    { value: "oc1", label: "Oceania" },
    { value: "ru", label: "Russia" },
    { value: "tr1", label: "Turkey" },
    { value: "jp1", label: "Japan" },
  ];

  // Direct fetch to Riot API via a proxy function
  // Note: In production, this should go through Convex backend
  const handleSync = async () => {
    if (!summonerName.trim() || !apiKey.trim()) {
      setResult({ success: false, champions: [], error: "Please fill in all fields" });
      return;
    }

    setIsSyncing(true);
    setResult(null);

    try {
      // For now, we'll call a proxy endpoint or show instructions
      // In a real setup, this would go through Convex actions
      const response = await fetchRiotHistory(apiKey, summonerName.trim(), region, 100);
      setResult(response);

      if (response.success && response.champions.length > 0) {
        onSyncComplete?.(response.champions.length);
      }
    } catch (error) {
      setResult({
        success: false,
        champions: [],
        error: error instanceof Error ? error.message : "Unknown error",
      });
    } finally {
      setIsSyncing(false);
    }
  };

  const fetchRiotHistory = async (
    riotApiKey: string,
    summonerName: string,
    region: string,
    matchCount: number
  ) => {
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
    };

    const regional = REGIONS[region] || "europe";

    try {
      // Get summoner
      const summonerRes = await fetch(
        `https://${region}.api.riotgames.com/lol/summoner/v4/summoners/by-name/${encodeURIComponent(summonerName)}`,
        { headers: { "X-Riot-Token": riotApiKey } }
      );

      if (!summonerRes.ok) {
        if (summonerRes.status === 404) {
          return { error: "Summoner not found", champions: [], success: false };
        }
        if (summonerRes.status === 403) {
          return { error: "Invalid API key", champions: [], success: false };
        }
        if (summonerRes.status === 429) {
          return { error: "Rate limit exceeded", champions: [], success: false };
        }
        return { error: `Riot API error: ${summonerRes.status}`, champions: [], success: false };
      }

      const summoner = await summonerRes.json();

      // Get match history
      const matchesRes = await fetch(
        `https://${regional}.api.riotgames.com/lol/match/v5/matches/by-puuid/${summoner.puuid}/ids?count=${matchCount}`,
        { headers: { "X-Riot-Token": riotApiKey } }
      );

      if (!matchesRes.ok) {
        return { error: "Failed to fetch match history", champions: [], success: false };
      }

      const matches: string[] = await matchesRes.json();

      // Extract champions from matches
      const champions = new Set<string>();
      const championDetails: Array<{ name: string; timestamp: number }> = [];

      for (const matchId of matches) {
        try {
          const matchRes = await fetch(
            `https://${regional}.api.riotgames.com/lol/match/v5/matches/${matchId}`,
            { headers: { "X-Riot-Token": riotApiKey } }
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
          console.error(`Failed to fetch match ${matchId}:`, e);
        }
      }

      return {
        success: true,
        champions: Array.from(champions),
        summoner: {
          name: summoner.name,
          level: summoner.summonerLevel,
          profileIconId: summoner.profileIconId,
        },
      };
    } catch (error) {
      return {
        success: false,
        champions: [],
        error: error instanceof Error ? error.message : "Unknown error",
      };
    }
  };

  if (!isOpen) {
    return (
      <button
        type="button"
        className="riot-link-trigger"
        onClick={() => setIsOpen(true)}
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
          <path
            d="M12 2L2 7L12 12L22 7L12 2Z"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M2 17L12 22L22 17"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M2 12L12 17L22 12"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        Import from Riot
      </button>
    );
  }

  return (
    <div className="riot-link-modal-overlay" onClick={() => setIsOpen(false)}>
      <div className="riot-link-modal" onClick={(e) => e.stopPropagation()}>
        <button
          type="button"
          className="riot-link-close"
          onClick={() => setIsOpen(false)}
          aria-label="Close"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path
              d="M18 6L6 18M6 6L18 18"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        </button>

        <h2 className="riot-link-title">Import Match History</h2>
        <p className="riot-link-subtitle">
          Automatically mark champions as played from your Riot Games match history
        </p>

        <div className="riot-link-form">
          <div className="riot-link-field">
            <label htmlFor="summoner-name">Summoner Name</label>
            <input
              id="summoner-name"
              type="text"
              value={summonerName}
              onChange={(e) => setSummonerName(e.target.value)}
              placeholder="e.g., Hide on bush"
              className="riot-link-input"
            />
          </div>

          <div className="riot-link-field">
            <label htmlFor="region">Region</label>
            <select
              id="region"
              value={region}
              onChange={(e) => setRegion(e.target.value)}
              className="riot-link-select"
            >
              {regions.map((r) => (
                <option key={r.value} value={r.value}>
                  {r.label}
                </option>
              ))}
            </select>
          </div>

          <div className="riot-link-field">
            <label htmlFor="api-key">Riot API Key</label>
            <input
              id="api-key"
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="Enter your Riot Games API key"
              className="riot-link-input"
            />
            <p className="riot-link-help">
              Get your API key from{" "}
              <a
                href="https://developer.riotgames.com/"
                target="_blank"
                rel="noopener noreferrer"
              >
                developer.riotgames.com
              </a>
            </p>
          </div>

          <button
            type="button"
            className="riot-link-submit"
            onClick={handleSync}
            disabled={isSyncing || !summonerName.trim() || !apiKey.trim()}
          >
            {isSyncing ? "Syncing..." : "Import Match History"}
          </button>
        </div>

        {result && (
          <div className={`riot-link-result ${result.success ? "success" : "error"}`}>
            {result.success ? (
              <>
                {result.summoner && (
                  <div className="riot-summoner-info">
                    <img
                      src={`https://ddragon.leagueoflegends.com/cdn/14.1.1/img/profileicon/${result.summoner.profileIconId}.png`}
                      alt=""
                      className="riot-summoner-icon"
                    />
                    <div>
                      <div className="riot-summoner-name">{result.summoner.name}</div>
                      <div className="riot-summoner-level">Level {result.summoner.level}</div>
                    </div>
                  </div>
                )}
                <p className="riot-result-message">
                  Found {result.champions.length} champions played in your match history!
                </p>
                <p className="riot-result-note">
                  Sign in to automatically add them to your collection.
                </p>
              </>
            ) : (
              <p className="riot-result-message">{result.error}</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

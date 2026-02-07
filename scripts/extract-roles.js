// Script pour extraire les rôles lane depuis CommunityDragon
// Node.js script - run with: node scripts/extract-roles.js

const https = require('https');

const URL = 'https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/v1/champion-rune-recommendations.json';

// Mapping des championId vers championId (Data Dragon utilise des string IDs comme "Aatrox", "1", etc.)
// On a besoin de fetch champions depuis Data Dragon pour faire le mapping

function httpsGet(url) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        try {
          resolve(JSON.parse(data));
        } catch (e) {
          reject(e);
        }
      });
    }).on('error', reject);
  });
}

async function main() {
  console.log('Fetching versions...');
  const versions = await httpsGet('https://ddragon.leagueoflegends.com/api/versions.json');
  const latestVersion = versions[0];
  console.log('Latest version:', latestVersion);

  console.log('Fetching champions from Data Dragon...');
  const championData = await httpsGet(`https://ddragon.leagueoflegends.com/cdn/${latestVersion}/data/en_US/champion.json`);

  // Créer un mapping championId (number) -> championId (string)
  const idToKey = {};
  Object.values(championData.data).forEach((champ) => {
    idToKey[champ.key] = champ.id;
  });

  console.log('Fetching champion positions from CommunityDragon...');
  const recommendations = await httpsGet(URL);

  // Extraire les positions uniques par champion (mapId: 11 = Summoner's Rift)
  const championPositions = {};

  recommendations.forEach((item) => {
    const champKey = idToKey[item.championId];
    if (!champKey) {
      console.warn(`No key found for championId ${item.championId}`);
      return;
    }

    if (!championPositions[champKey]) {
      championPositions[champKey] = new Set();
    }

    item.runeRecommendations.forEach((rec) => {
      // Ne prendre que les positions pour Summoner's Rift (mapId: 11)
      // et ignorer "NONE"
      if (rec.mapId === 11 && rec.position !== 'NONE') {
        championPositions[champKey].add(rec.position);
      }
    });
  });

  // Convertir Sets en Arrays
  const result = {};
  Object.keys(championPositions).forEach((champKey) => {
    const positions = Array.from(championPositions[champKey]).sort();
    result[champKey] = positions;
  });

  console.log('\n=== CHAMPION POSITIONS ===\n');
  console.log(JSON.stringify(result, null, 2));

  // Stats
  const totalChamps = Object.keys(result).length;
  const positionsCount = { TOP: 0, JUNGLE: 0, MID: 0, BOT: 0, SUPPORT: 0, FILL: 0 };
  Object.values(result).forEach((positions) => {
    positions.forEach((pos) => {
      if (positionsCount[pos] !== undefined) {
        positionsCount[pos]++;
      }
    });
  });

  console.log('\n=== STATS ===');
  console.log(`Total champions with positions: ${totalChamps}`);
  console.log('Positions distribution:', positionsCount);
}

main().catch(console.error);

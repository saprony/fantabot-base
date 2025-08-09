// scripts/fetch-odds.js (CommonJS)
const fs = require('fs');
const path = require('path');

const ROOT = process.cwd();
const OUT = path.join(ROOT, 'data', 'odds_next.json');

const TEAM_MAP = {
  "Inter Milan": "Inter",
  "AC Milan": "Milan",
  "SS Lazio": "Lazio",
  "AS Roma": "Roma",
  "Hellas Verona": "Verona"
};
function normTeam(name) { return TEAM_MAP[name] || name; }

function oddsToProbs(oh, od, oa) {
  const invH = 1/oh, invD = 1/od, invA = 1/oa;
  const sum = invH + invD + invA;
  return {
    p_home: +(invH/sum).toFixed(4),
    p_draw: +(invD/sum).toFixed(4),
    p_away: +(invA/sum).toFixed(4)
  };
}

(async () => {
  try {
    const API_KEY = process.env.ODDS_API_KEY;
    if (!API_KEY) throw new Error('Manca ODDS_API_KEY');

    const sport = 'soccer_italy_serie_a';
    const market = 'h2h';
    const region = 'eu';
    const oddsFormat = 'decimal';
    const url = `https://api.the-odds-api.com/v4/sports/${sport}/odds/?regions=${region}&markets=${market}&oddsFormat=${oddsFormat}&apiKey=${API_KEY}`;

    const res = await fetch(url);
    if (!res.ok) {
      console.error('[fetch-odds] HTTP', res.status, await res.text());
      process.exit(1);
    }
    const data = await res.json();

    const rows = [];
    for (const ev of data) {
      const homeRaw = ev?.home_team;
      const awayRaw = ev?.away_team;
      if (!homeRaw || !awayRaw) continue;

      const home = normTeam(homeRaw);
      const away = normTeam(awayRaw);

      const agg = { home: [], draw: [], away: [] };
      for (const bk of ev.bookmakers || []) {
        const mkt = (bk.markets || []).find(m => m.key === 'h2h');
        if (!mkt) continue;
        const outs = mkt.outcomes || [];
        const priceHome = outs.find(o => o.name === ev.home_team)?.price;
        const priceDraw = outs.find(o => /draw/i.test(o.name))?.price;
        const priceAway = outs.find(o => o.name === ev.away_team)?.price;
        if (priceHome && priceDraw && priceAway) {
          agg.home.push(priceHome);
          agg.draw.push(priceDraw);
          agg.away.push(priceAway);
        }
      }
      if (!agg.home.length) continue;

      const mean = arr => arr.reduce((s,v)=>s+v,0)/arr.length;
      const oh = mean(agg.home);
      const od = mean(agg.draw);
      const oa = mean(agg.away);

      rows.push({ home, away, ...oddsToProbs(oh, od, oa), src: 'TheOddsAPI(avg)' });
    }

    fs.mkdirSync(path.dirname(OUT), { recursive: true });
    fs.writeFileSync(OUT, JSON.stringify(rows, null, 2), 'utf8');
    console.log(`[fetch-odds] Salvate ${rows.length} partite in ${OUT}`);
  } catch (e) {
    console.error('[fetch-odds] ERRORE:', e.message);
    process.exit(1);
  }
})();

// scripts/publish-top5.js (CommonJS) – genera public/data/top5.json
const fs = require("fs");
const path = require("path");

const ROOT = process.cwd();
const INPUT_PLAYERS  = path.join(ROOT, "data", "giocatori_2025_26.json");
const INPUT_FIXTURES = path.join(ROOT, "data", "fixtures_next.json");
const INPUT_RATINGS  = path.join(ROOT, "data", "team_ratings.json");        // fallback difficoltà
const INPUT_ODDS     = path.join(ROOT, "data", "odds_next.json");            // lo carichi tu ogni settimana
const OUTPUT_FILE    = path.join(ROOT, "public", "data", "top5.json");

// ---------- Normalizzazione nomi squadra (stessa del publish-formation) ----------
const TEAM_ALIAS_MAP = {
  "internazionale": "Inter", "inter milan": "Inter", "fc internazionale": "Inter",
  "ac milan": "Milan", "a.c. milan": "Milan",
  "juventus fc": "Juventus",
  "ss lazio": "Lazio", "s.s. lazio": "Lazio",
  "as roma": "Roma", "a.s. roma": "Roma",
  "ssc napoli": "Napoli", "s.s.c. napoli": "Napoli",
  "hellas verona": "Verona",
  "udinese calcio": "Udinese",
  "atalanta bc": "Atalanta",
  "bologna fc": "Bologna",
  "genoa cfc": "Genoa",
  "torino fc": "Torino",
  "acf fiorentina": "Fiorentina",
  "us sassuolo": "Sassuolo", "u.s. sassuolo": "Sassuolo",
  "us lecce": "Lecce", "u.s. lecce": "Lecce",
  "cagliari calcio": "Cagliari",
  "como 1907": "Como",
  "ac monza": "Monza",
  "parma calcio 1913": "Parma",
  "pisa sc": "Pisa",
  "us cremonese": "Cremonese"
};
function canonical(s){
  return (s||"").normalize("NFD").replace(/[\u0300-\u036f]/g,"")
    .toLowerCase().replace(/[^a-z0-9\s]/g," ").replace(/\s+/g," ").trim();
}
function normalizeTeamName(s){
  const c = canonical(s); if(!c) return s;
  if (TEAM_ALIAS_MAP[c]) return TEAM_ALIAS_MAP[c];
  let w = c.replace(/\b(ac|fc|u\.?s\.?|ss|ssc|as|a\.s\.)\b/g," ")
           .replace(/\bcalcio\b/g," ").replace(/\bfootball club\b/g," ")
           .replace(/\bclub\b/g," ").replace(/\bcfc\b/g," ")
           .replace(/\bbc\b/g," ").replace(/\b1907\b/g," ").replace(/\b1913\b/g," ")
           .replace(/\s+/g," ").trim();
  if (TEAM_ALIAS_MAP[w]) return TEAM_ALIAS_MAP[w];
  return w.split(" ").map(t=>t.charAt(0).toUpperCase()+t.slice(1)).join(" ");
}

// ---------- Helper ----------
function readJSON(p){ if(!fs.existsSync(p)) throw new Error(`File non trovato: ${p}`); return JSON.parse(fs.readFileSync(p,"utf8")); }
const clamp01 = (v)=>Math.max(0,Math.min(1,v));
const num = (x)=> (typeof x==="number"?x:parseFloat(String(x).replace(",","."))||0);

// Difficoltà: usa prima le odds (che carichi tu), altrimenti Elo
const DEFAULT_RATING=1550, HOME_ADVANTAGE=60, ELO_DIVISOR=400;
function eloWinProb(rA,rB){ return 1/(1+Math.pow(10,(rB-rA)/ELO_DIVISOR)); }
function probToDifficulty(pWin){ const d=1+4*(1-pWin); return Math.min(5,Math.max(1,Math.round(d))); }

// ---------- Core ----------
function enrichPlayersWithScore(players, fixturesByTeam, ratings, oddsMap){
  if(!Array.isArray(players)) return [];

  const prices = players.map(p=>num(p["Qt. Attuale"]??0));
  const minPrice=Math.min(...prices,0), maxPrice=Math.max(...prices,1);
  const priceSpan=Math.max(1, maxPrice-minPrice);

  const trendsRaw = players.map(p=> num(p["Qt. Attuale"]??0)-num(p["Qt. Iniziale"]??0));
  const minTrend=Math.min(...trendsRaw,0), maxTrend=Math.max(...trendsRaw,1);
  const trendSpan=Math.max(1, maxTrend-minTrend);

  const WEIGHTS = {
    P:{ price:0.15, trend:0.25, diff:0.50, home:0.10 },
    D:{ price:0.15, trend:0.30, diff:0.45, home:0.10 },
    C:{ price:0.20, trend:0.35, diff:0.35, home:0.10 },
    A:{ price:0.20, trend:0.40, diff:0.30, home:0.10 }
  };

  function computeDifficulty(team, opp, homeAway){
    if(oddsMap){
      const key = homeAway==='H' ? `${team}|||${opp}` : `${opp}|||${team}`;
      const rec = oddsMap.get(key);
      if(rec){
        const pWin = homeAway==='H' ? rec.p_home : rec.p_away;
        return probToDifficulty(pWin);
      }
    }
    const rT = ratings[team]??DEFAULT_RATING;
    const rO = ratings[opp] ??DEFAULT_RATING;
    const rAdj = rT + (homeAway==='H'?HOME_ADVANTAGE:0);
    return probToDifficulty( eloWinProb(rAdj, rO) );
  }

  const out = players.map(p=>{
    const ruolo = (p.Ruolo||"").trim().toUpperCase().slice(0,1);
    const squadra = normalizeTeamName(p.Squadra||"");
    const price = num(p["Qt. Attuale"]??0);
    const init  = num(p["Qt. Iniziale"]??0);
    const trend = price-init;

    const fx = fixturesByTeam[squadra]||null;
    const ha = fx?.homeAway==='H' ? 1 : (fx?.homeAway==='A' ? 0 : 0.5);
    const diff = fx ? computeDifficulty(squadra, fx.opponent, fx.homeAway) : 3;

    const priceN = clamp01((price-minPrice)/priceSpan);
    const trendN = clamp01((trend-minTrend)/trendSpan);
    const diffN  = 1 - clamp01((diff-1)/4);

    const w = WEIGHTS[ruolo] || WEIGHTS.C;
    let score = w.price*priceN + w.trend*trendN + w.diff*diffN + w.home*ha;
    if(ruolo==='P') score *= 0.95 + 0.1*diffN;
    if(ruolo==='A') score *= 0.98 + 0.12*trendN;

    return { ...p, ruolo, squadra, _meta:{diff,ha,price,init,trend}, score:+score.toFixed(6) };
  });

  // warning squadre senza fixtures
  const setTeams = new Set(out.map(pp=>pp.squadra).filter(Boolean));
  const missing = Array.from(setTeams).filter(t=>!fixturesByTeam[t]);
  if(missing.length) console.log("[WARN] Squadre senza fixture (normalizzate):", missing);

  return out;
}

function minify(p){ return { Nome: p.Nome, Ruolo: p.Ruolo, Squadra: p.Squadra, Score: +(p.score??0).toFixed(4) }; }

(async()=>{
  try{
    const players  = readJSON(INPUT_PLAYERS);
    const fixtures = readJSON(INPUT_FIXTURES);
    const ratings  = fs.existsSync(INPUT_RATINGS)? readJSON(INPUT_RATINGS) : {};
    const oddsArr  = fs.existsSync(INPUT_ODDS)?   readJSON(INPUT_ODDS)   : null;

    const fixturesByTeam = {};
    for(const x of fixtures){
      const team = normalizeTeamName(x.team);
      const opp  = normalizeTeamName(x.opponent);
      fixturesByTeam[team] = { opponent: opp, homeAway: x.homeAway };
    }

    let oddsMap = null;
    if(Array.isArray(oddsArr)){
      oddsMap = new Map();
      for(const m of oddsArr){
        const key = `${normalizeTeamName(m.home)}|||${normalizeTeamName(m.away)}`;
        // accetta probabilità o quote già convertite a monte
        if(typeof m.p_home === "number" && typeof m.p_away === "number"){
          oddsMap.set(key, { p_home:m.p_home, p_away:m.p_away });
        } else if (m.odds_home && m.odds_draw && m.odds_away){
          const invH=1/m.odds_home, invD=1/m.odds_draw, invA=1/m.odds_away;
          const sum=invH+invD+invA;
          oddsMap.set(key, { p_home:invH/sum, p_away:invA/sum });
        }
      }
    }

    console.log('[TOP5] players:', Array.isArray(players)?players.length:'N/A', 'fixtures:', fixtures.length);
    const enriched = enrichPlayersWithScore(players, fixturesByTeam, ratings, oddsMap);
    const top5 = enriched.sort((a,b)=>b.score-a.score).slice(0,5).map(minify);

    const payload = { publishedAt: new Date().toISOString(), items: top5 };
    fs.mkdirSync(path.dirname(OUTPUT_FILE), { recursive:true });
    fs.writeFileSync(OUTPUT_FILE, JSON.stringify(payload,null,2), "utf8");
    console.log(`[TOP5] scritto: ${OUTPUT_FILE}`);
  }catch(e){
    console.error('[TOP5] ERRORE:', e.message);
    process.exit(1);
  }
})();

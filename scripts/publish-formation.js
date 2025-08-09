#!/usr/bin/env node
const fs = require("fs");
const path = require("path");

const ROOT = process.cwd();
const INPUT_PLAYERS = path.join(ROOT, "data", "giocatori_2025_26.json");
const INPUT_FIXTURES = path.join(ROOT, "data", "fixtures_next.json");
const INPUT_RATINGS = path.join(ROOT, "data", "team_ratings.json");
const INPUT_ODDS = path.join(ROOT, "data", "odds_next.json");
const OUTPUT_FILE = path.join(ROOT, "public", "data", "formazione_published.json");

const FORMATIONS = [
  { P:1, D:4, C:3, A:3, label: "4-3-3" },
  { P:1, D:3, C:4, A:3, label: "3-4-3" },
];

// --- Normalizzazione nomi squadra ---
const TEAM_ALIAS_MAP = {
  "internazionale": "Inter",
  "inter milan": "Inter",
  "fc internazionale": "Inter",
  "ac milan": "Milan",
  "a.c. milan": "Milan",
  "juventus fc": "Juventus",
  "ss lazio": "Lazio",
  "s.s. lazio": "Lazio",
  "as roma": "Roma",
  "a.s. roma": "Roma",
  "ssc napoli": "Napoli",
  "s.s.c. napoli": "Napoli",
  "hellas verona": "Verona",
  "udinese calcio": "Udinese",
  "atalanta bc": "Atalanta",
  "bologna fc": "Bologna",
  "genoa cfc": "Genoa",
  "torino fc": "Torino",
  "acf fiorentina": "Fiorentina",
  "us sassuolo": "Sassuolo",
  "u.s. sassuolo": "Sassuolo",
  "us lecce": "Lecce",
  "u.s. lecce": "Lecce",
  "cagliari calcio": "Cagliari",
  "como 1907": "Como",
  "ac monza": "Monza",
  "parma calcio 1913": "Parma",
  "pisa sc": "Pisa",
  "us cremonese": "Cremonese"
};
function canonical(s) {
  return (s || "")
    .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}
function normalizeTeamName(s) {
  const c = canonical(s);
  if (!c) return s;
  if (TEAM_ALIAS_MAP[c]) return TEAM_ALIAS_MAP[c];
  let w = c
    .replace(/\b(ac|fc|u\.?s\.?|ss|ssc|as|a\.s\.)\b/g, " ")
    .replace(/\bcalcio\b/g, " ")
    .replace(/\bfootball club\b/g, " ")
    .replace(/\bclub\b/g, " ")
    .replace(/\bcfc\b/g, " ")
    .replace(/\bbc\b/g, " ")
    .replace(/\b1907\b/g, " ")
    .replace(/\b1913\b/g, " ")
    .replace(/\s+/g, " ").trim();
  if (TEAM_ALIAS_MAP[w]) return TEAM_ALIAS_MAP[w];
  return w.split(" ").map(t => t.charAt(0).toUpperCase() + t.slice(1)).join(" ");
}

// ---- Time helpers ----
function getRomeNow() {
  const parts = new Intl.DateTimeFormat('it-IT', {
    timeZone: 'Europe/Rome', year: 'numeric', month: '2-digit', day: '2-digit',
    hour: '2-digit', minute:'2-digit', hour12:false
  }).formatToParts(new Date());
  const m = Object.fromEntries(parts.map(p=>[p.type,p.value]));
  return { y:m.year, M:m.month, d:m.day, h:m.hour, min:m.minute };
}
function shouldRunNowRome() {
  const { y,M,d,h,min } = getRomeNow();
  const weekday = new Date(`${y}-${M}-${d}T${h}:${min}:00`).toLocaleString('it-IT',{weekday:'short', timeZone:'Europe/Rome'}).toLowerCase();
  return weekday.startsWith('ven') && Number(h) === 9 && Number(min) <= 15;
}

// ---- IO helpers ----
function readJSON(p) {
  if (!fs.existsSync(p)) throw new Error(`File non trovato: ${p}`);
  return JSON.parse(fs.readFileSync(p, "utf8"));
}

// ---- Odds / Ratings helpers ----
const DEFAULT_RATING = 1550;
const HOME_ADVANTAGE = 60;
const ELO_DIVISOR = 400;
function eloWinProb(rA, rB) { return 1 / (1 + Math.pow(10, (rB - rA) / ELO_DIVISOR)); }
function probToDifficulty(pWin) {
  const d = 1 + 4*(1 - pWin);
  return Math.min(5, Math.max(1, Math.round(d)));
}

// ---- Scoring ----
const clamp01 = (v) => Math.max(0, Math.min(1, v));
const num = (x) => (typeof x === "number" ? x : parseFloat(String(x).replace(",", ".")) || 0);

function enrichPlayersWithScore(players, fixturesByTeam, ratings, oddsMap) {
  if (!Array.isArray(players)) return [];

  const prices = players.map(p => num(p["Qt. Attuale"] ?? p.qtAttuale ?? 0));
  const minPrice = Math.min(...prices, 0), maxPrice = Math.max(...prices, 1);
  const priceSpan = Math.max(1, maxPrice - minPrice);

  const trendsRaw = players.map(p => num(p["Qt. Attuale"] ?? 0) - num(p["Qt. Iniziale"] ?? 0));
  const minTrend = Math.min(...trendsRaw, 0), maxTrend = Math.max(...trendsRaw, 1);
  const trendSpan = Math.max(1, maxTrend - minTrend);

  const WEIGHTS = {
    P: { price: 0.15, trend: 0.25, diff: 0.50, home: 0.10 },
    D: { price: 0.15, trend: 0.30, diff: 0.45, home: 0.10 },
    C: { price: 0.20, trend: 0.35, diff: 0.35, home: 0.10 },
    A: { price: 0.20, trend: 0.40, diff: 0.30, home: 0.10 },
  };

  function computeDifficulty(team, opp, homeAway) {
    if (oddsMap) {
      const key = homeAway === 'H' ? `${team}|||${opp}` : `${opp}|||${team}`;
      const rec = oddsMap.get(key);
      if (rec) {
        const pWin = homeAway === 'H' ? rec.p_home : rec.p_away;
        return probToDifficulty(pWin);
      }
    }
    const rTeam = ratings[team] ?? DEFAULT_RATING;
    const rOpp  = ratings[opp]  ?? DEFAULT_RATING;
    const rAdj = rTeam + (homeAway === 'H' ? HOME_ADVANTAGE : 0);
    return probToDifficulty(eloWinProb(rAdj, rOpp));
  }

  const out = players.map(p => {
    const ruolo = (p.Ruolo || p.ruolo || "").trim().toUpperCase().slice(0,1);
    const squadra = normalizeTeamName((p.Squadra || p.squadra || "").trim());
    const price = num(p["Qt. Attuale"] ?? p.qtAttuale ?? 0);
    const init  = num(p["Qt. Iniziale"] ?? p.qtIniziale ?? 0);
    const trend = price - init;

    const fx = fixturesByTeam[squadra] || null;
    const ha = fx?.homeAway === 'H' ? 1 : (fx?.homeAway === 'A' ? 0 : 0.5);
    const diff = fx ? computeDifficulty(squadra, fx.opponent, fx.homeAway) : 3;

    const priceN = clamp01((price - minPrice) / priceSpan);
    const trendN = clamp01((trend - minTrend) / trendSpan);
    const diffN  = 1 - clamp01((diff - 1) / 4);

    const w = WEIGHTS[ruolo] || WEIGHTS.C;
    let base = w.price*priceN + w.trend*trendN + w.diff*diffN + w.home*ha;
    if (ruolo === 'P') base *= 0.95 + 0.1*diffN;
    if (ruolo === 'A') base *= 0.98 + 0.12*trendN;

    return { ...p, ruolo, squadra, _meta:{ price, init, trend, diff, ha, priceN, trendN, diffN }, score: +base.toFixed(6) };
  });

  // Log diagnostico squadre senza fixture
  const setTeams = new Set(out.map(pp => pp.squadra).filter(Boolean));
  const missing = Array.from(setTeams).filter(t => !fixturesByTeam[t]);
  if (missing.length) console.log("[WARN] Squadre senza fixture (normalizzate):", missing);

  return out;
}

function pickXI(enriched, f) {
  const byRole = { P:[], D:[], C:[], A:[] };
  for (const p of enriched) if (byRole[p.ruolo]) byRole[p.ruolo].push(p);
  Object.values(byRole).forEach(arr => arr.sort((a,b)=>b.score - a.score));
  const starters = [...byRole.P.slice(0,f.P), ...byRole.D.slice(0,f.D), ...byRole.C.slice(0,f.C), ...byRole.A.slice(0,f.A)];
  const picked = new Set(starters.map(p => p.Nome || p.nome));
  const bench = enriched.filter(p => !picked.has(p.Nome || p.nome)).sort((a,b)=>b.score-a.score).slice(0,7);
  const totalScore = starters.reduce((s,p)=>s+p.score,0);
  return { starters, bench, totalScore };
}
function pickBestFormation(enriched){ let best=null; for(const f of FORMATIONS){ const res=pickXI(enriched,f); if(!best||res.totalScore>best.totalScore){ best={...res, formation:f}; } } return best; }
function minify(p){ return { Nome: p.Nome || p.nome, Ruolo: p.Ruolo || p.ruolo, Squadra: p.Squadra || p.squadra, Score: +(p.score??0).toFixed(4) }; }

(async () => {
  try {
    const FORCE = process.argv.slice(2).includes("--force");
    if (!FORCE && !shouldRunNowRome()) {
      console.log("[publish-formation] Fuori finestra (Venerdì 09:00 Europe/Rome). Usa --force per forzare.");
      process.exit(0);
    }

    const players = readJSON(INPUT_PLAYERS);
    const fixtures = readJSON(INPUT_FIXTURES);
    const ratings = fs.existsSync(INPUT_RATINGS) ? readJSON(INPUT_RATINGS) : {};
    const oddsArr = fs.existsSync(INPUT_ODDS) ? readJSON(INPUT_ODDS) : null;

    const fixturesByTeam = {};
    for (const x of fixtures) {
      const team = normalizeTeamName(x.team);
      const opp  = normalizeTeamName(x.opponent);
      fixturesByTeam[team] = { opponent: opp, homeAway: x.homeAway };
    }

    let oddsMap = null;
    if (Array.isArray(oddsArr)) {
      oddsMap = new Map();
      for (const m of oddsArr) {
        const key = `${m.home}|||${m.away}`;
        if (typeof m.p_home === "number" && typeof m.p_away === "number") oddsMap.set(key, { p_home:m.p_home, p_away:m.p_away });
      }
    }

    console.log('[DEBUG] players count =', Array.isArray(players)?players.length:'N/A');
    console.log('[DEBUG] fixtures count =', Array.isArray(fixtures)?fixtures.length:'N/A');

    const enriched = enrichPlayersWithScore(players, fixturesByTeam, ratings, oddsMap);
    if (!enriched.length) throw new Error("Nessun giocatore trovato.");

    const best = pickBestFormation(enriched);
    if (!best) throw new Error("Impossibile determinare la miglior formazione.");

    const payload = {
      publishedAt: new Date().toISOString(),
      module: best.formation.label,
      starters: best.starters.map(minify),
      bench: best.bench.map(minify),
    };

    fs.mkdirSync(path.dirname(OUTPUT_FILE), { recursive: true });
    fs.writeFileSync(OUTPUT_FILE, JSON.stringify(payload, null, 2), "utf8");
    console.log(`[publish-formation] Scrittura completata: ${OUTPUT_FILE}`);
  } catch (err) {
    console.error("[publish-formation] ERRORE:", err.message);
    process.exit(1);
  }
})();

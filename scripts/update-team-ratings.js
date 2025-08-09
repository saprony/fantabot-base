// scripts/update-team-ratings.js (CommonJS)
const fs = require('fs');
const path = require('path');

const ROOT = process.cwd();
const OUT = path.join(ROOT, 'data', 'team_ratings.json');
const FIXTURES = path.join(ROOT, 'data', 'fixtures_next.json');

const NAME_MAP = {
  'Internazionale': 'Inter',
  'Inter Milan': 'Inter',
  'AC Milan': 'Milan',
  'A.C. Milan': 'Milan',
  'Juventus FC': 'Juventus',
  'SS Lazio': 'Lazio',
  'S.S. Lazio': 'Lazio',
  'AS Roma': 'Roma',
  'A.S. Roma': 'Roma',
  'Hellas Verona': 'Verona',
  'US Sassuolo': 'Sassuolo',
  'U.S. Sassuolo': 'Sassuolo',
  'Genoa CFC': 'Genoa',
  'Torino FC': 'Torino',
  'ACF Fiorentina': 'Fiorentina',
  'Udinese Calcio': 'Udinese',
  'Atalanta BC': 'Atalanta',
  'Bologna FC': 'Bologna',
  'US Lecce': 'Lecce',
  'U.S. Lecce': 'Lecce',
  'Cagliari Calcio': 'Cagliari',
  'SSC Napoli': 'Napoli',
  'S.S.C. Napoli': 'Napoli',
  'US Cremonese': 'Cremonese',
  'Como 1907': 'Como',
  'AC Monza': 'Monza',
  'Parma Calcio 1913': 'Parma',
  'Pisa SC': 'Pisa'
};

function normTeam(name) { return NAME_MAP[name] || name; }

function parseCSV(text) {
  const lines = text.trim().split(/\r?\n/);
  const header = lines.shift().split(',');
  return lines.map(line => {
    const cols = line.split(',');
    const obj = {};
    header.forEach((h, i) => obj[h.trim()] = (cols[i] ?? '').trim());
    return obj;
  });
}

function loadNeededTeams() {
  try {
    const raw = fs.readFileSync(FIXTURES, 'utf8');
    const fx = JSON.parse(raw);
    const set = new Set();
    fx.forEach(m => { set.add(m.team); set.add(m.opponent); });
    return Array.from(set);
  } catch { return null; }
}

function todayRomeISO() {
  const parts = new Intl.DateTimeFormat('it-IT', {
    timeZone: 'Europe/Rome',
    year: 'numeric', month: '2-digit', day: '2-digit'
  }).formatToParts(new Date());
  const map = Object.fromEntries(parts.map(p => [p.type, p.value]));
  return `${map.year}-${map.month}-${map.day}`;
}

(async () => {
  try {
    const date = todayRomeISO();
    const url = `http://api.clubelo.com/${date}`;
    console.log('[update-team-ratings] scarico:', url);

    const res = await fetch(url);
    if (!res.ok) {
      console.error('[update-team-ratings] HTTP', res.status, await res.text());
      process.exit(1);
    }
    const csv = await res.text();
    const rows = parseCSV(csv);

    const needed = loadNeededTeams();
    const ratings = {};

    for (const r of rows) {
      const club = normTeam(r.Club || '');
      const country = (r.Country || '').toUpperCase();
      const elo = Number(r.Elo);
      if (!elo || !club) continue;

      const isITA = country === 'ITA' || country === 'IT';
      const neededMatch = !needed || needed.includes(club);
      if ((isITA || neededMatch) && neededMatch) ratings[club] = Math.round(elo);
    }

    if (needed) {
      for (const t of needed) {
        if (!ratings[t]) {
          const alt = Object.entries(NAME_MAP).find(([, v]) => v === t)?.[0];
          if (alt) {
            const hit = rows.find(row => (row.Club || '').trim() === alt);
            if (hit && hit.Elo) ratings[t] = Math.round(Number(hit.Elo));
          }
        }
      }
    }

    fs.mkdirSync(path.dirname(OUT), { recursive: true });
    fs.writeFileSync(OUT, JSON.stringify(ratings, null, 2), 'utf8');
    console.log(`[update-team-ratings] scritto ${Object.keys(ratings).length} squadre in ${OUT}`);
  } catch (e) {
    console.error('[update-team-ratings] ERRORE:', e.message);
    process.exit(1);
  }
})();

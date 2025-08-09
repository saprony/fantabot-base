// scripts/updateStoricoPrevisioni.js

const fs = require('fs');
const path = require('path');

// Percorso al file JSON
const filePath = path.join(__dirname, '../public/data/storico_previsioni.json');

// Simula il recupero di dati da fonti esterne
function recuperaDatiSimulati() {
  const oggi = new Date().toISOString().split('T')[0];
  return {
    giornata: 1,
    data: oggi,
    magnifici5: {
      P: [
        {
          nome: "Di Gregorio",
          squadra: "Juventus",
          previsto_da: "FantaBot",
          rendimento_effettivo: null,
          fonte_dati: "Fantacalcio.it"
        }
      ],
      D: [],
      C: [],
      A: [],
      underdog: {
        nome: "Soulé",
        ruolo: "C",
        squadra: "Frosinone",
        previsto_da: "FantaBot",
        rendimento_effettivo: null,
        fonte_dati: "SOSFanta"
      }
    },
    formazione_consigliata: [],
    osservati_speciali: []
  };
}

// Carica dati esistenti, aggiunge nuova giornata e salva
function aggiornaStorico() {
  let storico = [];

  if (fs.existsSync(filePath)) {
    const data = fs.readFileSync(filePath, 'utf8');
    storico = JSON.parse(data);
  }

  const nuoviDati = recuperaDatiSimulati();

  // Evita di duplicare giornate
  const giaInserito = storico.some(g => g.giornata === nuoviDati.giornata);
  if (!giaInserito) {
    storico.push(nuoviDati);
    fs.writeFileSync(filePath, JSON.stringify(storico, null, 2), 'utf8');
    console.log(`✅ Giornata ${nuoviDati.giornata} aggiunta a storico_previsioni.json`);
  } else {
    console.log(`ℹ️ Giornata ${nuoviDati.giornata} già presente.`);
  }
}

aggiornaStorico();

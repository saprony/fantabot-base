const xlsx = require('xlsx');
const fs = require('fs');

// Percorso del file Excel
const excelPath = './Quotazioni_Fantacalcio_Stagione_2025_26.xlsx';
const outputPath = './public/giocatori_2025_26.json';

try {
  const workbook = xlsx.readFile(excelPath);
  const sheet = workbook.Sheets[workbook.SheetNames[0]];

  // Legge il file ignorando la prima riga (header alla riga 2)
  const data = xlsx.utils.sheet_to_json(sheet, { range: 1 });

  const giocatori = data.map(row => ({
    nome: row['Nome'],
    ruolo: row['R'],
    squadra: row['Squadra'],
    qt_iniziale: row['Qt.I'],
    qt_attuale: row['Qt.A']
  }));

  fs.writeFileSync(outputPath, JSON.stringify(giocatori, null, 2), 'utf8');
  console.log('✅ File JSON generato con successo in:', outputPath);
} catch (error) {
  console.error('❌ Errore nella conversione:', error.message);
}

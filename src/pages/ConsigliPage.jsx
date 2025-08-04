import React, { useEffect, useState } from 'react';

const RUOLI = {
  P: 'Portieri',
  D: 'Difensori',
  C: 'Centrocampisti',
  A: 'Attaccanti',
};

const ConsigliPage = () => {
  const [giocatori, setGiocatori] = useState([]);

  useEffect(() => {
    fetch('/giocatori_2025_26.json')
      .then(res => res.json())
      .then(data => setGiocatori(data));
  }, []);

  const filtroPerRuolo = (ruolo) => giocatori.filter(g => g.ruolo === ruolo);

  const topQualitaPrezzo = (lista) =>
    [...lista]
      .filter(g => g.qt_attuale > 0 && g.qt_iniziale > 0)
      .sort((a, b) => (b.qt_attuale / b.qt_iniziale) - (a.qt_attuale / a.qt_iniziale))
      .slice(0, 3);

  const topTrendPositivo = (lista) =>
    [...lista]
      .filter(g => g.qt_attuale - g.qt_iniziale > 0)
      .sort((a, b) => (b.qt_attuale - b.qt_iniziale) - (a.qt_attuale - a.qt_iniziale))
      .slice(0, 3);

  const topTrendNegativo = (lista) =>
    [...lista]
      .filter(g => g.qt_attuale - g.qt_iniziale < 0)
      .sort((a, b) => (a.qt_attuale - a.qt_iniziale) - (b.qt_attuale - b.qt_iniziale))
      .slice(0, 3);

  const renderSezione = (titolo, lista) => (
    <div className="mb-6">
      <h3 className="text-md font-semibold mb-2">{titolo}</h3>
      <ul className="bg-gray-100 rounded p-3 border text-sm">
        {lista.map((g, i) => (
          <li key={i} className="mb-1">
            <span className="font-medium">{g.nome}</span> – {g.squadra}
            <span className="ml-2 text-gray-600">
              ({g.qt_attuale} cr, diff: {g.qt_attuale - g.qt_iniziale >= 0 ? '+' : ''}{g.qt_attuale - g.qt_iniziale})
            </span>
          </li>
        ))}
      </ul>
    </div>
  );

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-center mb-8">🧠 Consigli di FantaBot per Ruolo</h1>

      {Object.entries(RUOLI).map(([codice, nomeRuolo]) => {
        const giocatoriRuolo = filtroPerRuolo(codice);

        return (
          <div key={codice} className="mb-12">
            <h2 className="text-xl font-bold mb-4">{nomeRuolo}</h2>
            {renderSezione('💰 Miglior qualità/prezzo', topQualitaPrezzo(giocatoriRuolo))}
            {renderSezione('📈 In crescita', topTrendPositivo(giocatoriRuolo))}
            {renderSezione('📉 In calo', topTrendNegativo(giocatoriRuolo))}
          </div>
        );
      })}
    </div>
  );
};

export default ConsigliPage;

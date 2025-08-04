import React, { useEffect, useState } from 'react';

const ruoli = ['portieri', 'difensori', 'centrocampisti', 'attaccanti'];

const Magnifici5Page = () => {
  const [dati, setDati] = useState(null);
  const [giocatori, setGiocatori] = useState([]);

  useEffect(() => {
    fetch('/magnifici5.json')
      .then(res => res.json())
      .then(data => setDati(data));

    fetch('/giocatori_2025_26.json')
      .then(res => res.json())
      .then(data => setGiocatori(data));
  }, []);

  const getInfoGiocatore = (nome) => {
    const trovato = giocatori.find(g => g.nome === nome);
    if (!trovato) return null;
    return `${trovato.squadra} – ${trovato.qt_attuale} cr`;
  };

  if (!dati || giocatori.length === 0) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-4">I Magnifici 5</h1>
        <p>⏳ Caricamento in corso o dati non disponibili.</p>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-center mb-8">🌟 I Magnifici 5 – Giornata {dati.giornata}</h1>

      {ruoli.map((ruolo) => (
        <div key={ruolo} className="mb-10">
          <h2 className="text-xl font-semibold mb-3 capitalize">{ruolo}</h2>
          <ul className="bg-gray-50 p-4 rounded border divide-y">
            {dati[ruolo].map((nome, i) => {
              const info = getInfoGiocatore(nome);
              return (
                <li key={i} className="py-2">
                  <span className="font-semibold">{nome}</span>
                  {info && <span className="text-sm text-gray-600 block">{info}</span>}
                </li>
              );
            })}
          </ul>
        </div>
      ))}

      <div className="mt-10 p-4 border rounded bg-yellow-100">
        <h2 className="text-lg font-semibold mb-2">⚡ UNDERDOG</h2>
        <p className="text-lg font-bold">{dati.underdog}</p>
        {getInfoGiocatore(dati.underdog) && (
          <p className="text-sm text-gray-700">
            {getInfoGiocatore(dati.underdog)}
          </p>
        )}
      </div>
    </div>
  );
};

export default Magnifici5Page;

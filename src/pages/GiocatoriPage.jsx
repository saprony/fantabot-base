import React, { useEffect, useState } from 'react';

const GiocatoriPage = () => {
  const [giocatori, setGiocatori] = useState([]);
  const [query, setQuery] = useState('');
  const [ruoloFiltro, setRuoloFiltro] = useState('');
  const [squadraFiltro, setSquadraFiltro] = useState('');

  useEffect(() => {
    fetch('/giocatori_2025_26.json')
      .then(response => response.json())
      .then(data => {
        console.log('Dati ricevuti nel frontend:', data);
        setGiocatori(data);
      })
      .catch(error => console.error('Errore nel caricamento dei dati: ' + error));
  }, []);

  // Estrae l'elenco squadre uniche in ordine alfabetico
  const squadreDisponibili = [...new Set(giocatori.map(g => g.squadra))].sort();

  const giocatoriFiltrati = giocatori
    .filter((g) =>
      g.nome.toLowerCase().includes(query.toLowerCase())
    )
    .filter((g) =>
      ruoloFiltro === '' || g.ruolo === ruoloFiltro
    )
    .filter((g) =>
      squadraFiltro === '' || g.squadra === squadraFiltro
    );

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Giocatori registrati</h1>

      <div className="flex flex-wrap items-center gap-4 mb-4">
        <input
          type="text"
          placeholder="Cerca nome giocatore"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="p-2 border rounded w-full max-w-sm"
        />

        <select
          value={ruoloFiltro}
          onChange={(e) => setRuoloFiltro(e.target.value)}
          className="p-2 border rounded"
        >
          <option value="">Tutti i ruoli</option>
          <option value="P">Portieri</option>
          <option value="D">Difensori</option>
          <option value="C">Centrocampisti</option>
          <option value="A">Attaccanti</option>
        </select>

        <select
          value={squadraFiltro}
          onChange={(e) => setSquadraFiltro(e.target.value)}
          className="p-2 border rounded"
        >
          <option value="">Tutte le squadre</option>
          {squadreDisponibili.map((squadra, index) => (
            <option key={index} value={squadra}>{squadra}</option>
          ))}
        </select>
      </div>

      <table className="min-w-full table-auto border border-gray-300">
        <thead>
          <tr className="bg-gray-200">
            <th className="px-4 py-2">Nome</th>
            <th className="px-4 py-2">Ruolo</th>
            <th className="px-4 py-2">Squadra</th>
            <th className="px-4 py-2">Qt. Iniziale</th>
            <th className="px-4 py-2">Qt. Attuale</th>
          </tr>
        </thead>
        <tbody>
          {giocatoriFiltrati.map((g, index) => (
            <tr key={index} className="text-center border-t">
              <td className="px-4 py-2">{g.nome}</td>
              <td className="px-4 py-2">{g.ruolo}</td>
              <td className="px-4 py-2">{g.squadra}</td>
              <td className="px-4 py-2">{g.qt_iniziale}</td>
              <td className="px-4 py-2">{g.qt_attuale}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default GiocatoriPage;

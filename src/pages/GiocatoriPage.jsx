import React, { useEffect, useState } from 'react';

const GiocatoriPage = () => {
  const [giocatori, setGiocatori] = useState([]);
  const [query, setQuery] = useState('');
  const [ruoloFiltro, setRuoloFiltro] = useState('');
  const [squadraFiltro, setSquadraFiltro] = useState('');
  const [maxCrediti, setMaxCrediti] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: '', direction: 'asc' });

  useEffect(() => {
    fetch('/giocatori_2025_26.json')
      .then((res) => res.json())
      .then((data) => setGiocatori(data))
      .catch((err) => console.error('Errore nel caricamento:', err));
  }, []);

  const roleMap = {
    P: 'Portiere',
    D: 'Difensore',
    C: 'Centrocampista',
    A: 'Attaccante',
  };

  const squadreDisponibili = [...new Set(giocatori.map((g) => g.squadra))].sort();

  const sortedGiocatori = [...giocatori]
    .filter((g) => g.nome.toLowerCase().includes(query.toLowerCase()))
    .filter((g) => !ruoloFiltro || g.ruolo === ruoloFiltro)
    .filter((g) => !squadraFiltro || g.squadra === squadraFiltro)
    .filter((g) => !maxCrediti || g.qt_attuale <= parseInt(maxCrediti));

  if (sortConfig.key !== '') {
    sortedGiocatori.sort((a, b) => {
      let aVal = a[sortConfig.key];
      let bVal = b[sortConfig.key];

      if (sortConfig.key === 'ruolo') {
        aVal = roleMap[aVal];
        bVal = roleMap[bVal];
      }

      if (typeof aVal === 'string') {
        aVal = aVal.toLowerCase();
        bVal = bVal.toLowerCase();
      }

      if (aVal < bVal) return sortConfig.direction === 'asc' ? -1 : 1;
      if (aVal > bVal) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });
  }

  const handleSort = (key) => {
    setSortConfig((prev) =>
      prev.key === key
        ? { key, direction: prev.direction === 'asc' ? 'desc' : 'asc' }
        : { key, direction: 'asc' }
    );
  };

  const getArrow = (key) =>
    sortConfig.key === key ? (sortConfig.direction === 'asc' ? '↑' : '↓') : '';

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-center">Giocatori Fantacalcio 2025/26</h1>

      <div className="flex flex-wrap gap-4 justify-center mb-6">
        <input
          type="text"
          placeholder="🔍 Cerca nome"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="p-2 border rounded w-full sm:w-60"
        />
        <select
          value={ruoloFiltro}
          onChange={(e) => setRuoloFiltro(e.target.value)}
          className="p-2 border rounded w-full sm:w-40"
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
          className="p-2 border rounded w-full sm:w-52"
        >
          <option value="">Tutte le squadre</option>
          {squadreDisponibili.map((s, i) => (
            <option key={i} value={s}>
              {s}
            </option>
          ))}
        </select>
        <input
          type="number"
          placeholder="💰 Credito massimo"
          value={maxCrediti}
          onChange={(e) => setMaxCrediti(e.target.value)}
          className="p-2 border rounded w-full sm:w-40"
          min="0"
        />
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full border border-black border-collapse text-sm">
          <thead>
            <tr className="bg-white text-red-600 font-bold text-center">
              <th
                className="px-4 py-2 border border-black cursor-pointer"
                onClick={() => handleSort('nome')}
              >
                Nome {getArrow('nome')}
              </th>
              <th
                className="px-4 py-2 border border-black cursor-pointer"
                onClick={() => handleSort('ruolo')}
              >
                Ruolo {getArrow('ruolo')}
              </th>
              <th
                className="px-4 py-2 border border-black cursor-pointer"
                onClick={() => handleSort('squadra')}
              >
                Squadra {getArrow('squadra')}
              </th>
              <th
                className="px-4 py-2 border border-black cursor-pointer"
                onClick={() => handleSort('qt_iniziale')}
              >
                Iniziale {getArrow('qt_iniziale')}
              </th>
              <th
                className="px-4 py-2 border border-black cursor-pointer"
                onClick={() => handleSort('qt_attuale')}
              >
                Attuale {getArrow('qt_attuale')}
              </th>
              <th className="px-4 py-2 border border-black">Δ</th>
            </tr>
          </thead>
          <tbody>
            {sortedGiocatori.map((g, i) => {
              const diff = g.qt_attuale - g.qt_iniziale;
              const diffColor =
                diff > 0 ? 'text-green-600' : diff < 0 ? 'text-red-600' : 'text-gray-500';
              return (
                <tr
                  key={i}
                  className={i % 2 === 0 ? 'bg-white' : 'bg-gray-100 text-black'}
                >
                  <td className="px-4 py-2 border border-black text-center">{g.nome}</td>
                  <td className="px-4 py-2 border border-black text-center">{roleMap[g.ruolo]}</td>
                  <td className="px-4 py-2 border border-black text-center">{g.squadra}</td>
                  <td className="px-4 py-2 border border-black text-center">{g.qt_iniziale}</td>
                  <td className="px-4 py-2 border border-black text-center">{g.qt_attuale}</td>
                  <td className={`px-4 py-2 border border-black text-center font-bold ${diffColor}`}>
                    {diff > 0 ? '+' : ''}
                    {diff}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default GiocatoriPage;

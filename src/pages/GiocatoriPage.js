import React, { useState, useEffect } from 'react';

const GiocatoriPage = () => {
  const [giocatori, setGiocatori] = useState([]);
  const [search, setSearch] = useState('');
  const [ruolo, setRuolo] = useState('');
  const [maxCrediti, setMaxCrediti] = useState('');

  useEffect(() => {
    const fetchGiocatori = async () => {
      const res = await fetch('/data/giocatori.json');
      const data = await res.json();
      setGiocatori(data);
    };
    fetchGiocatori();
  }, []);

  const filtraGiocatori = giocatori.filter((g) => {
    const matchNome = g.nome.toLowerCase().includes(search.toLowerCase());
    const matchRuolo = ruolo ? g.ruolo === ruolo : true;
    const matchCrediti = maxCrediti ? g.quotazione_attuale <= parseInt(maxCrediti) : true;
    return matchNome && matchRuolo && matchCrediti;
  });

  return (
    <div style={{ padding: '2rem' }}>
      <h1>Lista Giocatori Serie A</h1>

      <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
        <input
          type="text"
          placeholder="Cerca nome giocatore"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select value={ruolo} onChange={(e) => setRuolo(e.target.value)}>
          <option value="">Tutti i ruoli</option>
          <option value="Portiere">Portiere</option>
          <option value="Difensore">Difensore</option>
          <option value="Centrocampista">Centrocampista</option>
          <option value="Attaccante">Attaccante</option>
        </select>
        <input
          type="number"
          placeholder="Max crediti"
          value={maxCrediti}
          onChange={(e) => setMaxCrediti(e.target.value)}
          min="1"
        />
      </div>

      <table border="1" cellPadding="8" style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th>Nome</th>
            <th>Squadra</th>
            <th>Ruolo</th>
            <th>Qt. Iniziale</th>
            <th>Qt. Attuale</th>
          </tr>
        </thead>
        <tbody>
          {filtraGiocatori.map((g, i) => (
            <tr key={i}>
              <td>{g.nome}</td>
              <td>{g.squadra}</td>
              <td>{g.ruolo}</td>
              <td>{g.quotazione_iniziale}</td>
              <td>{g.quotazione_attuale}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default GiocatoriPage;

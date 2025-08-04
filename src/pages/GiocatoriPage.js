import React, { useState, useEffect } from 'react';

const GiocatoriPage = () => {
  const [giocatori, setGiocatori] = useState([]);
  const [search, setSearch] = useState('');
  const [ruolo, setRuolo] = useState('');
  const [maxCrediti, setMaxCrediti] = useState('');

  useEffect(() => {
    fetch('/api/giocatori')
      .then(res => res.json())
      .then(data => setGiocatori(data));
  }, []);

  const filtrati = giocatori.filter(g => {
    const matchNome = g.nome.toLowerCase().includes(search.toLowerCase());
    const matchRuolo = ruolo ? g.ruolo === ruolo : true;
    const matchCrediti = maxCrediti ? g.quotazione_attuale <= parseInt(maxCrediti) : true;
    return matchNome && matchRuolo && matchCrediti;
  });

  return (
    <div style={{ padding: '2rem' }}>
      <h1>Lista Giocatori</h1>

      <div style={{ marginBottom: '1rem' }}>
        <input
          type="text"
          placeholder="Cerca per nome"
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{ marginRight: '1rem' }}
        />
        <select value={ruolo} onChange={e => setRuolo(e.target.value)} style={{ marginRight: '1rem' }}>
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
          onChange={e => setMaxCrediti(e.target.value)}
        />
      </div>

      <table border="1" cellPadding="6">
        <thead>
          <tr>
            <th>Nome</th>
            <th>Ruolo</th>
            <th>Squadra</th>
            <th>Qt. Iniziale</th>
            <th>Qt. Attuale</th>
          </tr>
        </thead>
        <tbody>
          {filtrati.map((g, idx) => (
            <tr key={idx}>
              <td>{g.nome}</td>
              <td>{g.ruolo}</td>
              <td>{g.squadra}</td>
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

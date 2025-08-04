import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';

const GiocatorePage = () => {
  const { nome } = useParams();
  const [giocatore, setGiocatore] = useState(null);
  const [statistiche, setStatistiche] = useState([]);

  useEffect(() => {
  fetch('/giocatori_2025_26.json')
    .then(res => res.json())
    .then(data => {
      const normalizza = (str) =>
        str.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, '').trim();

      const nomeURL = normalizza(decodeURIComponent(nome));

      console.log('Sto cercando:', nomeURL);

      const trovato = data.find(g => {
        const n = normalizza(g.nome);
        console.log('Controllo:', n);
        return n === nomeURL;
      });

      setGiocatore(trovato || null);
    });


  fetch('/stats_post_partita.json')
    .then(res => res.json())
    .then(data => {
      const stats = data.filter(
        s => s.nome.toLowerCase() === decodeURIComponent(nome).toLowerCase()
      );
      setStatistiche(stats);
    });
}, [nome]);


  const roleMap = {
    P: 'Portiere',
    D: 'Difensore',
    C: 'Centrocampista',
    A: 'Attaccante',
  };

  if (giocatore === null) {
    return (
      <div className="p-6 text-center">
        <h2 className="text-2xl font-bold text-red-600 mb-2">Giocatore non trovato</h2>
        <Link to="/giocatori" className="text-blue-600 hover:underline">
          Torna alla lista
        </Link>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-xl mx-auto bg-white border shadow rounded">
      <h1 className="text-3xl font-bold mb-4 text-center">{giocatore.nome}</h1>
      <div className="space-y-2 text-gray-700">
        <p><strong>Squadra:</strong> {giocatore.squadra}</p>
        <p><strong>Ruolo:</strong> {roleMap[giocatore.ruolo]}</p>
        <p><strong>Quotazione iniziale:</strong> {giocatore.qt_iniziale} crediti</p>
        <p><strong>Quotazione attuale:</strong> {giocatore.qt_attuale} crediti</p>
        <p>
          <strong>Variazione:</strong>{' '}
          <span className={
            giocatore.qt_attuale - giocatore.qt_iniziale > 0
              ? 'text-green-600'
              : giocatore.qt_attuale - giocatore.qt_iniziale < 0
              ? 'text-red-600'
              : 'text-gray-500'
          }>
            {giocatore.qt_attuale - giocatore.qt_iniziale >= 0 ? '+' : ''}
            {giocatore.qt_attuale - giocatore.qt_iniziale}
          </span>
        </p>
      </div>

{statistiche.length > 0 && (
  <div className="mt-6 space-y-6">

    {/* ULTIMA PARTITA */}
    <div>
      <h3 className="text-xl font-semibold text-gray-800 mb-2">🕒 Ultima partita – giornata {statistiche.at(-1).giornata}</h3>
      <div className="p-4 border rounded bg-gray-50">
        <p><strong>Minuti giocati:</strong> {statistiche.at(-1).minuti}</p>
        <p><strong>Gol:</strong> {statistiche.at(-1).gol} — <strong>Assist:</strong> {statistiche.at(-1).assist}</p>
        <p><strong>Tiri in porta:</strong> {statistiche.at(-1).tiri_in_porta}</p>
        <p><strong>Occasioni create:</strong> {statistiche.at(-1).occasioni_create}</p>
        <p><strong>Ammonizioni:</strong> {statistiche.at(-1).ammonizioni} — <strong>Espulsioni:</strong> {statistiche.at(-1).espulsioni}</p>
        <p><strong>Voto:</strong> {statistiche.at(-1).voto} — <strong>Fantavoto:</strong> {statistiche.at(-1).fantavoto}</p>
      </div>
    </div>

    {/* TOTALI */}
    <div>
      <h3 className="text-xl font-semibold text-gray-800 mb-2">📊 Totali stagione</h3>
      <div className="p-4 border rounded bg-gray-50">
        <p><strong>Partite giocate:</strong> {statistiche.length}</p>
        <p><strong>Minuti:</strong> {statistiche.reduce((acc, s) => acc + s.minuti, 0)}</p>
        <p><strong>Gol:</strong> {statistiche.reduce((acc, s) => acc + s.gol, 0)} — <strong>Assist:</strong> {statistiche.reduce((acc, s) => acc + s.assist, 0)}</p>
        <p><strong>Tiri in porta:</strong> {statistiche.reduce((acc, s) => acc + s.tiri_in_porta, 0)}</p>
        <p><strong>Occasioni create:</strong> {statistiche.reduce((acc, s) => acc + s.occasioni_create, 0)}</p>
        <p><strong>Ammonizioni:</strong> {statistiche.reduce((acc, s) => acc + s.ammonizioni, 0)} — <strong>Espulsioni:</strong> {statistiche.reduce((acc, s) => acc + s.espulsioni, 0)}</p>
        <p><strong>Media voto:</strong> {(
          statistiche.reduce((acc, s) => acc + s.voto, 0) / statistiche.length
        ).toFixed(2)} — <strong>Media fantavoto:</strong> {(
          statistiche.reduce((acc, s) => acc + s.fantavoto, 0) / statistiche.length
        ).toFixed(2)}</p>
      </div>
    </div>

  </div>
)}

      <div className="mt-6 text-center">
        <Link to="/giocatori" className="text-blue-700 hover:underline">
          ← Torna alla lista giocatori
        </Link>
      </div>
    </div>
  );
};

export default GiocatorePage;

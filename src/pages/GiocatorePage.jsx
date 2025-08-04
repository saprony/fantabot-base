import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';

const GiocatorePage = () => {
  const { nome } = useParams();
  const [giocatore, setGiocatore] = useState(null);

  useEffect(() => {
    fetch('/giocatori_2025_26.json')
      .then((res) => res.json())
      .then((data) => {
        const trovato = data.find(
          (g) => g.nome.toLowerCase() === decodeURIComponent(nome).toLowerCase()
        );
        setGiocatore(trovato || null);
      })
      .catch((err) => console.error('Errore caricamento:', err));
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

      <div className="mt-6 text-center">
        <Link to="/giocatori" className="text-blue-700 hover:underline">
          ← Torna alla lista giocatori
        </Link>
      </div>
    </div>
  );
};

export default GiocatorePage;

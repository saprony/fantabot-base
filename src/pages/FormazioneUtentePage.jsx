import React, { useState, useEffect } from 'react';

function FormazioneUtentePage() {
  const [giocatori, setGiocatori] = useState([]);
  const [portieri, setPortieri] = useState([]);
  const [difensori, setDifensori] = useState([]);
  const [centrocampisti, setCentrocampisti] = useState([]);
  const [attaccanti, setAttaccanti] = useState([]);
  const [modulo, setModulo] = useState('3-4-3');
  const [formazione, setFormazione] = useState(null);

  useEffect(() => {
    fetch('/giocatori_2025_26.json')
      .then(res => res.json())
      .then(data => setGiocatori(data))
      .catch(err => console.error('Errore nel caricamento dei giocatori:', err));
  }, []);

  const getGiocatoriPerRuolo = (ruolo) =>
    giocatori
      .filter(g => g.ruolo === ruolo)
      .sort((a, b) => a.nome.localeCompare(b.nome)); // Ordinamento alfabetico

  const handleSelect = (e, setter, max) => {
    const selectedOptions = Array.from(e.target.selectedOptions).map(opt => opt.value);
    if (selectedOptions.length > max) {
      alert(`Puoi selezionare massimo ${max} giocatori`);
      return;
    }
    setter(selectedOptions);
  };

  const generaFormazione = () => {
    const rosaCompleta = [
      ...portieri,
      ...difensori,
      ...centrocampisti,
      ...attaccanti,
    ];

    const titolari = rosaCompleta.slice(0, 11);

    setFormazione({
      modulo,
      titolari,
    });
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-4">Formazione Personalizzata</h1>

      <div className="mb-4">
        <label className="block font-semibold mb-1">🧤 Portieri (max 3):</label>
        <select multiple onChange={(e) => handleSelect(e, setPortieri, 3)} className="w-full border rounded p-2">
          {getGiocatoriPerRuolo('P').map((g, idx) => (
            <option key={idx} value={g.nome}>{g.nome} ({g.squadra})</option>
          ))}
        </select>
      </div>

      <div className="mb-4">
        <label className="block font-semibold mb-1">🛡️ Difensori (max 8):</label>
        <select multiple onChange={(e) => handleSelect(e, setDifensori, 8)} className="w-full border rounded p-2">
          {getGiocatoriPerRuolo('D').map((g, idx) => (
            <option key={idx} value={g.nome}>{g.nome} ({g.squadra})</option>
          ))}
        </select>
      </div>

      <div className="mb-4">
        <label className="block font-semibold mb-1">🎯 Centrocampisti (max 8):</label>
        <select multiple onChange={(e) => handleSelect(e, setCentrocampisti, 8)} className="w-full border rounded p-2">
          {getGiocatoriPerRuolo('C').map((g, idx) => (
            <option key={idx} value={g.nome}>{g.nome} ({g.squadra})</option>
          ))}
        </select>
      </div>

      <div className="mb-4">
        <label className="block font-semibold mb-1">⚡ Attaccanti (max 6):</label>
        <select multiple onChange={(e) => handleSelect(e, setAttaccanti, 6)} className="w-full border rounded p-2">
          {getGiocatoriPerRuolo('A').map((g, idx) => (
            <option key={idx} value={g.nome}>{g.nome} ({g.squadra})</option>
          ))}
        </select>
      </div>

      <div className="mb-6">
        <label className="font-semibold mr-2">Modulo:</label>
        <select value={modulo} onChange={(e) => setModulo(e.target.value)} className="border p-1 rounded">
          <option value="3-4-3">3-4-3</option>
          <option value="4-3-3">4-3-3</option>
          <option value="4-4-2">4-4-2</option>
          <option value="3-5-2">3-5-2</option>
        </select>
      </div>

      <button onClick={generaFormazione} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
        Genera Formazione
      </button>

      {formazione && (
        <div className="mt-8">
          <h2 className="text-xl font-bold mb-2">🟢 Formazione ({formazione.modulo})</h2>
          <ul className="list-disc ml-6">
            {formazione.titolari.map((g, idx) => (
              <li key={idx}>{g}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default FormazioneUtentePage;

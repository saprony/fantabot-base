import React from 'react';

const FormazionePage = () => {
  // Formazione generata automaticamente da FantaBot (esempio statico temporaneo)
  const formazione = {
    modulo: '3-4-3',
    titolari: [
      { nome: 'Di Gregorio', ruolo: 'P', squadra: 'Juventus', qt_attuale: 16 },
      { nome: 'Calafiori', ruolo: 'D', squadra: 'Bologna', qt_attuale: 18 },
      { nome: 'Bastoni', ruolo: 'D', squadra: 'Inter', qt_attuale: 17 },
      { nome: 'Buongiorno', ruolo: 'D', squadra: 'Torino', qt_attuale: 15 },
      { nome: 'Barella', ruolo: 'C', squadra: 'Inter', qt_attuale: 20 },
      { nome: 'Fagioli', ruolo: 'C', squadra: 'Juventus', qt_attuale: 15 },
      { nome: 'Pasalic', ruolo: 'C', squadra: 'Atalanta', qt_attuale: 14 },
      { nome: 'Ferguson', ruolo: 'C', squadra: 'Bologna', qt_attuale: 13 },
      { nome: 'Osimhen', ruolo: 'A', squadra: 'Napoli', qt_attuale: 24 },
      { nome: 'Lautaro M.', ruolo: 'A', squadra: 'Inter', qt_attuale: 25 },
      { nome: 'Lucca', ruolo: 'A', squadra: 'Udinese', qt_attuale: 13 }
    ]
  };

  const getRuoloEsteso = (ruolo) => {
    switch (ruolo) {
      case 'P': return 'Portiere';
      case 'D': return 'Difensore';
      case 'C': return 'Centrocampista';
      case 'A': return 'Attaccante';
      default: return ruolo;
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-4">Formazione Consigliata</h1>
      <p className="mb-4 text-gray-700">Modulo suggerito: <strong>{formazione.modulo}</strong></p>
      
      <table className="min-w-full border border-gray-300">
        <thead className="bg-gray-100">
          <tr>
            <th className="px-4 py-2 text-left">Nome</th>
            <th className="px-4 py-2 text-left">Ruolo</th>
            <th className="px-4 py-2 text-left">Squadra</th>
            <th className="px-4 py-2 text-left">Quotazione Attuale</th>
          </tr>
        </thead>
        <tbody>
          {formazione.titolari.map((g, index) => (
            <tr key={index} className="border-t">
              <td className="px-4 py-2">{g.nome}</td>
              <td className="px-4 py-2">{getRuoloEsteso(g.ruolo)}</td>
              <td className="px-4 py-2">{g.squadra}</td>
              <td className="px-4 py-2">{g.qt_attuale}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default FormazionePage;

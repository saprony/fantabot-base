import React from 'react';
import giocatori from '../data/giocatori.json';

const Giocatori = () => {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Giocatori registrati</h1>
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
          {giocatori.map((g, index) => (
            <tr key={index} className="text-center border-t">
              <td className="px-4 py-2">{g.nome}</td>
              <td className="px-4 py-2">{g.ruolo}</td>
              <td className="px-4 py-2">{g.squadra}</td>
              <td className="px-4 py-2">{g.quotazione_iniziale}</td>
              <td className="px-4 py-2">{g.quotazione_attuale}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Giocatori;

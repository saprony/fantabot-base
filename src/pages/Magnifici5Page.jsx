import React, { useEffect, useState } from 'react';

const Magnifici5Page = () => {
  const [dati, setDati] = useState({});

  useEffect(() => {
    fetch('/magnifici5.json')
      .then((res) => res.json())
      .then((data) => setDati(data))
      .catch((err) => console.error('Errore caricamento:', err));
  }, []);

  const ruoliOrdine = ['Portieri', 'Difensori', 'Centrocampisti', 'Attaccanti'];

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-center text-red-700">
        I Magnifici 5 🔥
      </h1>

      {ruoliOrdine.map((ruolo) => (
        <div key={ruolo} className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 text-blue-800 border-b border-gray-300 pb-1">
            {ruolo}
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-2">
            {dati[ruolo]?.top?.map((g, i) => (
              <div
                key={i}
                className="border border-gray-300 rounded-lg p-3 shadow-sm bg-white"
              >
                <div className="font-bold text-lg">{g.nome}</div>
                <div className="text-sm text-gray-600">{g.squadra}</div>
                <div className="text-sm font-medium text-gray-800">
                  Quotazione: {g.quotazione}
                </div>
              </div>
            ))}
          </div>

          {dati[ruolo]?.underdog && (
            <div className="mt-6 bg-yellow-100 border-l-4 border-yellow-500 p-4 rounded">
              <p className="text-sm text-gray-700">🎯 <strong>Underdog consigliato:</strong></p>
              <p className="font-semibold text-lg">
                {dati[ruolo].underdog.nome} ({dati[ruolo].underdog.squadra}) — {dati[ruolo].underdog.quotazione} crediti
              </p>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default Magnifici5Page;

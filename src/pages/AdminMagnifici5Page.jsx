import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const AdminMagnifici5Page = () => {
  const [data, setData] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (localStorage.getItem('admin') !== 'true') navigate('/login-admin');
  }, [navigate]);

  useEffect(() => {
    fetch('/magnifici5.json')
      .then(r => r.json())
      .then(setData)
      .catch(() => setData(null));
  }, []);

  if (!data) {
    return <div className="p-6">Dati non disponibili.</div>;
  }

  const blocco = (titolo, lista) => (
    <div className="mb-4">
      <h3 className="font-semibold mb-1">{titolo}</h3>
      <ul className="list-disc ml-6 text-sm">
        {lista.map((n, i) => <li key={i}>{n}</li>)}
      </ul>
    </div>
  );

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-2">⭐ Magnifici 5 (solo lettura)</h1>
      <p className="mb-4 text-gray-700">Giornata {data.giornata}</p>

      {blocco('Portieri', data.portieri)}
      {blocco('Difensori', data.difensori)}
      {blocco('Centrocampisti', data.centrocampisti)}
      {blocco('Attaccanti', data.attaccanti)}

      <div className="mt-4 p-3 bg-yellow-100 rounded">
        <strong>Underdog:</strong> {data.underdog}
      </div>
    </div>
  );
};

export default AdminMagnifici5Page;

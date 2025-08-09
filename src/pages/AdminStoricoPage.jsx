import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const AdminStoricoPage = () => {
  const [storico, setStorico] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (localStorage.getItem('admin') !== 'true') navigate('/login-admin');
  }, [navigate]);

  useEffect(() => {
    fetch('/data/storico_previsioni.json')
      .then(r => r.json())
      .then(setStorico)
      .catch(() => setStorico([]));
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">📈 Storico Previsioni</h1>
      <p className="mb-4">Giornate salvate: <strong>{storico.length}</strong></p>

      {storico.length > 0 && (
        <div className="border rounded overflow-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-3 py-2 text-left">Giornata</th>
                <th className="px-3 py-2 text-left">Data</th>
                <th className="px-3 py-2 text-left">Note</th>
              </tr>
            </thead>
            <tbody>
              {storico.map((g, i) => (
                <tr key={i} className="border-t">
                  <td className="px-3 py-2">{g.giornata}</td>
                  <td className="px-3 py-2">{g.data}</td>
                  <td className="px-3 py-2 text-gray-600">Magnifici5 + formazione + osservati</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminStoricoPage;

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const AdminAutoUpdatePage = () => {
  const [log, setLog] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (localStorage.getItem('admin') !== 'true') navigate('/login-admin');
  }, [navigate]);

  const run = async () => {
    setLog((l) => [...l, '⏳ Avvio aggiornamento…']);
    // Qui in futuro chiameremo una API/serverless o uno script
    await new Promise(r => setTimeout(r, 1200));
    setLog((l) => [...l, '✅ Aggiornamento completato (simulazione).']);
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">⚙️ Avvia aggiornamento automatico</h1>
      <button onClick={run} className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
        Esegui
      </button>
      <div className="mt-4 bg-gray-100 p-3 rounded text-sm min-h-[100px]">
        {log.map((r, i) => (<div key={i}>{r}</div>))}
      </div>
    </div>
  );
};

export default AdminAutoUpdatePage;

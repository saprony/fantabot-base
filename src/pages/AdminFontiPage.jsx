import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const AdminFontiPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    if (localStorage.getItem('admin') !== 'true') navigate('/login-admin');
  }, [navigate]);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">🔍 Monitoraggio Fonti</h1>
      <p className="mb-2">Qui mostreremo affidabilità e copertura delle fonti (SOSFanta, Fantacalcio, Gazzetta, social, club, ecc.).</p>
      <ul className="list-disc ml-6 text-sm text-gray-700">
        <li>Accuratezza media ultime X giornate</li>
        <li>Tempo di aggiornamento medio</li>
        <li>Copertura (quante squadre/giocatori trattati)</li>
      </ul>
    </div>
  );
};

export default AdminFontiPage;

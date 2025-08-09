import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const AdminDashboardPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    if (localStorage.getItem('admin') !== 'true') {
      navigate('/login-admin');
    }
  }, [navigate]);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Pannello di Controllo Admin</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Link to="/admin/upload-excel" className="border p-4 rounded shadow bg-white hover:bg-blue-50">
          <h2 className="text-lg font-semibold mb-1">📥 Carica file Excel</h2>
          <p>Importa quotazioni/giocatori da Excel e genera JSON aggiornato.</p>
        </Link>

        <Link to="/admin/auto-update" className="border p-4 rounded shadow bg-white hover:bg-blue-50">
          <h2 className="text-lg font-semibold mb-1">⚙️ Avvia aggiornamento automatico</h2>
          <p>Esegui gli script di aggiornamento (simulazione per ora).</p>
        </Link>

        <Link to="/admin/storico" className="border p-4 rounded shadow bg-white hover:bg-blue-50">
          <h2 className="text-lg font-semibold mb-1">📈 Storico Previsioni</h2>
          <p>Vedi giornate salvate e controlli rapidi.</p>
        </Link>

        <Link to="/admin/fonti" className="border p-4 rounded shadow bg-white hover:bg-blue-50">
          <h2 className="text-lg font-semibold mb-1">🔍 Monitoraggio Fonti</h2>
          <p>In futuro: ranking affidabilità e dettaglio per fonte.</p>
        </Link>

        <Link to="/admin/magnifici5" className="border p-4 rounded shadow bg-white hover:bg-blue-50">
          <h2 className="text-lg font-semibold mb-1">⭐ Magnifici 5 (solo lettura)</h2>
          <p>Vista dei Magnifici 5 generati da FantaBot.</p>
        </Link>
      </div>
    </div>
  );
};

export default AdminDashboardPage;

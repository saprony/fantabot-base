import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const AdminLoginPage = () => {
  const [password, setPassword] = useState('');
  const [errore, setErrore] = useState('');
  const navigate = useNavigate();

  const handleLogin = () => {
    if (password === 'fantabot2025') {
      localStorage.setItem('adminLoggedIn', 'true');
      navigate('/admin/dashboard');
    } else {
      setErrore('Password errata. Riprova.');
    }
  };

  return (
    <div className="max-w-md mx-auto mt-24 p-6 border rounded-lg shadow bg-white text-center">
      <h2 className="text-2xl font-bold mb-4">Accesso Area Admin</h2>
      <input
        type="password"
        placeholder="Inserisci password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="w-full p-2 border rounded mb-4"
      />
      <button
        onClick={handleLogin}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 w-full"
      >
        Entra
      </button>
      {errore && <p className="text-red-600 mt-4">{errore}</p>}
    </div>
  );
};

export default AdminLoginPage;

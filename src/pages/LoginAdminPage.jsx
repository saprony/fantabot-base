// src/pages/LoginAdminPage.jsx

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const LoginAdminPage = () => {
  const [password, setPassword] = useState('');
  const [errore, setErrore] = useState('');
  const navigate = useNavigate();

const handleLogin = () => {
  console.log("ENV:", process.env.REACT_APP_ADMIN_PASSWORD);
  if (password === process.env.REACT_APP_ADMIN_PASSWORD) {
    localStorage.setItem('admin', 'true');
    navigate('/admin-dashboard');
  } else {
    setErrore('Password errata. Riprova.');
  }
};

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100 px-4">
      <h1 className="text-2xl font-bold mb-4">Accesso Admin</h1>
      <input
        type="password"
        placeholder="Inserisci password"
        className="px-4 py-2 border rounded mb-2 w-full max-w-sm"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        onClick={handleLogin}
      >
        Accedi
      </button>
      {errore && <p className="text-red-600 mt-2">{errore}</p>}
    </div>
  );
};

export default LoginAdminPage;

import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const AdminDashboardPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const loggedIn = localStorage.getItem('adminLoggedIn');
    if (loggedIn !== 'true') {
      navigate('/admin');
    }
  }, [navigate]);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Dashboard Admin</h1>
      <p>Accesso riuscito. Da qui gestirai le funzioni riservate.</p>
    </div>
  );
};

export default AdminDashboardPage;

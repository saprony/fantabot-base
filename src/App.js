import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import GiocatoriPage from './pages/GiocatoriPage';
import Magnifici5Page from './pages/Magnifici5Page';
import GiocatorePage from './pages/GiocatorePage';
import AdminLoginPage from './pages/AdminLoginPage';
import AdminDashboardPage from './pages/AdminDashboardPage';
import ConsigliPage from './pages/ConsigliPage';
import HomePage from './pages/HomePage';
import FormazionePage from './pages/FormazionePage';
import FormazioneUtentePage from './pages/FormazioneUtentePage';


function App() {
  return (
    <Router>
      <div style={{ padding: '1rem' }}>
        <nav>
          <Link to="/">Home</Link> |{' '}
          <Link to="/giocatori">Giocatori</Link>
          <Link to="/magnifici5">I Magnifici 5</Link>
          <Link to="/consigli">Consigli</Link>
        </nav>

        <Routes>
          <Route path="/" element={<HomePage />} />
  <Route path="/giocatori" element={<GiocatoriPage />} />
          <Route path="/magnifici5" element={<Magnifici5Page />} />
          <Route path="/giocatore/:nome" element={<GiocatorePage />} />
          <Route path="/admin" element={<AdminLoginPage />} />
<Route path="/admin/dashboard" element={<AdminDashboardPage />} />
<Route path="/consigli" element={<ConsigliPage />} />
<Route path="/formazione" element={<FormazionePage />} />
<Route path="/formazione-personalizzata" element={<FormazioneUtentePage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;


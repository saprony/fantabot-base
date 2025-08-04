import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import GiocatoriPage from './pages/GiocatoriPage';

function App() {
  return (
    <Router>
      <div style={{ padding: '1rem' }}>
        <nav>
          <Link to="/">Home</Link> |{' '}
          <Link to="/giocatori">Giocatori</Link>
        </nav>

        <Routes>
          <Route path="/" element={<h1>Benvenuto su FantaBot!</h1>} />
          <Route path="/giocatori" element={<GiocatoriPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;


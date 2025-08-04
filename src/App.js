import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Giocatori from './pages/Giocatori';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50 p-4">
        <nav className="mb-4">
          <Link to="/" className="mr-4 text-blue-600 font-semibold">Home</Link>
          <Link to="/giocatori" className="text-blue-600 font-semibold">Giocatori</Link>
        </nav>
        <Routes>
          <Route path="/" element={<h1 className="text-3xl font-bold">Benvenuto su FantaBot</h1>} />
          <Route path="/giocatori" element={<Giocatori />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;

import React from 'react';
import { Link } from 'react-router-dom';
import '../index.css';

function HomePage() {
  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Background image */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: "url('/images/fantabot-home.jpg')",
          backgroundRepeat: 'no-repeat',
          backgroundSize: 'cover',
        }}
      ></div>

      {/* Overlay */}
      <div className="absolute inset-0 bg-black bg-opacity-70"></div>

      {/* Contenuto visibile */}
      <div className="relative z-10 text-white text-center p-6 sm:p-10">
        <h1 className="text-4xl sm:text-5xl font-bold mb-4">FANTABOT</h1>
        <p className="text-lg sm:text-xl mb-6">
          Il tuo migliore alleato nelle scelte vincenti
        </p>

        {/* Collegamenti rapidi */}
        <div className="flex justify-center flex-wrap gap-4 text-sm mb-8">
          <Link to="/giocatori" className="underline hover:text-yellow-300">
            📑 Lista Giocatori
          </Link>
          <Link to="/magnifici5" className="underline hover:text-yellow-300">
            ⭐ I Magnifici 5
          </Link>
          <Link to="/consigli" className="underline hover:text-yellow-300">
            🧠 Consigli FantaBot
          </Link>
          <Link to="/formazione" className="underline hover:text-yellow-300">
  🧾 Formazione Consigliata
</Link>
<Link to="/formazione-personalizzata" className="underline hover:text-yellow-300">
  ⚙️ Formazione Personalizzata
</Link>
<Link to="/login-admin">🔒 Area Admin</Link>

        </div>

        {/* Box centrale con dati */}
        <div className="bg-white bg-opacity-90 text-black rounded-lg p-6 max-w-2xl mx-auto space-y-6 shadow-md">
          <div>
            <h2 className="text-xl font-bold mb-1">🏆 Classifica Serie A</h2>
            <p className="text-sm">[Integrazione dati in arrivo]</p>
          </div>
          <div>
            <h2 className="text-xl font-bold mb-1">⚽ Classifica Marcatori</h2>
            <p className="text-sm">[Integrazione dati in arrivo]</p>
          </div>
          <div>
            <h2 className="text-xl font-bold mb-1">📅 Prossima Giornata</h2>
            <p className="text-sm">[Integrazione dati in arrivo]</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default HomePage;

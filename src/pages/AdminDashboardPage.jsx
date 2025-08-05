function AdminDashboardPage() {
  return (
    <div className="p-8">
      <h2 className="text-2xl font-bold mb-4">Pannello di Controllo Admin</h2>
      <p className="mb-2">Da qui potrai gestire tutte le sezioni di FantaBot.</p>

      <ul className="list-disc ml-6 mt-4">
        <li>Inserire/Modificare i Magnifici 5</li>
        <li>Aggiornare le statistiche giocatori</li>
        <li>Gestire i Consigli</li>
        <li>Accedere a funzioni avanzate (in futuro)</li>
      </ul>
    </div>
  );
}

export default AdminDashboardPage;

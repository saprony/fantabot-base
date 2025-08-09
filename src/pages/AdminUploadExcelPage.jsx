import React, { useEffect, useState } from 'react';
import * as XLSX from 'xlsx';
import { useNavigate } from 'react-router-dom';

const AdminUploadExcelPage = () => {
  const [rows, setRows] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (localStorage.getItem('admin') !== 'true') navigate('/login-admin');
  }, [navigate]);

  const onFile = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const data = await file.arrayBuffer();
    const wb = XLSX.read(data);
    const ws = wb.Sheets[wb.SheetNames[0]];
    const json = XLSX.utils.sheet_to_json(ws, { defval: '' });

    // Mappiamo SOLO le colonne utili e rinominiamo:
    // Nome | Squadra | Ruolo | Qt. Iniziale | Qt. Attuale
    const mapped = json.map((r) => ({
      nome: r['Nome'] ?? r['NOME'] ?? r['nome'],
      squadra: r['Squadra'] ?? r['SQUADRA'] ?? r['squadra'],
      ruolo: r['Ruolo'] ?? r['RUOLO'] ?? r['ruolo'],
      qt_iniziale: Number(r['Qt. Iniziale'] ?? r['Quotazione Iniziale'] ?? r['qt_iniziale'] ?? 0),
      qt_attuale: Number(r['Qt. Attuale'] ?? r['Quotazione Attuale'] ?? r['qt_attuale'] ?? 0),
    })).filter(r => r.nome && r.squadra && r.ruolo);

    setRows(mapped);
  };

  const downloadJSON = () => {
    const blob = new Blob([JSON.stringify(rows, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'giocatori_2025_26.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">📥 Carica file Excel</h1>
      <p className="mb-4">Seleziona il file Excel (foglio 1) con le colonne: <strong>Nome, Squadra, Ruolo, Qt. Iniziale, Qt. Attuale</strong>.</p>

      <input type="file" accept=".xlsx,.xls" onChange={onFile} className="mb-4" />

      {rows.length > 0 && (
        <>
          <div className="mb-3 text-sm text-gray-700">
            Righe elaborate: <strong>{rows.length}</strong>
          </div>
          <button onClick={downloadJSON} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
            Scarica JSON pronto
          </button>

          <div className="mt-6 overflow-auto border rounded">
            <table className="min-w-full text-sm">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-3 py-2 text-left">Nome</th>
                  <th className="px-3 py-2 text-left">Ruolo</th>
                  <th className="px-3 py-2 text-left">Squadra</th>
                  <th className="px-3 py-2 text-left">Qt. Iniziale</th>
                  <th className="px-3 py-2 text-left">Qt. Attuale</th>
                </tr>
              </thead>
              <tbody>
                {rows.slice(0, 50).map((r, i) => (
                  <tr key={i} className="border-t">
                    <td className="px-3 py-2">{r.nome}</td>
                    <td className="px-3 py-2">{r.ruolo}</td>
                    <td className="px-3 py-2">{r.squadra}</td>
                    <td className="px-3 py-2">{r.qt_iniziale}</td>
                    <td className="px-3 py-2">{r.qt_attuale}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <p className="text-xs text-gray-500 p-2">Anteprima limitata a 50 righe.</p>
          </div>
        </>
      )}
    </div>
  );
};

export default AdminUploadExcelPage;

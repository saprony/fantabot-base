// src/pages/FormazionePage.jsx
import { useEffect, useMemo, useState } from "react";

/**
 * Determina se mostrare la formazione o il messaggio.
 * VEN >= 09:00 → FORMAZIONE
 * SAB, DOM, LUN → FORMAZIONE
 * MAR < 09:00 → FORMAZIONE
 * MAR >= 09:00, MER, GIO, VEN < 09:00 → MESSAGGIO
 */
function windowPhase() {
  const now = new Date();
  const romeString = now.toLocaleString("en-CA", { timeZone: "Europe/Rome" });
  const rome = new Date(romeString);

  const weekday = rome
    .toLocaleString("it-IT", { weekday: "short", timeZone: "Europe/Rome" })
    .toLowerCase();
  const hourLocal = parseInt(
    rome.toLocaleString("it-IT", {
      hour: "2-digit",
      hour12: false,
      timeZone: "Europe/Rome",
    }),
    10
  );

  const isFri = weekday.startsWith("ven");
  const isSat = weekday.startsWith("sab");
  const isSun = weekday.startsWith("dom");
  const isMon = weekday.startsWith("lun");
  const isTue = weekday.startsWith("mar");

  if (isFri && hourLocal >= 9) return "SHOW_FORMATION";
  if (isSat || isSun || isMon) return "SHOW_FORMATION";
  if (isTue && hourLocal < 9) return "SHOW_FORMATION";
  return "SHOW_MESSAGE";
}

export default function FormazionePage() {
  const [published, setPublished] = useState(null);
  const [error, setError] = useState(null);
  const phase = windowPhase();

  useEffect(() => {
    document.title = "Formazione Consigliata | FantaBot";
  }, []);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const res = await fetch("/data/formazione_published.json", { cache: "no-store" });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        if (mounted) setPublished(data);
      } catch (e) {
        console.error(e);
        if (mounted) setError("Impossibile caricare la formazione pubblicata.");
      }
    })();
    return () => { mounted = false; };
  }, []);

  // Messaggio "Torna venerdì"
  if (phase === "SHOW_MESSAGE") {
    return (
      <div style={{ padding: "24px 20px", maxWidth: 1100, margin: "0 auto" }}>
        <h1 style={{ margin: "0 0 10px" }}>Formazione Consigliata</h1>
        <p style={{ marginTop: 0, lineHeight: 1.5 }}>
          Sto elaborando la migliore formazione per la prossima giornata.<br />
          Torna venerdì e troverai i <strong>TOP 11</strong> della prossima giornata!
        </p>
        {published && (
          <p style={{ opacity: 0.7, marginTop: 16 }}>
            (Ultima formazione pubblicata:{" "}
            {new Date(published.publishedAt).toLocaleString("it-IT", { timeZone: "Europe/Rome" })}
            )
          </p>
        )}
        {error && <p style={{ color: "#b00", marginTop: 12 }}>{error}</p>}
      </div>
    );
  }

  // Caricamento/errore quando dovremmo mostrare la formazione
  if (!published && !error) {
    return <div style={{ padding: 24 }}>Caricamento…</div>;
  }
  if (error) {
    return (
      <div style={{ padding: 24 }}>
        <h1>Formazione Consigliata</h1>
        <p style={{ color: "#b00" }}>{error}</p>
      </div>
    );
  }

  // Dati formazione pubblicata
  const moduleLabel = published?.module || "—";
  const starters = Array.isArray(published?.starters) ? published.starters : [];
  const bench = Array.isArray(published?.bench) ? published.bench : [];
  const publishedAtRome = published?.publishedAt
    ? new Date(published.publishedAt).toLocaleString("it-IT", { timeZone: "Europe/Rome" })
    : "—";

  return (
    <div style={{ padding: "24px 20px", maxWidth: 1100, margin: "0 auto" }}>
      <h1 style={{ margin: "0 0 4px" }}>Formazione Consigliata</h1>
      <div style={{ opacity: 0.8, marginBottom: 12 }}>
        Pubblicata: {publishedAtRome} • Modulo: <strong>{moduleLabel}</strong>
      </div>

      <FormationBoard starters={starters} bench={bench} formationLabel={moduleLabel} />
    </div>
  );
}

/** ===== Presentazione ===== */

function FormationBoard({ starters, bench, formationLabel }) {
  // Dispone i titolari per righe per ruolo (P / D / C / A)
  const rows = useMemo(() => {
    const byR = { P: [], D: [], C: [], A: [] };
    starters.forEach((p) => {
      const ruolo = (p.Ruolo || p.ruolo || "").toString().trim().toUpperCase().slice(0, 1);
      if (byR[ruolo]) byR[ruolo].push({ ...p, ruolo });
    });
    return ["P", "D", "C", "A"].map((r) => byR[r]);
  }, [starters]);

  return (
    <div>
      <h3 style={{ marginTop: 8 }}>Titolari ({formationLabel})</h3>
      {rows.map((line, idx) => (
        <div
          key={idx}
          style={{
            display: "flex",
            gap: 10,
            margin: "10px 0",
            justifyContent: "center",
            flexWrap: "wrap",
          }}
        >
          {line.map((p, i) => (
            <PlayerCard key={(p.Nome || p.nome || "") + i} player={p} highlight />
          ))}
        </div>
      ))}

      <h3 style={{ marginTop: 16 }}>Panchina (7)</h3>
      <div style={{ display: "flex", gap: 10, margin: "10px 0", flexWrap: "wrap" }}>
        {bench.map((p, i) => (
          <PlayerCard key={(p.Nome || p.nome || "") + i} player={p} />
        ))}
      </div>
    </div>
  );
}

function PlayerCard({ player, highlight = false }) {
  const nome = player.Nome || player.nome || "—";
  const squadra = player.Squadra || player.squadra || "—";
  const ruolo = (player.Ruolo || player.ruolo || "—").toString().toUpperCase();

  const score = typeof player.Score === "number" ? player.Score : player.score;
  const price = player._meta?.price ?? player["Qt. Attuale"];
  const init = player._meta?.init ?? player["Qt. Iniziale"];
  const trend = (typeof price === "number" && typeof init === "number") ? (price - init) : null;
  const diff = player._meta?.diff;

  return (
    <div
      style={{
        border: "1px solid #e1e1e1",
        borderRadius: 10,
        padding: 10,
        minWidth: 210,
        background: highlight ? "#fbfdf8" : "white",
        boxShadow: highlight ? "0 1px 0 rgba(0,0,0,0.05)" : "none",
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
        <strong>{ruolo}</strong>
        <span style={{ fontVariantNumeric: "tabular-nums" }}>
          {typeof score === "number" ? `Score: ${score.toFixed(3)}` : ""}
        </span>
      </div>
      <div style={{ fontWeight: 600 }}>{nome}</div>
      <div style={{ opacity: 0.85 }}>{squadra}</div>

      {(price !== undefined || diff !== undefined || trend !== null) && (
        <div style={{ fontSize: 13, opacity: 0.9, marginTop: 6 }}>
          {price !== undefined && init !== undefined && (
            <div>
              Prezzo: {price} (iniz: {init})
            </div>
          )}
          {trend !== null && (
            <div>Trend: {trend >= 0 ? "+" : ""}{Number(trend).toFixed(1)}</div>
          )}
          {diff !== undefined && <div>Diff. partita: {diff}</div>}
        </div>
      )}
    </div>
  );
}

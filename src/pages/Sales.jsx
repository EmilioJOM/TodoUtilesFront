import React, { useMemo, useState, useEffect } from "react";
import { wrap, card, input, tag, palette } from "../utils/styles.jsx";
import { SalesAPI } from "../api/index.jsx";

const currency = (n) => `$${n.toFixed(2)}`;

const Status = ({ s }) => {
  const color =
    s === "COMPRADA" ? "#10b981" :
    s === "PENDING" ? "#f59e0b" :
    "#ef4444";
  return (
    <span style={{
      ...tag, border: "none", background: `${color}1A`,
      color, fontWeight: 700
    }}>{s || "—"}</span>
  );
};

export default function Sales() {
  const [q, setQ] = useState("");
  const [data, setData] = useState([]);
  const [forbidden, setForbidden] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const r = await SalesAPI.list();
        console.log("Ventas recibidas:", r);
        const mapped = r.map(v => ({
          id: "#" + v.idVenta,
          user: v.nombreUsuario || "(usuario desconocido)",
          date: v.fecha || "—",
          total: v.total,
          status: v.estado || "—",
          method: v.metodoPago || "—",
        }));
        setData(mapped);
      } catch (err) {
        console.error(err);
        if (err?.status === 403) setForbidden(true);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const filtered = useMemo(() => {
    const t = q.trim().toLowerCase();
    if (!t) return data;
    return data.filter(x =>
      x.user.toLowerCase().includes(t) ||
      x.id.toLowerCase().includes(t)
    );
  }, [q, data]);

  if (loading) {
    return <div style={{ padding: 24 }}>Cargando ventas…</div>;
  }

  if (forbidden) {
    return (
      <div style={{ padding: 24, color: "red", fontWeight: 600 }}>
        ❌ No tenés permisos para ver esta sección.
      </div>
    );
  }

  return (
    <div style={{ ...wrap, marginTop: 8 }}>
      <h2>Ventas</h2>
      <div style={{ color: palette.muted, margin: "-4px 0 16px" }}>
        Administra y supervisa todas las ventas realizadas.
      </div>

      <div style={{ position: "relative", marginBottom: 12 }}>
        <input style={{ ...input, paddingLeft: 40 }} value={q}
          onChange={(e)=>setQ(e.target.value)}
          placeholder="Buscar ventas por usuario o id" />
        <span style={{ position: "absolute", left: 12, top: 10, opacity: 0.6 }}>🔎</span>
      </div>

      <div style={{ ...card }}>
        <div style={{
          display: "grid",
          gridTemplateColumns: "1fr 2fr 1.5fr 1fr 1.5fr 1.2fr",
          padding: "12px 16px",
          fontWeight: 700,
          borderBottom: `1px solid ${palette.border}`
        }}>
          <div>ID DE VENTA</div>
          <div>USUARIO</div>
          <div>FECHA</div>
          <div>TOTAL</div>
          <div>MÉTODO DE PAGO</div>
          <div>ESTADO</div>
        </div>

        {filtered.map((r, idx) => (
          <div key={idx} style={{
            display: "grid",
            gridTemplateColumns: "1fr 2fr 1.5fr 1fr 1.5fr 1.2fr",
            padding: "14px 16px",
            borderBottom: `1px solid ${palette.border}`
          }}>
            <div style={{ fontWeight: 700 }}>{r.id}</div>
            <div>{r.user}</div>
            <div>{r.date}</div>
            <div>{currency(r.total)}</div>
            <div>{r.method}</div>
            <div><Status s={r.status} /></div>
          </div>
        ))}
      </div>
    </div>
  );
}
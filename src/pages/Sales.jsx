import React, { useMemo, useState } from "react";
import { wrap, card, input, tag, palette } from "../utils/styles.jsx";

const SALES = [
  { id:"#12345", user:"Ana García",      date:"2024-07-26", total:150, status:"Completada" },
  { id:"#12346", user:"Carlos López",    date:"2024-07-25", total:200, status:"En proceso" },
  { id:"#12347", user:"Sofía Martínez",  date:"2024-07-24", total:75,  status:"Completada" },
  { id:"#12348", user:"Diego Rodríguez", date:"2024-07-23", total:300, status:"Completada" },
  { id:"#12349", user:"Isabel Fernández",date:"2024-07-22", total:120, status:"Cancelada" },
  { id:"#12350", user:"Javier Sánchez",  date:"2024-07-21", total:180, status:"Completada" },
  { id:"#12351", user:"Laura Pérez",     date:"2024-07-20", total:90,  status:"En proceso" },
  { id:"#12352", user:"Miguel Gómez",    date:"2024-07-19", total:250, status:"Completada" },
  { id:"#12353", user:"Paula Ruiz",      date:"2024-07-18", total:110, status:"Completada" },
  { id:"#12354", user:"Ricardo Torres",  date:"2024-07-17", total:160, status:"Cancelada" },
];

const currency = (n) => `$${n.toFixed(2)}`;

const Status = ({ s }) => {
  const color =
    s === "Completada" ? "#10b981" :
    s === "En proceso" ? "#f59e0b" :
    "#ef4444";
  return (
    <span style={{
      ...tag, border: "none", background: `${color}1A`,
      color, fontWeight: 700
    }}>{s}</span>
  );
};

export default function Sales() {
  const [q, setQ] = useState("");
  const data = useMemo(() => {
    const t = q.trim().toLowerCase();
    if (!t) return SALES;
    return SALES.filter(x =>
      x.user.toLowerCase().includes(t) ||
      x.id.toLowerCase().includes(t)
    );
  }, [q]);

  return (
    <div style={{ ...wrap, marginTop: 8 }}>
      <h2>Ventas</h2>
      <div style={{ color: palette.muted, margin: "-4px 0 16px" }}>
        Administra y supervisa todas las ventas realizadas.
      </div>

      <div style={{ position: "relative", marginBottom: 12 }}>
        <input style={{ ...input, paddingLeft: 40 }} value={q}
               onChange={(e)=>setQ(e.target.value)}
               placeholder="Buscar ventas por usuario" />
        <span style={{ position: "absolute", left: 12, top: 10, opacity: 0.6 }}>🔎</span>
      </div>

      <div style={{ ...card }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr 1.5fr 1fr 1.2fr",
                      padding: "12px 16px", fontWeight: 700, borderBottom: `1px solid ${palette.border}` }}>
          <div>ID DE VENTA</div><div>USUARIO</div><div>FECHA</div><div>TOTAL</div><div>ESTADO</div>
        </div>
        {data.map((r, idx) => (
          <div key={idx}
            style={{ display: "grid", gridTemplateColumns: "1fr 2fr 1.5fr 1fr 1.2fr",
                     padding: "14px 16px", borderBottom: `1px solid ${palette.border}` }}>
            <div style={{ fontWeight: 700 }}>{r.id}</div>
            <div>{r.user}</div>
            <div>{r.date}</div>
            <div>{currency(r.total)}</div>
            <div><Status s={r.status} /></div>
          </div>
        ))}
      </div>
    </div>
  );
}

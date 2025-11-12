import React, { useMemo, useState, useEffect } from "react";
import { SalesAPI } from "../api/index.jsx";
import PurchaseDetailModal from "../components/PurchaseDetailsModal.jsx";
import "./pagesStyles/Sales.css";

const currency = (n) => `$${n.toFixed(2)}`;

const Status = ({ s }) => {
  const color =
    s === "COMPRADA"
      ? "#10b981"
      : s === "PENDING"
      ? "#f59e0b"
      : "#ef4444";

  return (
    <span className="sales-status" style={{ color, background: `${color}1A` }}>
      {s || "—"}
    </span>
  );
};

export default function Sales() {
  const [q, setQ] = useState("");
  const [data, setData] = useState([]);
  const [forbidden, setForbidden] = useState(false);
  const [loading, setLoading] = useState(true);
  const [selectedSale, setSelectedSale] = useState(null);

  async function openDetails(idVenta) {
    const data = await SalesAPI.details(idVenta);
    setSelectedSale(data);
  }

  useEffect(() => {
    (async () => {
      try {
        const r = await SalesAPI.list();
        const mapped = r.map((v) => ({
          idVenta: v.idVenta,
          id: "#" + v.idVenta,
          user: v.nombreUsuario || "(usuario desconocido)",
          date: v.fecha ? new Date(v.fecha).toLocaleDateString("es-AR") : "—",
          total: v.total,
          status: v.estado || "—",
          method: v.metodoPago || "—",
        }));
        setData(mapped);
      } catch (err) {
        if (err?.status === 403) setForbidden(true);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const filtered = useMemo(() => {
    const t = q.trim().toLowerCase();
    if (!t) return data;
    return data.filter(
      (x) =>
        x.user.toLowerCase().includes(t) || x.id.toLowerCase().includes(t)
    );
  }, [q, data]);

  if (loading) return <div className="sales-loading">Cargando ventas…</div>;

  if (forbidden)
    return (
      <div className="sales-error">
        ❌ No tenés permisos para ver esta sección.
      </div>
    );

  return (
    <div className="sales-container">
      <h2 className="sales-title">Ventas</h2>
      <p className="sales-subtitle">
        Administra y supervisa todas las ventas realizadas.
      </p>

      <div className="sales-search">
        <input
          className="sales-input"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Buscar ventas por usuario o id"
        />
        <span className="sales-search-icon">🔎</span>
      </div>

      <div className="sales-card">
        <div className="sales-header">
          <div>ID DE VENTA</div>
          <div>USUARIO</div>
          <div>FECHA</div>
          <div>TOTAL</div>
          <div>MÉTODO DE PAGO</div>
          <div>ESTADO</div>
          <div></div>
        </div>

        {filtered.map((r, idx) => (
          <div key={idx} className="sales-row">
            <div className="sales-id">{r.id}</div>
            <div>{r.user}</div>
            <div>{r.date}</div>
            <div>{currency(r.total)}</div>
            <div>{r.method}</div>
            <div>
              <Status s={r.status} />
            </div>
            <div>
              {r.status === "COMPRADA" && (
                <button
                  className="sales-btn-details"
                  onClick={() => openDetails(r.idVenta)}
                >
                  Ver detalles
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      <PurchaseDetailModal
        open={!!selectedSale}
        sale={selectedSale}
        onClose={() => setSelectedSale(null)}
      />
    </div>
  );
}

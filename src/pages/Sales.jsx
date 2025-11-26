// src/pages/Sales.jsx
import React, { useMemo, useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import PurchaseDetailModal from "../components/PurchaseDetailsModal.jsx";
import "./pagesStyles/Sales.css";
import {
  fetchSales,
  fetchSaleDetails,
  clearDetails,
} from "../redux/salesSlice.js";

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
  const dispatch = useDispatch();
  const [q, setQ] = useState("");

  const { items, loadingList, errorList, details } = useSelector(
    (s) => s.sales
  );

  // cargar ventas al montar
  useEffect(() => {
    dispatch(fetchSales());
  }, [dispatch]);

  // mapeo de datos crudos -> estructura usada por la tabla (como antes)
  const data = useMemo(
    () =>
      (items || []).map((v) => ({
        idVenta: v.idVenta,
        id: "#" + v.idVenta,
        user: v.nombreUsuario || "(usuario desconocido)",
        date: v.fecha
          ? new Date(v.fecha).toLocaleDateString("es-AR")
          : "—",
        total: v.total,
        status: v.estado || "—",
        method: v.metodoPago || "—",
      })),
    [items]
  );

  const filtered = useMemo(() => {
    const t = q.trim().toLowerCase();
    if (!t) return data;
    return data.filter(
      (x) =>
        x.user.toLowerCase().includes(t) || x.id.toLowerCase().includes(t)
    );
  }, [q, data]);

  const openDetails = (idVenta) => {
    dispatch(fetchSaleDetails(idVenta));
  };

  if (loadingList)
    return <div className="sales-loading">Cargando ventas…</div>;

  if (errorList)
    return <div className="sales-error">Error: {errorList}</div>;

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
        open={!!details}
        sale={details}
        onClose={() => dispatch(clearDetails())}
      />
    </div>
  );
}

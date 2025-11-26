// src/pages/Purchases.jsx
import React, { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import PurchaseDetailModal from "../components/PurchaseDetailsModal.jsx";
import "./pagesStyles/Purchases.css";
import {
  fetchMyPurchases,
  fetchSaleDetails,
  clearDetails,
} from "../redux/salesSlice.js";

export default function Purchases() {
  const dispatch = useDispatch();

  const {
    myPurchases,
    loadingMy,
    errorMy,
    details: selectedSale,
  } = useSelector((s) => s.sales);

  useEffect(() => {
    dispatch(fetchMyPurchases());
  }, [dispatch]);

  // Reproduce la transformación que hacías antes con SalesAPI.myPurchases()
  const rows = useMemo(
    () =>
      (myPurchases || [])
        .filter((v) => v.estado?.toUpperCase() === "COMPRADA")
        .map((v) => ({
          idVenta: v.idVenta,
          id: "#" + v.idVenta,
          date: new Date(v.fecha).toLocaleDateString("es-AR"),
          total: v.total,
          method: v.metodoPago || "—",
        })),
    [myPurchases]
  );

  const openDetails = (idVenta) => {
    dispatch(fetchSaleDetails(idVenta));
  };

  if (loadingMy)
    return <div className="purchases-loading">Cargando compras…</div>;

  if (errorMy)
    return (
      <div className="purchases-container">
        <div style={{ color: "#b91c1c", padding: 16 }}>Error: {errorMy}</div>
      </div>
    );

  return (
    <div className="purchases-container">
      <h2 className="purchases-title">Mis compras</h2>
      <p className="purchases-subtitle">
        Aquí podés ver todas tus compras realizadas.
      </p>

      <div className="purchases-table">
        <div className="purchases-header">
          <div>ID</div>
          <div>FECHA</div>
          <div>TOTAL</div>
          <div>MÉTODO DE PAGO</div>
          <div></div>
        </div>

        {rows.map((r, i) => (
          <div key={i} className="purchases-row">
            <div>{r.id}</div>
            <div>{r.date}</div>
            <div>${r.total.toFixed(2)}</div>
            <div>{r.method}</div>

            <div>
              <button
                className="btn-details"
                onClick={() => openDetails(r.idVenta)}
              >
                Ver detalles
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      <PurchaseDetailModal
        open={!!selectedSale}
        sale={selectedSale}
        onClose={() => dispatch(clearDetails())}
      />
    </div>
  );
}

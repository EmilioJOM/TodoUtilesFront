import React, { useEffect, useState } from "react";
import { SalesAPI } from "../api/index.jsx";
import PurchaseDetailModal from "../components/PurchaseDetailsModal.jsx";
import "./pagesStyles/Purchases.css";

export default function Purchases() {
    const [rows, setRows] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedSale, setSelectedSale] = useState(null); 

    async function openDetails(idVenta) {
        const data = await SalesAPI.details(idVenta); 
        setSelectedSale(data);
    }

    useEffect(() => {
        (async () => {
            try {
                const r = await SalesAPI.myPurchases();

                const filtered = r
                    .filter(v => v.estado?.toUpperCase() === "COMPRADA")
                    .map(v => ({
                        idVenta: v.idVenta,
                        id: "#" + v.idVenta,
                        date: new Date(v.fecha).toLocaleDateString("es-AR"),
                        total: v.total,
                        method: v.metodoPago || "—",
                    }));

                setRows(filtered);
            } finally {
                setLoading(false);
            }
        })();
    }, []);

    if (loading) return <div className="purchases-loading">Cargando compras…</div>;

    return (
        <div className="purchases-container">
            <h2 className="purchases-title">Mis compras</h2>
            <p className="purchases-subtitle">Aquí podés ver todas tus compras realizadas.</p>

            <div className="purchases-table">
                <div className="purchases-header">
                    <div>ID</div>
                    <div>FECHA</div>
                    <div>TOTAL</div>
                    <div>MÉTODO DE PAGO</div>
                    <div></div> {/* columna para botón */}
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
                onClose={() => setSelectedSale(null)}
            />
        </div>
    );
}
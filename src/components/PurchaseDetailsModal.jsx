import React from "react";
import "./componentsStyles/PurchaseDetailModal.css";

export default function PurchaseDetailModal({ open, onClose, sale }) {
    if (!open) return null;

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <h3>Detalle de compra #{sale.idVenta}</h3>

                <table className="detail-table">
                    <thead>
                        <tr>
                            <th>Producto</th>
                            <th>Cantidad</th>
                            <th>Precio unitario</th>
                        </tr>
                    </thead>

                    <tbody>
                        {sale.productos?.map((p, i) => (
                            <tr key={i}>
                                <td>{p.description}</td>
                                <td>{p.quantity}</td>
                                <td>${p.price.toFixed(2)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                <div className="modal-footer">
                    <button className="close-btn" onClick={onClose}>
                        Cerrar
                    </button>
                </div>
            </div>
        </div>
    );
}
// src/pages/Payment.jsx
import React, { useState } from "react";
import { wrap, card, input, button, palette } from "../utils/styles.jsx";
import { CartAPI, SalesAPI } from "../api/index.jsx"; 

export default function Payment({ store }) {
  const [ok, setOk] = useState(false);
  const [loading, setLoading] = useState(false);
  const [metodo, setMetodo] = useState("TARJETA");
  const [error, setError] = useState("");


  const disabled = loading; 


  async function pagar() {
    setLoading(true);
    setError("");
    try {
      
      
      const codigoCupon = (store.coupon || "").trim() || undefined;
      await SalesAPI.confirm({ metodoPago: metodo, codigoCupon }); // PUT /ventas/confirm
      

      setOk(true); 
      store.clear(); 
      
    } catch (e) {
      setError(e?.message || "No se pudo procesar el pago. Intente nuevamente.");
    } finally {
      setLoading(false);
    }
  }


  async function cancelar() {
    setLoading(true);
    setError("");
    setOk(false); 
    
    try {
      
      await SalesAPI.cancel(); 
      

      window.location.hash = "#/";

    } catch (e) {
      setError(e?.message || "No se pudo cancelar la compra pendiente.");
    } finally {
      setLoading(false);
    }
  }

  if (ok) {
    return (
      <div style={{ ...wrap, maxWidth: 680 }}>
        <div style={{ ...card, padding: 24, textAlign: "center" }}>
          <h2>¡Pago confirmado! ✅</h2>
          <a href="#/" style={{ ...button(true), marginTop: 14 }}>Volver al inicio</a>
        </div>
      </div>
    );
  }

  return (
    <div style={{ ...wrap, maxWidth: 900 }}>
      <div style={{ textAlign: "center", margin: "12px 0 16px" }}>
      <h2 style={{ margin: 0 }}>Información de Pago</h2>
      <div style={{ color: palette.muted }}>Completa los datos para finalizar tu compra.</div>
      </div>

      <div style={{ ...card, padding: 16 }}>
        <div style={{ fontSize: 13, color: palette.muted, margin: "6px 0" }}>Método de Pago</div>
        <select style={input} value={metodo} onChange={(e) => setMetodo(e.target.value)} disabled={disabled}>
          <option value="TARJETA">Tarjeta</option>
          <option value="TRANSFERENCIA">Transferencia</option>
          <option value="EFECTIVO">Efectivo</option>
        </select>

        {/* Campos demo de tarjeta (opcionales/visual) */}
        <div style={{ fontSize: 13, color: palette.muted, margin: "10px 0 6px" }}>Número de Tarjeta</div>
        <input style={input} placeholder="0000 0000 0000 0000" disabled={disabled} />
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginTop: 12 }}>
          <div>
            <div style={{ fontSize: 13, color: palette.muted, margin: "6px 0" }}>Vencimiento</div>
            <input style={input} placeholder="MM/AA" disabled={disabled} />
          </div>
          <div>
            <div style={{ fontSize: 13, color: palette.muted, margin: "6px 0" }}>CVV</div>
            <input style={input} placeholder="123" disabled={disabled} />
          </div>
        </div>

        {!!error && <div style={{ color: "#b91c1c", marginTop: 12 }}>{error}</div>}
        
        {/* BOTÓN PAGAR Y CONFIRMAR */}
        <button onClick={pagar} disabled={disabled} style={{ ...button(true), width: "100%", marginTop: 16 }}>
          {loading ? "Procesando…" : "Pagar y confirmar"}
        </button>

        {/* BOTÓN CANCELAR COMPRA */}
        <button 
          onClick={cancelar} 
          disabled={disabled} 
          style={{ 
            ...button(false), 
            width: "100%", 
            marginTop: 12, 
            color: palette.ink, 
            background: '#e5e7eb', 
            border: `1px solid ${palette.muted}` 
          }}
        >
          {loading ? "Cancelando…" : "Cancelar compra"}
        </button>

        <div style={{ marginTop: 8, display: "flex", alignItems: "center", gap: 8, color: palette.muted }}>
          <span>🔒</span><small>Transacción segura y protegida.</small>
        </div>
      </div>
    </div>
  );
}
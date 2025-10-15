import React, { useState } from "react";
import Row from "../components/Row.jsx";
import { wrap, card, input, button } from "../utils/styles.jsx";
import { currency } from "../utils/Format.jsx";
import { getProducts } from "../utils/dataAPI.jsx";

export default function Product({ store, id }) {
  const p = getProducts().find((x) => x.id === id);
  const [qty, setQty] = useState(1);
  if (!p) return <div style={{ ...wrap, marginTop: 24 }}>Producto no encontrado.</div>;
  return (
    <div style={{ ...wrap, marginTop: 8, display: "grid", gridTemplateColumns: "1.2fr 1fr", gap: 24 }}>
      <div style={{ ...card, padding: 16, minHeight: 340 }}>
        <div style={{ height: 300, borderRadius: 12, background: "#e2e8f0" }} />
        <div style={{ display: "flex", gap: 12, marginTop: 12 }}>
          <div style={{ flex: 1, height: 70, borderRadius: 10, background: "#cbd5e1" }} />
          <div style={{ flex: 1, height: 70, borderRadius: 10, background: "#cbd5e1" }} />
          <div style={{ flex: 1, height: 70, borderRadius: 10, background: "#e5e7eb", display: "grid", placeItems: "center" }}>+</div>
        </div>
      </div>
      <div style={{ ...card, padding: 16 }}>
        <h1 style={{ margin: 0 }}>{p.name}</h1>
        <p style={{ color: "#6b7280" }}>Ideal para el día a día en la escuela o la oficina.</p>
        <div style={{ marginTop: 12 }}>
          <Row label="Precio" value={<b>{currency(p.price)}</b>} />
          <Row label="Stock" value={`${p.stock} unidades`} />
          <Row label="Categoría" value={p.cat} />
        </div>
        <div style={{ display: "flex", gap: 10, marginTop: 14 }}>
          <button onClick={() => setQty((q) => Math.max(1, q - 1))} style={button(false)}>-</button>
          <div style={{ ...input, width: 60, textAlign: "center" }}>{qty}</div>
          <button onClick={() => setQty((q) => q + 1)} style={button(false)}>+</button>
          <button onClick={() => { store.add(p.id, qty); window.location.hash = "#/cart"; }} style={button(true)}>
            🛒 Agregar al carrito
          </button>
        </div>
      </div>
    </div>
  );
}

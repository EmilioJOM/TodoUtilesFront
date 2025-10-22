import React from "react";
import { wrap, card, input, button, palette } from "../utils/styles.jsx";
import Row from "../components/Row.jsx";
import { currency } from "../utils/Format.jsx";

export default function Cart({ store }) {
return (
<div style={{ ...wrap, display: "grid", gridTemplateColumns: "1.2fr 0.8fr", gap: 24 }}>
<div style={{ ...card }}>
<div style={{ padding: 16, borderBottom: `1px solid ${palette.border}` }}>
<h2 style={{ margin: 0 }}>Carrito de Compras</h2>
</div>
{store.items.length === 0 ? (
<div style={{ padding: 16 }}>Tu carrito está vacío.</div>
) : (
store.items.map((i) => (
<div key={i.id} style={{ display: "grid", gridTemplateColumns: "1.4fr 0.6fr 0.6fr 0.3fr", padding: "12px 16px", borderBottom: `1px solid ${palette.border}`, alignItems: "center" }}>
<div>
<div style={{ fontWeight: 700 }}>{i.product.name}</div>
</div>
<div>
<input type="number" min={1} value={i.qty} onChange={(e) => store.setQty(i.id, parseInt(e.target.value || "1", 10))} style={{ ...input, width: 70 }} />
</div>
<div style={{ fontWeight: 700 }}>{currency(i.product.price * i.qty)}</div>
<button onClick={() => store.remove(i.id)} style={button(false)}>🗑️</button>
</div>
))
)}
</div>


<div style={{ ...card, padding: 16, height: "fit-content" }}>
<h3 style={{ marginTop: 0 }}>Resumen del Pedido</h3>
<Row label="Subtotal" value={currency(store.subtotal)} />
<Row label="Envío" value={store.subtotal ? "Gratis" : currency(0)} />
<Row label="Impuestos (est.)" value={currency(store.taxes)} />
{store.discount > 0 && <Row label="Descuento" value={`- ${currency(store.discount)} (${COUPON.code})`} />}
<div style={{ display: "flex", gap: 8, marginTop: 10 }}>
<input placeholder="Cupón (opcional)" value={store.coupon} onChange={(e) => store.setCoupon(e.target.value.trim())} style={{ ...input }} />
<button onClick={() => store.setCoupon(store.coupon === COUPON.code ? "" : COUPON.code)} style={button(false)}>
{store.coupon === COUPON.code ? "Quitar" : "Aplicar"}
</button>
</div>
<div style={{ display: "flex", justifyContent: "space-between", marginTop: 14, fontSize: 18, fontWeight: 900 }}>
<span>Total</span>
<span>{currency(store.total)}</span>
</div>
<a href="#/shipping" style={{ ...button(true), display: "block", textAlign: "center", marginTop: 12 }}>
Confirmar Carrito
</a>
</div>
</div>
);
}
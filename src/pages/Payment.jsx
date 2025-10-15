import React, { useState } from "react";
import { wrap, card, input, button, palette } from "../utils/styles.jsx";


export default function Payment({ store }) {
const [ok, setOk] = useState(false);
const disabled = store.items.length === 0;


return (
<div style={{ ...wrap, maxWidth: 900 }}>
<div style={{ textAlign: "center", margin: "12px 0 16px" }}>
<h2 style={{ margin: 0 }}>Información de Pago</h2>
<div style={{ color: palette.muted }}>Completa los datos de tu tarjeta para finalizar tu compra.</div>
</div>


<div style={{ ...card, padding: 16 }}>
<div style={{ fontSize: 13, color: palette.muted, margin: "6px 0" }}>Número de Tarjeta</div>
<input style={{ ...input }} placeholder="0000 0000 0000 0000" disabled={disabled} />
<div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginTop: 12 }}>
<div>
<div style={{ fontSize: 13, color: palette.muted, margin: "6px 0" }}>Fecha de Vencimiento</div>
<input style={input} placeholder="MM/AA" disabled={disabled} />
</div>
<div>
<div style={{ fontSize: 13, color: palette.muted, margin: "6px 0" }}>CVV</div>
<input style={input} placeholder="123" disabled={disabled} />
</div>
</div>


<button onClick={() => { setOk(true); store.clear(); }} disabled={disabled} style={{ ...button(true), width: "100%", marginTop: 16, opacity: disabled ? 0.6 : 1 }}>
Crear Venta
</button>
{ok && <div style={{ marginTop: 12, color: "#059669", fontWeight: 700 }}>¡Listo! Compra realizada con éxito 🎉</div>}
</div>
</div>
);
}
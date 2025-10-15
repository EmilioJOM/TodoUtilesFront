import React from "react";
import { wrap, palette, card, button } from "../utils/styles.jsx";


export default function Hero() {
return (
<div style={{ ...card, ...wrap, padding: 24, display: "grid", gridTemplateColumns: "1.5fr 1fr", gap: 16, marginTop: 8 }}>
<div>
<div style={{ fontSize: 40, fontWeight: 900, color: palette.ink, lineHeight: 1.1 }}>
Todo para tu <span style={{ color: palette.brand2 }}>oficina</span> y <span style={{ color: palette.brand2 }}>escuela</span> en un solo lugar.
</div>
<div style={{ marginTop: 12, color: palette.muted }}>Encuentra los mejores útiles, con la mejor calidad y al mejor precio.</div>
<div style={{ marginTop: 16 }}>
<a href="#/search" style={button(true)}>Ver productos</a>
</div>
</div>
<div style={{ background: "linear-gradient(135deg,#e9eefc,#ffffff)", borderRadius: 16, minHeight: 160, display: "flex", alignItems: "center", justifyContent: "center" }}>
<div style={{ width: 120, height: 160, background: "#f1f5f9", border: `1px solid ${palette.border}`, borderRadius: 8 }} />
</div>
</div>
);
}
import React from "react";
import { card, button, palette } from "../utils/styles.jsx";


export default function OfferCard({ title, text }) {
return (
<div style={{ ...card, padding: 16 }}>
<div style={{ height: 120, borderRadius: 12, background: "#dbeafe", marginBottom: 10 }} />
<div style={{ fontWeight: 800 }}>{title}</div>
<div style={{ color: palette.muted, margin: "6px 0 10px" }}>{text}</div>
<a href="#/search" style={button(false)}>Ver oferta</a>
</div>
);
}
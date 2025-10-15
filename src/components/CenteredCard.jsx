import React from "react";
import { card, palette } from "../utils/styles.jsx";


export default function CenteredCard({ title, subtitle, children }) {
return (
<div style={{ display: "grid", placeItems: "center", minHeight: "60vh" }}>
<div style={{ ...card, padding: 20, width: 420, maxWidth: "95vw" }}>
<h2 style={{ margin: "0 0 4px" }}>{title}</h2>
{subtitle && <div style={{ color: palette.muted, marginBottom: 10 }}>{subtitle}</div>}
{children}
</div>
</div>
);
}
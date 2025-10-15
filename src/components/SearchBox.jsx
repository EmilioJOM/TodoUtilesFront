import React from "react";
import { input } from "../utils/styles.jsx";


export default function SearchBox({ value, onChange }) {
return (
<div style={{ position: "relative" }}>
<input
placeholder="Buscar productos…"
value={value}
onChange={(e) => onChange(e.target.value)}
style={{ ...input, minWidth: 280, paddingLeft: 40 }}
/>
<span style={{ position: "absolute", left: 12, top: 10, opacity: 0.6 }}>🔎</span>
</div>
);
}
import React from "react";
import { wrap } from "../utils/styles.jsx";


export default function Section({ title, children, link }) {
return (
<div style={{ ...wrap, marginTop: 24 }}>
<div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 10 }}>
<div style={{ fontSize: 20, fontWeight: 800 }}>{title}</div>
{link}
</div>
{children}
</div>
);
}
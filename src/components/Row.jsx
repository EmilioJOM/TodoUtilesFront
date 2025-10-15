import React from "react";
import { palette } from "../utils/styles.jsx";


export default function Row({ label, value }) {
return (
<div style={{ display: "flex", borderBottom: `1px solid ${palette.border}`, padding: "10px 0", alignItems: "center" }}>
<div style={{ color: palette.muted, width: 140 }}>{label}</div>
<div>{value}</div>
</div>
);
}
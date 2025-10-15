import React from "react";
import { wrap, palette } from "../utils/styles.jsx";


export default function Footer() {
return (
<div style={{ marginTop: 32, padding: "24px 0", borderTop: `1px solid ${palette.border}`, color: palette.muted, fontSize: 13 }}>
<div style={{ ...wrap, display: "flex", justifyContent: "space-between", gap: 16, flexWrap: "wrap" }}>
<div>© 2025 Todo Útiles. Todos los derechos reservados.</div>
<div style={{ display: "flex", gap: 16 }}>
<span>Política de Privacidad</span>
<span>Términos de Servicio</span>
<span>Contacto</span>
</div>
</div>
</div>
);
}
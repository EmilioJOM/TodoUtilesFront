import React from "react";
import { wrap, palette } from "../utils/styles.jsx";
import SearchBox from "./SearchBox.jsx";

const A = ({ to, children, title }) => (
<a href={to} title={title} style={{ color: palette.ink, textDecoration: "none", fontWeight: 600 }}>
{children}
</a>
);


export default function Nav({ onSearch, q, user }) {
return (
<div style={{ ...wrap, display: "flex", alignItems: "center", gap: 16, height: 64 }}>
<a href="#/" style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none" }}>
  <img src="/logo definitivo chico.png" alt="Todo Útiles"
    style={{
      width: 30,
      height: 30,
      borderRadius: 1,
      objectFit: "cover",     // evita deformaciones
      display: "block"
    }}
  /><div style={{ fontWeight: 800, color: palette.ink, fontSize: 18 }}>Todo Útiles</div>
</a>
<div style={{ marginLeft: 24, display: "flex", gap: 18 }}>
        <A to="#/">Inicio</A>
        <A to="#/search">Productos</A>
        <A to="#/about">Contacto</A>
        {/* Admin (demo) */}
        <A to="#/admin/new">Nuevo</A>
        <A to="#/admin/sales">Ventas</A>
        <A to="#/admin/coupons">Cupones</A>
      </div>

<div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 12 }}>
<SearchBox value={q} onChange={onSearch} />
<A to="#/cart" title="Carrito">🛒</A>
{user ? <A to="#/account">Hola, {user.name?.split(" ")[0] || "Usuario"}</A> : <A to="#/login">Iniciar sesión</A>}
</div>
</div>
);
}
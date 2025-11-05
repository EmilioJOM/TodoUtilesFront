import React, { useEffect, useRef, useState } from "react";
import { wrap, palette } from "../utils/styles.jsx";
import SearchBox from "./SearchBox.jsx";
import useStore from "../store/UseStore.jsx";

const A = ({ to, children, title, style }) => (
  <a
    href={to}
    title={title}
    style={{
      color: palette.ink,
      textDecoration: "none",
      fontWeight: 600,
      ...style,
    }}
  >
    {children}
  </a>
);

export default function Nav({ onSearch, q }) {
  const { user, isAdmin, logout, cartCount } = useStore(); 
  const admin = isAdmin();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  
  useEffect(() => {
    const onDocClick = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("click", onDocClick);
    return () => document.removeEventListener("click", onDocClick);
  }, []);

  const handleLogout = () => {
    logout();
    setMenuOpen(false);
    window.location.hash = "#/login"; // o "#/" si preferís volver a inicio
  };

  return (
    <nav className="barraNavegacion">
      <div
        style={{
          ...wrap,
          display: "flex",
          alignItems: "center",
          gap: 16,
          height: 64,
        }}
      >
        {/* Logo */}
        <a
          href="#/"
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            textDecoration: "none",
          }}
        >
          <img
            src="/logo definitivo chico.png"
            alt="Todo Útiles"
            style={{
              width: 30,
              height: 30,
              borderRadius: 1,
              objectFit: "cover",
              display: "block",
            }}
          />
          <div style={{ fontWeight: 800, color: palette.ink, fontSize: 18 }}>
            Todo Útiles
          </div>
        </a>

        {/* Menú principal */}
        <div style={{ marginLeft: 24, display: "flex", gap: 18 }}>
          <A to="#/">Inicio</A>
          <A to="#/search">Productos</A>
          <A to="#/about">Contacto</A>
          {admin ? (
            <>
              <A to="#/admin/new">Nuevo</A>
              <A to="#/admin/sales">Ventas</A>
              <A to="#/admin/coupons">Cupones</A>
            </>
          ) : user ? (
            <>
              <A to="#/purchases">Compras</A>
            </>
          ) : null}
        </div>

        {/* Barra derecha: búsqueda, carrito y usuario */}
        <div
          style={{
            marginLeft: "auto",
            display: "flex",
            alignItems: "center",
            gap: 12,
          }}
        >
          <div style={{ flexShrink: 1 }}>
            <SearchBox value={q} onChange={onSearch} />
          </div>

          {/* Carrito */}
          <div style={{ position: "relative" }}>
            <A
              to="#/cart"
              title="Carrito"
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: 36,
                height: 36,
                borderRadius: 6,
                fontSize: 18,
                cursor: "pointer",
                flexShrink: 0,
                position: "relative",
              }}
            >
              <span className="cart-icon">
                <svg
                  strokeLinejoin="round"
                  strokeLinecap="round"
                  strokeWidth="2"
                  stroke="currentColor"
                  fill="none"
                  viewBox="0 0 24 24"
                  height="24"
                  width="24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <circle r="1" cy="21" cx="9"></circle>
                  <circle r="1" cy="21" cx="20"></circle>
                  <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
                </svg>
              </span>

              {/* Contador de carrito */}
              {cartCount > 0 && (
                <span
                  style={{
                    position: "absolute",
                    top: -4,
                    right: -4,
                    backgroundColor: "#f44336",
                    color: "white",
                    fontSize: 12,
                    fontWeight: 600,
                    borderRadius: "50%",
                    width: 18,
                    height: 18,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    boxShadow: "0 0 4px rgba(0,0,0,0.2)",
                  }}
                >
                  {cartCount}
                </span>
              )}
            </A>
          </div>

          {/* Menú usuario */}
          {user ? (
            <div ref={menuRef} style={{ position: "relative" }}>
              <button
                onClick={() => setMenuOpen((v) => !v)}
                aria-haspopup="menu"
                aria-expanded={menuOpen}
                style={{
                  border: "none",
                  background: "transparent",
                  fontWeight: 600,
                  color: palette.ink,
                  cursor: "pointer",
                }}
              >
                Hola, {user.name?.split(" ")[0] || "Usuario"} ▾
              </button>

              {menuOpen && (
                <div
                  role="menu"
                  style={{
                    position: "absolute",
                    right: 0,
                    top: "110%",
                    background: "#fff",
                    border: "1px solid #eee",
                    borderRadius: 8,
                    boxShadow: "0 8px 24px rgba(0,0,0,0.10)",
                    minWidth: 170,
                    padding: 6,
                    zIndex: 1000,
                  }}
                >
                  <A
                    to="#/account"
                    style={{ display: "block", padding: "8px 10px" }}
                  >
                    Mi cuenta
                  </A>
                  <button
                    onClick={handleLogout}
                    role="menuitem"
                    style={{
                      width: "100%",
                      textAlign: "left",
                      padding: "8px 10px",
                      border: "none",
                      background: "transparent",
                      color: palette.ink,
                      fontWeight: 600,
                      cursor: "pointer",
                    }}
                  >
                    Cerrar sesión
                  </button>
                </div>
              )}
            </div>
          ) : (
            <A to="#/login">Iniciar sesión</A>
          )}
        </div>
      </div>
    </nav>
  );
}

// src/components/Nav.jsx
import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../redux/authSlice";

export default function Nav() {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);

  const isAdmin = user?.role === "ADMIN" || user?.role === "ROLE_ADMIN";

  const logoutAction = () => {
    dispatch(logout());
    window.location.hash = "#/login";
  };

  return (
    <nav
      style={{
        display: "flex",
        justifyContent: "space-between",
        padding: "12px 16px",
        background: "#222",
        color: "white",
        alignItems: "center",
      }}
    >
      {/* ---- Lado izquierdo ---- */}
      <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
        <a href="#/" style={{ color: "white", textDecoration: "none" }}>
          Inicio
        </a>

        <a href="#/products" style={{ color: "white", textDecoration: "none" }}>
          Productos
        </a>

        {user && (
          <a href="#/cart" style={{ color: "white", textDecoration: "none" }}>
            Carrito
          </a>
        )}

        {user && (
          <a href="#/purchases" style={{ color: "white", textDecoration: "none" }}>
            Mis compras
          </a>
        )}

        {isAdmin && (
          <a href="#/admin" style={{ color: "gold", textDecoration: "none" }}>
            Admin
          </a>
        )}
      </div>

      {/* ---- Lado derecho ---- */}
      <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
        {!user && (
          <>
            <a href="#/login" style={{ color: "white", textDecoration: "none" }}>
              Ingresar
            </a>
            <a href="#/register" style={{ color: "white", textDecoration: "none" }}>
              Registrar
            </a>
          </>
        )}

        {user && (
          <>
            <span style={{ marginRight: 8 }}>
              Hola, {user.name || user.email}
            </span>
            <button
              onClick={logoutAction}
              style={{
                padding: "6px 12px",
                background: "crimson",
                color: "white",
                border: "none",
                borderRadius: 4,
                cursor: "pointer",
              }}
            >
              Salir
            </button>
          </>
        )}
      </div>
    </nav>
  );
}

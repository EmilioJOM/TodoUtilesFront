import React, { useState, useEffect } from "react";
import { input, palette } from "../utils/styles.jsx";
import "./pagesStyles/Login.css";

import { useDispatch, useSelector } from "react-redux";
import { login, selectAuthStatus, selectAuthError, clearAuthError } from "../redux/authSlice";

export default function Login() {
  const dispatch = useDispatch();
  const status = useSelector(selectAuthStatus);
  const error = useSelector(selectAuthError);

  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");

  const loading = status === "loading";

  useEffect(() => {
    // opcional: limpiar error al entrar a la pantalla
    dispatch(clearAuthError());
  }, [dispatch]);

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(clearAuthError());
    dispatch(login({ email, password: pass }));
  };

  return (
    <div className="login">
      <form onSubmit={handleSubmit}>
        <h2>Iniciar Sesión</h2>

        <input
          style={{ ...input, width: "90%" }}
          placeholder="Correo electrónico o nombre de usuario"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          name="email"
          autoComplete="username"
        />

        <input
          style={{ ...input, marginTop: 10, width: "90%" }}
          placeholder="Contraseña"
          type="password"
          value={pass}
          onChange={(e) => setPass(e.target.value)}
          name="password"
          autoComplete="current-password"
        />

        {error && <div style={{ color: "red", fontSize: 13, marginTop: 8 }}>{error}</div>}

        <button className="login-button" type="submit" disabled={loading}>
          {loading ? "Ingresando…" : "Iniciar Sesión"}
        </button>

        <div style={{ fontSize: 13, marginTop: 10, color: palette.muted }}>
          ¿No tienes una cuenta? <a href="#/register">Regístrate</a>
        </div>
      </form>
    </div>
  );
}

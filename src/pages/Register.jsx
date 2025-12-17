import React, { useEffect, useState } from "react";
import "./pagesStyles/Register.css";

import { useDispatch, useSelector } from "react-redux";
import { register, selectAuthStatus, selectAuthError, clearAuthError } from "../redux/authSlice";

export default function Register() {
  const dispatch = useDispatch();
  const status = useSelector(selectAuthStatus);
  const authError = useSelector(selectAuthError);

  const [f, setF] = useState({ name: "", last: "", email: "", pass: "", pass2: "" });
  const [error, setError] = useState("");

  const loading = status === "loading";
  const valid = f.name && f.email && f.pass && f.pass === f.pass2;

  useEffect(() => {
    // opcional: limpiamos error al entrar
    dispatch(clearAuthError());
    setError("");
  }, [dispatch]);

  useEffect(() => {
    // si authSlice tira error, lo mostramos con el mismo estilo local
    if (authError) setError(authError);
  }, [authError]);

  const handleRegister = async () => {
    setError("");
    dispatch(clearAuthError());

    const action = await dispatch(
      register({
        firstname: f.name,
        lastname: f.last,
        email: f.email,
        password: f.pass,
      })
    );

    // si fue OK, volvemos a home
    if (register.fulfilled.match(action)) {
      window.location.hash = "#/";
    }
  };

  return (
    <div className="register">
      <div>
        <h2>Crear Cuenta</h2>

        <div className="register-names">
          <input
            placeholder="Nombre"
            value={f.name}
            onChange={(e) => setF({ ...f, name: e.target.value })}
          />
          <input
            placeholder="Apellido"
            value={f.last}
            onChange={(e) => setF({ ...f, last: e.target.value })}
          />
        </div>

        <input
          placeholder="Correo electrónico"
          value={f.email}
          onChange={(e) => setF({ ...f, email: e.target.value })}
        />
        <input
          placeholder="Contraseña"
          type="password"
          value={f.pass}
          onChange={(e) => setF({ ...f, pass: e.target.value })}
        />
        <input
          placeholder="Confirmar contraseña"
          type="password"
          value={f.pass2}
          onChange={(e) => setF({ ...f, pass2: e.target.value })}
        />

        {error && <div className="register-error">{error}</div>}

        <button
          className="register-button"
          onClick={handleRegister}
          disabled={!valid || loading}
        >
          {loading ? "Creando…" : "Registrarse"}
        </button>

        <div className="register-footer">
          ¿Ya tienes una cuenta? <a href="#/login">Inicia sesión</a>
        </div>
      </div>
    </div>
  );
}
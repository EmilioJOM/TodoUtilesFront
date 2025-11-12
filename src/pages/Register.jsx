import React, { useState } from "react";
import useStore from "../store/UseStore.jsx";
import "./pagesStyles/Register.css";

export default function Register() {
  const [f, setF] = useState({ name: "", last: "", email: "", pass: "", pass2: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const valid = f.name && f.email && f.pass && f.pass === f.pass2;
  const store = useStore();

  const handleRegister = async () => {
    setError("");
    setLoading(true);
    try {
      await store.register({
        firstname: f.name,
        lastname: f.last,
        email: f.email,
        password: f.pass,
      });
      window.location.hash = "#/";
    } catch (e) {
      setError(e?.message || "El registro falló. Verifica los datos.");
    } finally {
      setLoading(false);
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
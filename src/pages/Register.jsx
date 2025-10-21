import React, { useState } from "react";
import CenteredCard from "../components/CenteredCard.jsx";
import { input, button, palette } from "../utils/styles.jsx";
import { AuthAPI } from "../api/index.jsx";

export default function Register({ setUser }) {
  const [f, setF] = useState({ name: "", last: "", email: "", pass: "", pass2: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const valid = f.name && f.email && f.pass && f.pass === f.pass2;

  const handleRegister = async () => {
    setError("");
    setLoading(true);
    try {
      const r = await AuthAPI.register({
        firstname: f.name,
        lastname: f.last,
        email: f.email,
        password: f.pass,
        // role: "USER" // opcional, AuthAPI ya default "USER"
      });
      // AuthAPI setea el token (si r.access_token)
      setUser({ name: f.name || f.email.split("@")[0] || "Usuario", email: f.email });
      window.location.hash = "#/";
    } catch (e) {
      setError(e?.message || "El registro falló. Verifica los datos.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <CenteredCard
      title="Crea tu cuenta"
      subtitle="Únete y descubre un mundo de útiles escolares y de oficina."
    >
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
        <input
          style={input}
          placeholder="Nombre"
          value={f.name}
          onChange={(e) => setF({ ...f, name: e.target.value })}
        />
        <input
          style={input}
          placeholder="Apellido"
          value={f.last}
          onChange={(e) => setF({ ...f, last: e.target.value })}
        />
      </div>

      <input
        style={{ ...input, marginTop: 10 }}
        placeholder="Correo electrónico"
        value={f.email}
        onChange={(e) => setF({ ...f, email: e.target.value })}
      />
      <input
        style={{ ...input, marginTop: 10 }}
        placeholder="Contraseña"
        type="password"
        value={f.pass}
        onChange={(e) => setF({ ...f, pass: e.target.value })}
      />
      <input
        style={{ ...input, marginTop: 10 }}
        placeholder="Confirmar contraseña"
        type="password"
        value={f.pass2}
        onChange={(e) => setF({ ...f, pass2: e.target.value })}
      />

      {error && <div style={{ color: "red", fontSize: 13, marginTop: 8 }}>{error}</div>}

      <button
        disabled={!valid || loading}
        style={{ ...button(true), width: "100%", marginTop: 12, opacity: valid && !loading ? 1 : 0.6 }}
        onClick={handleRegister}
      >
        {loading ? "Creando…" : "Registrarse"}
      </button>

      <div style={{ fontSize: 13, marginTop: 10, color: palette.muted }}>
        ¿Ya tienes una cuenta? <a href="#/login">Inicia sesión</a>
      </div>
    </CenteredCard>
  );
}

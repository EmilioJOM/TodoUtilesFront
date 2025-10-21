import React, { useState } from "react";
import CenteredCard from "../components/CenteredCard.jsx";
import { input, button, palette } from "../utils/styles.jsx";
import { AuthAPI } from "../api/index.jsx";

export default function Login({ setUser }) {
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setError("");
    setLoading(true);
    try {
      const r = await AuthAPI.login({ email, password: pass });
      // AuthAPI ya guarda el token si viene en r.access_token
      setUser({ name: email.split("@")[0] || "Usuario", email });
      window.location.hash = "#/";
    } catch (e) {
      setError(e?.message || "Usuario o contraseña incorrecta");
    } finally {
      setLoading(false);
    }
  };

  return (
    <CenteredCard title="Iniciar Sesión">
      <input
        style={input}
        placeholder="Correo electrónico o nombre de usuario"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        style={{ ...input, marginTop: 10 }}
        placeholder="Contraseña"
        type="password"
        value={pass}
        onChange={(e) => setPass(e.target.value)}
      />

      {error && (
        <div style={{ color: "red", fontSize: 13, marginTop: 8 }}>
          {error}
        </div>
      )}

      <a
        href="#/forgot"
        style={{ fontSize: 13, color: palette.muted, marginTop: 8, alignSelf: "start" }}
      >
        ¿Olvidaste tu contraseña?
      </a>

      <button
        style={{ ...button(true), width: "100%", marginTop: 12, opacity: loading ? 0.8 : 1 }}
        onClick={handleLogin}
        disabled={loading}
      >
        {loading ? "Ingresando…" : "Iniciar Sesión"}
      </button>

      <div style={{ fontSize: 13, marginTop: 10, color: palette.muted }}>
        ¿No tienes una cuenta? <a href="#/register">Regístrate</a>
      </div>
    </CenteredCard>
  );
}

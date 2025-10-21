import React, { useState } from "react";
import CenteredCard from "../components/CenteredCard.jsx";
import { input, button, palette } from "../utils/styles.jsx";

export default function Login({ setUser }) {
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async () => {
    setError("");

    try {
      const response = await fetch("http://localhost:8080/api/v1/auth/authenticate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email,
          password: pass,
        }),
      });

      if (!response.ok) {
        setError("Usuario o contraseña incorrecta");
        return;
      }

      const data = await response.json();
      console.log("Login exitoso:", data);

      // Guarda el token si tu backend lo devuelve
      localStorage.setItem("token", data.token || "");

      setUser({ name: email.split("@")[0] || "Usuario", email });
      window.location.hash = "#/";
    } catch (err) {
      setError("Usuario o contraseña incorrecta");
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
        style={{
          fontSize: 13,
          color: palette.muted,
          marginTop: 8,
          alignSelf: "start",
        }}
      >
        ¿Olvidaste tu contraseña?
      </a>

      <button
        style={{ ...button(true), width: "100%", marginTop: 12 }}
        onClick={handleLogin}
      >
        Iniciar Sesión
      </button>

      <div style={{ fontSize: 13, marginTop: 10, color: palette.muted }}>
        ¿No tienes una cuenta? <a href="#/register">Regístrate</a>
      </div>
    </CenteredCard>
  );
}

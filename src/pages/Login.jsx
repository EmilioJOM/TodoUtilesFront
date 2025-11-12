import React, { useState } from "react";
import CenteredCard from "../components/CenteredCard.jsx";
import { input, button, palette } from "../utils/styles.jsx";
import useStore from "../store/UseStore.jsx";
import "./pagesStyles/Login.css"

export default function Login() {
  const [email, setEmail] = useState("");
  const [pass, setPass]   = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const store = useStore();

  const handleLogin = async () => {
    setError(""); setLoading(true);
    try {
      await store.login({ email, password: pass });
      window.location.hash = "#/";
    } catch (e) {
      setError(e?.message || "Usuario o contraseña incorrecta");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login">
      <div>
        <h2>Iniciar Sesión</h2>
        <input
          style={{...input, width:"90%"}}
          placeholder="Correo electrónico o nombre de usuario"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          style={{ ...input, marginTop: 10, width:"90%" }}
          placeholder="Contraseña"
          type="password"
          value={pass}
          onChange={(e) => setPass(e.target.value)}
        />

        {error && <div style={{ color: "red", fontSize: 13, marginTop: 8 }}>{error}</div>}

        

        <button
  className="login-button"
  onClick={handleLogin}
  disabled={loading}
>
  {loading ? "Ingresando…" : "Iniciar Sesión"}
</button>


        <div style={{ fontSize: 13, marginTop: 10, color: palette.muted }}>
          ¿No tienes una cuenta? <a href="#/register">Regístrate</a>
        </div>
      </div>
    </div>
  );
}

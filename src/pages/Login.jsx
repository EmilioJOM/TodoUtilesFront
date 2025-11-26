// src/pages/Login.jsx
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import CenteredCard from "../components/CenteredCard.jsx";
import { input, button } from "../utils/styles.jsx";
import { loginUser } from "../redux/authSlice.js";

export default function Login() {
  const dispatch = useDispatch();
  const { loading, error, user } = useSelector((s) => s.auth);

  const [form, setForm] = useState({ email: "", password: "" });

  const onSubmit = (e) => {
    e.preventDefault();
    dispatch(loginUser(form))
      .unwrap()
      .then(() => {
        window.location.hash = "#/"; // o navigate, como lo tengas
      })
      .catch(() => {
        // el error ya queda en el slice
      });
  };

  return (
    <CenteredCard title="Iniciar sesión">
      <form onSubmit={onSubmit}>
        <div>
          <input
            style={input}
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={(e) =>
              setForm((f) => ({ ...f, email: e.target.value }))
            }
          />
        </div>
        <div style={{ marginTop: 8 }}>
          <input
            style={input}
            type="password"
            placeholder="Contraseña"
            value={form.password}
            onChange={(e) =>
              setForm((f) => ({ ...f, password: e.target.value }))
            }
          />
        </div>
        {error && (
          <div style={{ color: "red", marginTop: 8, fontSize: 13 }}>
            {error}
          </div>
        )}
        <button
          type="submit"
          style={{ ...button(true), marginTop: 12, opacity: loading ? 0.6 : 1 }}
          disabled={loading}
        >
          {loading ? "Ingresando..." : "Ingresar"}
        </button>
      </form>
    </CenteredCard>
  );
}

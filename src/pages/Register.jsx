// src/pages/Register.jsx
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import CenteredCard from "../components/CenteredCard.jsx";
import { input, button } from "../utils/styles.jsx";
import { registerUser } from "../redux/authSlice.js";

export default function Register() {
  const dispatch = useDispatch();
  const { loading, error } = useSelector((s) => s.auth);

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });

  const onSubmit = (e) => {
    e.preventDefault();
    dispatch(registerUser(form))
      .unwrap()
      .then(() => {
        window.location.hash = "#/";
      })
      .catch(() => {
        /* El error ya está en Redux */
      });
  };

  return (
    <CenteredCard title="Crear cuenta">
      <form onSubmit={onSubmit}>
        <input
          style={input}
          placeholder="Nombre"
          value={form.firstName}
          onChange={(e) =>
            setForm((f) => ({ ...f, firstName: e.target.value }))
          }
        />

        <input
          style={{ ...input, marginTop: 10 }}
          placeholder="Apellido"
          value={form.lastName}
          onChange={(e) =>
            setForm((f) => ({ ...f, lastName: e.target.value }))
          }
        />

        <input
          style={{ ...input, marginTop: 10 }}
          placeholder="Email"
          type="email"
          value={form.email}
          onChange={(e) =>
            setForm((f) => ({ ...f, email: e.target.value }))
          }
        />

        <input
          style={{ ...input, marginTop: 10 }}
          placeholder="Contraseña"
          type="password"
          value={form.password}
          onChange={(e) =>
            setForm((f) => ({ ...f, password: e.target.value }))
          }
        />

        {error && (
          <div style={{ marginTop: 10, color: "red", fontSize: 13 }}>
            {error}
          </div>
        )}

        <button
          type="submit"
          style={{ ...button(true), marginTop: 15, opacity: loading ? 0.6 : 1 }}
          disabled={loading}
        >
          {loading ? "Creando cuenta..." : "Registrarse"}
        </button>
      </form>
    </CenteredCard>
  );
}

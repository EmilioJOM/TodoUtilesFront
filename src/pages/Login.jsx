import React, { useState } from "react";
import CenteredCard from "../components/CenteredCard.jsx";
import { input, button, palette } from "../utils/styles.jsx";


export default function Login({ setUser }) {
const [email, setEmail] = useState("");
const [pass, setPass] = useState("");
return (
<CenteredCard title="Iniciar Sesión">
<input style={input} placeholder="Correo electrónico o nombre de usuario" value={email} onChange={(e) => setEmail(e.target.value)} />
<input style={{ ...input, marginTop: 10 }} placeholder="Contraseña" type="password" value={pass} onChange={(e) => setPass(e.target.value)} />
<a href="#/forgot" style={{ fontSize: 13, color: palette.muted, marginTop: 8, alignSelf: "start" }}>¿Olvidaste tu contraseña?</a>
<button style={{ ...button(true), width: "100%", marginTop: 12 }} onClick={() => { setUser({ name: email.split("@")[0] || "Usuario", email }); window.location.hash = "#/"; }}>
Iniciar Sesión
</button>
<div style={{ fontSize: 13, marginTop: 10, color: palette.muted }}>
¿No tienes una cuenta? <a href="#/register">Regístrate</a>
</div>
</CenteredCard>
);
}
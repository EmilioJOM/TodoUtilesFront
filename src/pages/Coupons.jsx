// src/pages/Coupons.jsx
import React, { useEffect, useState } from "react";
import { wrap, card, input, button, palette } from "../utils/styles.jsx";
import { CouponsAPI } from "../api/index.jsx";

export default function Coupons() {
  const [list, setList] = useState([]);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    cupon: "",        // código (string)
    descuento: "",    // número
    tipo: "porcentaje", // "porcentaje" | "monto"
    validez: "",      // "YYYY-MM-DDTHH:mm"
  });
  const [error, setError] = useState("");

  async function load() {
    try {
      const data = await CouponsAPI.list(); // GET /cupones
      setList(data);
    } catch (e) { setError(e?.message || "No se pudieron cargar los cupones"); }
  }
  useEffect(() => { load(); }, []);

  async function create() {
    setSaving(true); setError("");
    try {
      const body = {
        cupon: form.cupon.trim().toUpperCase(),
        descuento: parseInt(form.descuento || "0", 10),
        tipo: form.tipo,
        // LocalDateTime ISO: 2025-12-31T23:59
        validez: form.validez ? `${form.validez}:00` : null,
      };
      await CouponsAPI.create(body);    // POST /cupones
      setForm({ cupon: "", descuento: "", tipo: "porcentaje", validez: "" });
      await load();
    } catch (e) { setError(e?.message || "No se pudo crear el cupón"); }
    finally { setSaving(false); }
  }

  async function remove(idCupon) {
    if (!window.confirm("¿Eliminar este cupón?")) return;
    try { await CouponsAPI.remove(idCupon); await load(); } // DELETE /cupones/{id}
    catch (e) { setError(e?.message || "No se pudo eliminar"); }
  }

  const Row = ({ children, head }) => (
    <div style={{
      display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1.5fr 0.6fr",
      padding: "14px 16px",
      borderBottom: `1px solid ${palette.border}`,
      fontWeight: head ? 700 : 400
    }}>{children}</div>
  );

  return (
    <div style={{ ...wrap, marginTop: 8 }}>
      <h2>Administrar Cupones</h2>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1.2fr", gap: 24 }}>
        {/* Crear */}
        <div style={{ ...card, padding: 16 }}>
          <h3 style={{ marginTop: 0 }}>Crear Nuevo Cupón</h3>

          <Label>Código</Label>
          <input style={input} placeholder="DESCUENTO10"
                 value={form.cupon} onChange={(e)=>setForm({...form, cupon:e.target.value})} />

          <Label style={{ marginTop: 10 }}>Tipo</Label>
          <select style={input} value={form.tipo} onChange={(e)=>setForm({...form, tipo:e.target.value})}>
            <option value="porcentaje">Porcentaje (%)</option>
            <option value="monto">Monto fijo</option>
          </select>

          <Label style={{ marginTop: 10 }}>{form.tipo === "porcentaje" ? "Descuento (%)" : "Descuento (monto)"}</Label>
          <input style={input} placeholder={form.tipo === "porcentaje" ? "10" : "500"}
                 value={form.descuento} onChange={(e)=>setForm({...form, descuento:e.target.value})} />

          <Label style={{ marginTop: 10 }}>Validez (fecha y hora)</Label>
          <input type="datetime-local" style={input}
                 value={form.validez}
                 onChange={(e)=>setForm({...form, validez:e.target.value})} />

          {!!error && <div style={{ color: "#b91c1c", marginTop: 8 }}>{error}</div>}
          <button style={{ ...button(true), marginTop: 12 }} onClick={create} disabled={saving}>
            {saving ? "Guardando…" : "➕  Crear Cupón"}
          </button>
        </div>

        {/* Lista */}
        <div style={{ ...card }}>
          <div style={{ padding: 16 }}>
            <h3 style={{ margin: 0 }}>Cupones</h3>
          </div>
          <Row head>
            <div>CÓDIGO</div><div>TIPO</div><div>DESCUENTO</div><div>VÁLIDO HASTA</div><div></div>
          </Row>
          {list.map(c => (
            <Row key={c.idCupon}>
              <div style={{ fontWeight: 700 }}>{c.cupon}</div>
              <div>{c.tipo}</div>
              <div>{c.descuento}{c.tipo === "porcentaje" ? "%" : ""}</div>
              <div>{c.validez?.replace("T"," ") || "—"}</div>
              <div><button onClick={()=>remove(c.idCupon)} style={{ ...button(false), padding: "6px 10px" }}>🗑️ ELIM</button></div>
            </Row>
          ))}
        </div>
      </div>
    </div>
  );
}

const Label = ({ children }) => (
  <div style={{ fontSize: 13, color: palette.muted, margin: "8px 0 6px" }}>{children}</div>
);

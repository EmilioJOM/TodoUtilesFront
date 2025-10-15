import React, { useState } from "react";
import { wrap, card, input, button, palette } from "../utils/styles.jsx";
import { getCoupons, addCoupon, deleteCoupon } from "../utils/dataAPI.jsx";

export default function Coupons() {
  const [list, setList] = useState(getCoupons());
  const [form, setForm] = useState({ code: "", percent: "", expires: "" });

  const create = () => {
    if (!form.code || !form.percent) return;
    addCoupon({ code: form.code.trim().toUpperCase(), percent: parseFloat(form.percent), expires: form.expires });
    setForm({ code: "", percent: "", expires: "" });
    setList(getCoupons());
  };
  const removeAt = (i) => { deleteCoupon(i); setList(getCoupons()); };

  const Row = ({ children, head }) => (
    <div style={{
      display: "grid", gridTemplateColumns: "2fr 1fr 1.5fr 0.6fr",
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

          <Label>Código del Cupón</Label>
          <input style={input} placeholder="Ej: DESCUENTO10"
                 value={form.code} onChange={(e)=>setForm({ ...form, code: e.target.value })} />

          <Label style={{ marginTop: 10 }}>Descuento (%)</Label>
          <input style={input} placeholder="Ej: 10"
                 value={form.percent} onChange={(e)=>setForm({ ...form, percent: e.target.value })} />

          <Label style={{ marginTop: 10 }}>Fecha de Vencimiento</Label>
          <input style={input} placeholder="mm/dd/yyyy"
                 value={form.expires} onChange={(e)=>setForm({ ...form, expires: e.target.value })} />

          <button style={{ ...button(true), marginTop: 12 }} onClick={create}>
            ➕  Crear Cupón
          </button>
        </div>

        {/* Lista */}
        <div style={{ ...card }}>
          <div style={{ padding: 16 }}>
            <h3 style={{ margin: 0 }}>Cupones Vigentes</h3>
          </div>
          <Row head><div>CÓDIGO</div><div>DESCUENTO</div><div>VENCIMIENTO</div><div></div></Row>
          {list.map((c, i) => (
            <Row key={i}>
              <div style={{ fontWeight: 700 }}>{c.code}</div>
              <div>{c.percent}%</div>
              <div>{c.expires || "—"}</div>
              <div>
                <button onClick={() => removeAt(i)} style={{ ...button(false), padding: "6px 10px" }}>🗑️ ELIM</button>
              </div>
            </Row>
          ))}
        </div>
      </div>
    </div>
  );
}

const Label = ({ children, style }) => (
  <div style={{ fontSize: 13, color: palette.muted, margin: "6px 0", ...style }}>{children}</div>
);

// src/pages/Coupons.jsx
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { wrap, card, input, button, palette } from "../utils/styles.jsx";
import {
  fetchCoupons,
  createCoupon,
  deleteCoupon,
} from "../redux/couponsSlice.js";

export default function Coupons() {
  const dispatch = useDispatch();
  const { items: list, loading, error } = useSelector((s) => s.coupons);

  const [form, setForm] = useState({
    cupon: "",
    descuento: "",
    tipo: "porcentaje",
    validez: "",
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    dispatch(fetchCoupons());
  }, [dispatch]);

  const onCreate = (e) => {
    e.preventDefault();
    setSaving(true);

    const body = {
      cupon: form.cupon.trim().toUpperCase(),
      descuento: parseInt(form.descuento || "0", 10),
      tipo: form.tipo,
      validez: form.validez ? `${form.validez}:00` : null,
    };

    dispatch(createCoupon(body))
      .unwrap()
      .then(() => {
        setForm({
          cupon: "",
          descuento: "",
          tipo: "porcentaje",
          validez: "",
        });
      })
      .finally(() => setSaving(false));
  };

  const onDelete = (idCupon) => {
    if (!window.confirm("¿Eliminar este cupón?")) return;
    dispatch(deleteCoupon(idCupon));
  };

  const Row = ({ children, head }) => (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "2fr 1fr 1fr 1.5fr 0.6fr",
        padding: "14px 16px",
        borderBottom: `1px solid ${palette.border}`,
        fontWeight: head ? 700 : 400,
      }}
    >
      {children}
    </div>
  );

  return (
    <div style={{ ...wrap, marginTop: 8 }}>
      <h2>Administrar Cupones</h2>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1.2fr", gap: 24 }}>
        {/* Crear */}
        <div style={{ ...card, padding: 16 }}>
          <h3 style={{ marginTop: 0 }}>Crear Nuevo Cupón</h3>

          <Label>Código</Label>
          <input
            style={input}
            placeholder="DESCUENTO10"
            value={form.cupon}
            onChange={(e) =>
              setForm((f) => ({ ...f, cupon: e.target.value }))
            }
          />

          <Label>Descuento</Label>
          <input
            style={input}
            type="number"
            placeholder="10"
            value={form.descuento}
            onChange={(e) =>
              setForm((f) => ({ ...f, descuento: e.target.value }))
            }
          />

          <Label>Tipo</Label>
          <select
            style={{ ...input, appearance: "none" }}
            value={form.tipo}
            onChange={(e) =>
              setForm((f) => ({ ...f, tipo: e.target.value }))
            }
          >
            <option value="porcentaje">% Porcentaje</option>
            <option value="monto">Monto fijo</option>
          </select>

          <Label>Validez (fecha y hora)</Label>
          <input
            style={input}
            type="datetime-local"
            value={form.validez}
            onChange={(e) =>
              setForm((f) => ({ ...f, validez: e.target.value }))
            }
          />

          {error && (
            <div style={{ marginTop: 8, color: "red", fontSize: 13 }}>
              {error}
            </div>
          )}

          <button
            style={{
              ...button(true),
              marginTop: 12,
              opacity: saving || loading ? 0.6 : 1,
            }}
            onClick={onCreate}
            disabled={saving || loading}
          >
            {saving ? "Creando..." : "Crear Cupón"}
          </button>
        </div>

        {/* Listado */}
        <div style={{ ...card, padding: 16 }}>
          <h3 style={{ marginTop: 0 }}>Cupones existentes</h3>

          {loading ? (
            <div>Cargando cupones…</div>
          ) : list.length === 0 ? (
            <div>No hay cupones aún.</div>
          ) : (
            <>
              <Row head>
                <div>Código</div>
                <div>Descuento</div>
                <div>Tipo</div>
                <div>Validez</div>
                <div>Acciones</div>
              </Row>
              {list.map((c) => (
                <Row key={c.idCupon}>
                  <div>{c.cupon}</div>
                  <div>
                    {c.descuento}
                    {c.tipo === "porcentaje" ? "%" : ""}
                  </div>
                  <div>{c.tipo}</div>
                  <div>{c.validez?.replace("T", " ") || "—"}</div>
                  <div>
                    <button
                      onClick={() => onDelete(c.idCupon)}
                      style={{ ...button(false), padding: "6px 10px" }}
                    >
                      🗑️ Eliminar
                    </button>
                  </div>
                </Row>
              ))}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

const Label = ({ children }) => (
  <div style={{ fontSize: 13, color: palette.muted, margin: "8px 0 6px" }}>
    {children}
  </div>
);

import React, { useState } from "react";
import { wrap, card, input, button, palette } from "../utils/styles.jsx";
import Label from "../components/Label.jsx";

export default function Shipping() {
  const [data, setData] = useState({
    address: "",
    city: "",
    zip: "",
  });

  return (
    <div style={{ ...wrap, maxWidth: 900 }}>
      <div style={{ textAlign: "center", margin: "12px 0 16px" }}>
        <h2 style={{ margin: 0 }}>Información de Envío</h2>
        <div style={{ color: palette.muted }}>
          Un paso más cerca de recibir tus útiles.
        </div>
      </div>

      <div style={{ ...card, padding: 16 }}>
        <Label>Dirección</Label>
        <input
          style={input}
          value={data.address}
          onChange={(e) =>
            setData((d) => ({ ...d, address: e.target.value }))
          }
          placeholder="Calle Falsa 123"
        />

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 12,
            marginTop: 12,
          }}
        >
          <div>
            <Label>Ciudad</Label>
            <input
              style={input}
              value={data.city}
              onChange={(e) =>
                setData((d) => ({ ...d, city: e.target.value }))
              }
              placeholder="Springfield"
            />
          </div>
          <div>
            <Label>Código Postal</Label>
            <input
              style={input}
              value={data.zip}
              onChange={(e) =>
                setData((d) => ({ ...d, zip: e.target.value }))
              }
              placeholder="S1234ABC"
            />
          </div>
        </div>

        <a
          href="#/payment"
          style={{
            ...button(true),
            display: "block",
            textAlign: "center",
            marginTop: 16,
          }}
        >
          Continuar al pago
        </a>

        <div
          style={{
            marginTop: 8,
            display: "flex",
            alignItems: "center",
            gap: 8,
            color: palette.muted,
          }}
        >
          <span>🔒</span>
          <small>Transacción segura y protegida.</small>
        </div>
      </div>
    </div>
  );
}

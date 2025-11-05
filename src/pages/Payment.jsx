// src/pages/Payment.jsx
import React, { useState } from "react";
import { wrap, card, input, button, palette } from "../utils/styles.jsx";
import { CartAPI, SalesAPI, CouponsAPI } from "../api/index.jsx";
import { currency } from "../utils/Format.jsx";

// Recibe `store` desde App (como ya lo hacía en tu proyecto)
export default function Payment({ store }) {
  const [ok, setOk] = useState(false);
  const [loading, setLoading] = useState(false);
  const [metodo, setMetodo] = useState("TARJETA");
  const [error, setError] = useState("");

  // Estados para cupones
  const [couponCode, setCouponCode] = useState("");
  const [couponData, setCouponData] = useState(null); // datos devueltos por el backend
  const [discount, setDiscount] = useState(0); // valor numérico del descuento aplicado (monto)

  const disabled = loading;

  // Función para aplicar cupón: valida con el backend y calcula el descuento
  async function aplicarCupon() {
    setError("");
    const code = (couponCode || "").trim();
    if (!code) {
      setError("Ingresá un código de cupón.");
      return;
    }

    setLoading(true);
    try {
      // Se asume que CouponsAPI.getByCode devuelve el cupon o lanza error si inválido
      const data = await CouponsAPI.getByCode(code);
      if (!data) throw new Error("Cupón no encontrado");

      // calcular descuento en monto según tipo
      let descMonto = 0;
      const base = Number(store.total || store.subtotal || 0);
      if (data.tipo === "porcentaje") {
        descMonto = (base * Number(data.descuento || 0)) / 100;
      } else {
        // tipo "monto"
        descMonto = Number(data.descuento || 0);
      }

      // normalizar a 2 decimales y no dejar < 0
      descMonto = Math.max(0, Number(descMonto.toFixed(2)));

      setCouponData(data);
      setDiscount(descMonto);

      // Guardar código en store para que el backend lo reciba en confirm (tu flujo ya esperaba store.coupon)
      try {
        // algunos stores usan setState, otros expone la propiedad. Aquí hacemos la asignación simple.
        store.coupon = data.cupon;
      } catch (e) {
        // si store no permite asignación directa, sólo mantenemos couponData y discount
        // (al llamar a SalesAPI.confirm usaremos couponData?.cupon)
      }

      // reflejar el código en el input (en mayúsculas opcional)
      setCouponCode(data.cupon || code);

      // feedback ligero
      setError(""); // limpiar error
    } catch (e) {
      console.error(e);
      setCouponData(null);
      setDiscount(0);
      // mostrar mensaje de error (amigable)
      setError(e?.message || "Cupón inválido o vencido.");
      // también borrar cualquier código guardado en store
      try { delete store.coupon; } catch {}
    } finally {
      setLoading(false);
    }
  }

  function quitarCupon() {
    setCouponData(null);
    setDiscount(0);
    setCouponCode("");
    try { delete store.coupon; } catch {}
    setError("");
  }

  // Procesar pago / confirmar venta
  async function pagar() {
    setLoading(true);
    setError("");
    try {
      // preferimos usar lo que hay en store.coupon si existe, si no usamos couponData
      const codigoCupon = (store.coupon || couponData?.cupon || "").trim() || undefined;
      await SalesAPI.confirm({ metodoPago: metodo, codigoCupon: codigoCupon }); // PUT /ventas/confirm

      setOk(true);
      // limpiar store local del carrito si tu store proporciona clear()
      try { store.clear(); } catch (e) {}
    } catch (e) {
      console.error(e);
      setError(e?.message || "No se pudo procesar el pago. Intente nuevamente.");
    } finally {
      setLoading(false);
    }
  }

  // Cancelar compra (igual que antes)
  async function cancelar() {
    setLoading(true);
    setError("");
    setOk(false);

    try {
      await SalesAPI.cancel();
      window.location.hash = "#/";
    } catch (e) {
      console.error(e);
      setError(e?.message || "No se pudo cancelar la compra pendiente.");
    } finally {
      setLoading(false);
    }
  }

  // Base y total con descuento para mostrar
  const baseTotal = Number(store.total || store.subtotal || 0);
  const totalConDescuento = Math.max(0, Number((baseTotal - (discount || 0)).toFixed(2)));

  if (ok) {
    return (
      <div style={{ ...wrap, maxWidth: 680 }}>
        <div style={{ ...card, padding: 24, textAlign: "center" }}>
          <h2>¡Pago confirmado! ✅</h2>
          <a href="#/" style={{ ...button(true), marginTop: 14 }}>Volver al inicio</a>
        </div>
      </div>
    );
  }

  return (
    <div style={{ ...wrap, maxWidth: 900 }}>
      <div style={{ textAlign: "center", margin: "12px 0 16px" }}>
        <h2 style={{ margin: 0 }}>Información de Pago</h2>
        <div style={{ color: palette.muted }}>Completa los datos para finalizar tu compra.</div>
      </div>

      <div style={{ display: "grid", gap: 16 }}>
        <div style={{ ...card, padding: 16 }}>
          <div style={{ fontSize: 13, color: palette.muted, margin: "6px 0" }}>Método de Pago</div>
          <select style={input} value={metodo} onChange={(e) => setMetodo(e.target.value)} disabled={disabled}>
            <option value="TARJETA">Tarjeta</option>
            <option value="TRANSFERENCIA">Transferencia</option>
            <option value="EFECTIVO">Efectivo</option>
          </select>

          {/* Campos demo de tarjeta (opcionales/visual) */}
          <div style={{ fontSize: 13, color: palette.muted, margin: "10px 0 6px" }}>Número de Tarjeta</div>
          <input style={input} placeholder="0000 0000 0000 0000" disabled={disabled} />
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginTop: 12 }}>
            <div>
              <div style={{ fontSize: 13, color: palette.muted, margin: "6px 0" }}>Vencimiento</div>
              <input style={input} placeholder="MM/AA" disabled={disabled} />
            </div>
            <div>
              <div style={{ fontSize: 13, color: palette.muted, margin: "6px 0" }}>CVV</div>
              <input style={input} placeholder="123" disabled={disabled} />
            </div>
          </div>
        </div>

        {/* Resumen y sección de cupón */}
        <div style={{ ...card, padding: 16 }}>
          <h3 style={{ marginTop: 0 }}>Resumen del Pedido</h3>

          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
            <span>Subtotal</span>
            <span>{currency(baseTotal)}</span>
          </div>

          {/* Sección de cupón */}
          <div style={{ marginTop: 6 }}>
            <div style={{ fontSize: 13, color: palette.muted, marginBottom: 6 }}>
              Código de Cupón
            </div>

            <div style={{ display: "flex", gap: 8 }}>
              <input
                style={{ ...input, flex: 1 }}
                placeholder="Ej: DESCUENTO10"
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value)}
                disabled={disabled}
              />
              <button
                style={{ ...button(false), whiteSpace: "nowrap" }}
                onClick={aplicarCupon}
                disabled={disabled || loading}
              >
                Añadir cupón
              </button>
            </div>

            {/* Mostrar resultado del cupón si existe */}
            {couponData && (
              <div style={{ marginTop: 8, display: "flex", alignItems: "center", gap: 8 }}>
                <div style={{ color: "#16a34a", fontWeight: 700 }}>
                  ✅ Cupón {couponData.cupon} aplicado:
                </div>
                <div style={{ color: palette.muted }}>
                  {couponData.tipo === "porcentaje"
                    ? `${couponData.descuento}%`
                    : `${currency(Number(couponData.descuento || 0))}`}{" "}
                  {couponData.tipo === "porcentaje" ? "(sobre el total)" : ""}
                </div>
                <button
                  onClick={quitarCupon}
                  style={{ ...button(false), marginLeft: "auto", padding: "6px 10px" }}
                >
                  Quitar
                </button>
              </div>
            )}

            {/* Mensaje de error (cupón inválido o general) */}
            {!!error && (
              <div style={{ color: "#b91c1c", marginTop: 8 }}>
                {error}
              </div>
            )}

            {/* Mostrar descuento numérico si lo hay */}
            {discount > 0 && (
              <div style={{ marginTop: 10, display: "flex", justifyContent: "space-between", fontWeight: 700 }}>
                <span>Descuento</span>
                <span>- {currency(discount)}</span>
              </div>
            )}
          </div>

          {/* Total final */}
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 18, fontWeight: 900, marginTop: 12 }}>
            <span>Total</span>
            <span>{currency(totalConDescuento)}</span>
          </div>

          {/* Botones pagar / cancelar */}
          {!!error && <div style={{ color: "#b91c1c", marginTop: 12 }}>{error}</div>}

          <button onClick={pagar} disabled={disabled} style={{ ...button(true), width: "100%", marginTop: 16 }}>
            {loading ? "Procesando…" : "Pagar y confirmar"}
          </button>

          <button
            onClick={cancelar}
            disabled={disabled}
            style={{
              ...button(false),
              width: "100%",
              marginTop: 12,
              color: palette.ink,
              background: "#e5e7eb",
              border: `1px solid ${palette.muted}`,
            }}
          >
            {loading ? "Cancelando…" : "Cancelar compra"}
          </button>

          <div style={{ marginTop: 8, display: "flex", alignItems: "center", gap: 8, color: palette.muted }}>
            <span>🔒</span><small>Transacción segura y protegida.</small>
          </div>
        </div>
      </div>
    </div>
  );
}

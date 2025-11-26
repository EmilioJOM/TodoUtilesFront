// src/pages/Payment.jsx
import React, { useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { wrap, card, input, button, palette } from "../utils/styles.jsx";
import { currency } from "../utils/Format.jsx";
import { validateCoupon } from "../redux/couponsSlice.js";
import { checkoutSale, confirmSale, cancelSale } from "../redux/salesSlice.js";
import { purchaseCart } from "../redux/cartSlice.js";

export default function Payment() {
  const dispatch = useDispatch();
  const { subtotal, total } = useSelector((s) => s.cart);
  const { user } = useSelector((s) => s.auth);
  const { currentCoupon, loading: couponLoading, error: couponError } =
    useSelector((s) => s.coupons);

  const [metodo, setMetodo] = useState("TARJETA");
  const [couponCode, setCouponCode] = useState("");
  const [step, setStep] = useState("form"); // form | confirm | done
  const [globalError, setGlobalError] = useState("");
  const [loading, setLoading] = useState(false);

  const baseTotal = total || subtotal || 0;

  const discount = useMemo(() => {
    if (!currentCoupon) return 0;
    const d = Number(currentCoupon.descuento || 0);
    if (currentCoupon.tipo === "porcentaje") {
      return Math.max(0, Number(((baseTotal * d) / 100).toFixed(2)));
    }
    return Math.max(0, Number(d.toFixed(2)));
  }, [currentCoupon, baseTotal]);

  const finalTotal = Math.max(0, baseTotal - discount);

  const disabled = loading || couponLoading;

  // aplicar cupón vía Redux
  const onApplyCoupon = () => {
    setGlobalError("");
    const code = (couponCode || "").trim();
    if (!code) {
      setGlobalError("Ingresá un código de cupón.");
      return;
    }
    dispatch(validateCoupon(code));
  };

  // Paso 1: checkout (crea venta pendiente en backend)
  const onCheckout = () => {
    if (!user) {
      setGlobalError("Tenés que iniciar sesión para pagar.");
      return;
    }
    setGlobalError("");
    setLoading(true);

    dispatch(
      checkoutSale({
        idUsuario: user.id,
        total: finalTotal,
        metodoPago: metodo,
        codigoCupon: couponCode || null,
      })
    )
      .unwrap()
      .then(() => {
        setStep("confirm");
      })
      .catch((e) => {
        setGlobalError(e?.message || "Error al iniciar el pago");
      })
      .finally(() => setLoading(false));
  };

  // Paso 2: confirmar pago
  const onConfirm = () => {
    setGlobalError("");
    setLoading(true);

    dispatch(
      confirmSale({
        metodoPago: metodo,
        codigoCupon: couponCode || null,
      })
    )
      .unwrap()
      .then(() => {
        // completamos carrito
        return dispatch(purchaseCart()).unwrap();
      })
      .then(() => {
        setStep("done");
      })
      .catch((e) => {
        setGlobalError(e?.message || "Error al confirmar el pago");
      })
      .finally(() => setLoading(false));
  };

  const onCancel = () => {
    setGlobalError("");
    setLoading(true);
    dispatch(cancelSale())
      .unwrap()
      .then(() => {
        window.location.hash = "#/cart";
      })
      .finally(() => setLoading(false));
  };

  return (
    <div style={{ ...wrap, marginTop: 8 }}>
      <h2>Pago</h2>

      <div style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr", gap: 24 }}>
        {/* Columna izquierda: métodos + cupón */}
        <div style={{ ...card, padding: 16 }}>
          <h3 style={{ marginTop: 0 }}>Método de pago</h3>

          <label style={{ display: "block", margin: "6px 0" }}>
            <input
              type="radio"
              name="pago"
              value="TARJETA"
              checked={metodo === "TARJETA"}
              onChange={(e) => setMetodo(e.target.value)}
            />{" "}
            Tarjeta de crédito / débito
          </label>
          <label style={{ display: "block", margin: "6px 0" }}>
            <input
              type="radio"
              name="pago"
              value="TRANSFERENCIA"
              checked={metodo === "TRANSFERENCIA"}
              onChange={(e) => setMetodo(e.target.value)}
            />{" "}
            Transferencia bancaria
          </label>
          <label style={{ display: "block", margin: "6px 0" }}>
            <input
              type="radio"
              name="pago"
              value="EFECTIVO"
              checked={metodo === "EFECTIVO"}
              onChange={(e) => setMetodo(e.target.value)}
            />{" "}
            Efectivo
          </label>

          <hr style={{ margin: "16px 0" }} />

          <h3>Cupón de descuento</h3>
          <div style={{ display: "flex", gap: 8 }}>
            <input
              style={{ ...input, flex: 1 }}
              placeholder="Código de cupón"
              value={couponCode}
              onChange={(e) => setCouponCode(e.target.value)}
            />
            <button
              type="button"
              style={{ ...button(false), whiteSpace: "nowrap" }}
              onClick={onApplyCoupon}
              disabled={disabled}
            >
              Aplicar
            </button>
          </div>

          {couponError && (
            <div style={{ marginTop: 8, color: "red", fontSize: 13 }}>
              {couponError}
            </div>
          )}
          {currentCoupon && !couponError && (
            <div style={{ marginTop: 8, fontSize: 13, color: palette.muted }}>
              Cupón aplicado: <b>{currentCoupon.cupon}</b> (
              {currentCoupon.tipo === "porcentaje"
                ? `${currentCoupon.descuento}%`
                : `$${currentCoupon.descuento}`}
              )
            </div>
          )}

          {globalError && (
            <div style={{ marginTop: 8, color: "red", fontSize: 13 }}>
              {globalError}
            </div>
          )}
        </div>

        {/* Columna derecha: resumen */}
        <div style={{ ...card, padding: 16, height: "fit-content" }}>
          <h3 style={{ marginTop: 0 }}>Resumen del pedido</h3>

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginBottom: 6,
            }}
          >
            <span>Subtotal</span>
            <span>{currency(subtotal)}</span>
          </div>

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginBottom: 6,
            }}
          >
            <span>Descuento</span>
            <span>{discount ? `- ${currency(discount)}` : "—"}</span>
          </div>

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              fontSize: 18,
              fontWeight: 900,
              marginTop: 10,
            }}
          >
            <span>Total a pagar</span>
            <span>{currency(finalTotal)}</span>
          </div>

          {step === "form" && (
            <button
              style={{
                ...button(true),
                display: "block",
                textAlign: "center",
                marginTop: 16,
                opacity: disabled ? 0.6 : 1,
              }}
              disabled={disabled}
              onClick={onCheckout}
            >
              Continuar al pago
            </button>
          )}

          {step === "confirm" && (
            <>
              <button
                style={{
                  ...button(true),
                  display: "block",
                  textAlign: "center",
                  marginTop: 16,
                  opacity: disabled ? 0.6 : 1,
                }}
                disabled={disabled}
                onClick={onConfirm}
              >
                Confirmar pago
              </button>
              <button
                style={{ ...button(false), marginTop: 8 }}
                disabled={disabled}
                onClick={onCancel}
              >
                Cancelar
              </button>
            </>
          )}

          {step === "done" && (
            <div style={{ marginTop: 16, color: "green", fontWeight: 600 }}>
              ¡Pago realizado con éxito!
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

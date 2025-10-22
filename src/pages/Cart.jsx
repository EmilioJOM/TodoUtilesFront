import React, { useEffect } from "react";
import useStore from "../store/UseStore.jsx";
import { wrap, card, button, palette } from "../utils/styles.jsx";
import { currency } from "../utils/Format.jsx";

export default function Cart() {
  const store = useStore();

  useEffect(() => {
    store.loadCart();
  }, []);

  const items = store.items || [];

  return (
    <div
      style={{
        ...wrap,
        display: "grid",
        gridTemplateColumns: "1.2fr 0.8fr",
        gap: 24,
      }}
    >
      {/* Lista de productos */}
      <div style={{ ...card }}>
        <div style={{ padding: 16, borderBottom: `1px solid ${palette.border}` }}>
          <h2 style={{ margin: 0 }}>Carrito de Compras</h2>
        </div>

        {items.length === 0 ? (
          <div style={{ padding: 16 }}>Tu carrito está vacío.</div>
        ) : (
          items.map((p, idx) => (
            <div
              key={idx}
              style={{
                display: "grid",
                gridTemplateColumns: "1.4fr 0.6fr 0.6fr 0.3fr",
                padding: "12px 16px",
                borderBottom: `1px solid ${palette.border}`,
                alignItems: "center",
              }}
            >
              {/* Descripción del producto */}
              <div>
                <div style={{ fontWeight: 700 }}>{p.description}</div>
              </div>

              {/* Cantidad con botones + / - */}
                <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                    <button
                        onClick={() => store.updateCartItem(p.productId, -1)}
                        disabled={p.quantity <= 1} // no permitir cantidad < 1
                        style={button(false)}
                    >
                        -
                    </button>
                    <span style={{ width: 30, textAlign: "center" }}>{p.quantity}</span>
                    <button
                        onClick={() => store.updateCartItem(p.productId, +1)}
                        disabled={p.quantity >= p.stock} // ✅ deshabilitado si llegamos al stock
                        style={button(false)}
                    >
                        +
                    </button>
                </div>

              {/* Precio total del producto */}
              <div style={{ fontWeight: 700 }}>
                {currency((p.price || 0) * (p.quantity || 1))}
              </div>

              {/* Botón eliminar */}
              <button
                onClick={() => store.removeFromCart(p.productId)}
                style={button(false)}
              >
                🗑️
              </button>
            </div>
          ))
        )}
      </div>

      {/* Resumen del pedido */}
      <div style={{ ...card, padding: 16, height: "fit-content" }}>
        <h3 style={{ marginTop: 0 }}>Resumen del Pedido</h3>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginBottom: 8,
          }}
        >
          <span>Subtotal</span>
          <span>{currency(store.subtotal)}</span>
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            fontSize: 18,
            fontWeight: 900,
          }}
        >
          <span>Total</span>
          <span>{currency(store.total)}</span>
        </div>

        <button
          onClick={() => {store.purchaseCart(); window.location.hash = "#/payment";}}
          style={{
            ...button(true),
            display: "block",
            textAlign: "center",
            marginTop: 16,
          }}
        >
          Confirmar Carrito
        </button>
      </div>
    </div>
  );
}
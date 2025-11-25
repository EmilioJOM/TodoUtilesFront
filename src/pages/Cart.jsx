import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchCart,
  fetchCartProducts,
  updateProductQuantity,
  removeProductFromCart,
  purchaseCart,
} from "../redux/cartSlice";
import { wrap, card, button, palette } from "../utils/styles.jsx";
import { currency } from "../utils/Format.jsx";
import "./pagesStyles/Cart.css";

export default function Cart() {
  const dispatch = useDispatch();

  const { items, subtotal, total, loading } = useSelector((s) => s.cart);

  useEffect(() => {
    dispatch(fetchCart());
    dispatch(fetchCartProducts());
  }, [dispatch]);

  if (loading) return <p>Cargando carrito...</p>;

  return (
    <div
      style={{
        ...wrap,
        display: "grid",
        gridTemplateColumns: "1.2fr 0.8fr",
        gap: 24,
      }}
    >
      <div style={{ ...card }}>
        <div style={{ padding: 16, borderBottom: `1px solid ${palette.border}` }}>
          <h2 style={{ margin: 0 }}>Carrito de Compras</h2>
        </div>

        {items.length === 0 ? (
          <div style={{ padding: 16 }}>Tu carrito está vacío.</div>
        ) : (
          items.map((p) => (
            <div
              key={p.productId}
              style={{
                display: "grid",
                gridTemplateColumns: "1.4fr 0.6fr 0.6fr 0.3fr",
                padding: "12px 16px",
                borderBottom: `1px solid ${palette.border}`,
                alignItems: "center",
              }}
            >
              <div>
                <div style={{ fontWeight: 700 }}>{p.description}</div>
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                <button
                  onClick={() =>
                    dispatch(
                      updateProductQuantity({
                        productId: p.productId,
                        quantity: p.quantity - 1,
                      })
                    )
                  }
                  disabled={p.quantity <= 1}
                  style={button(false)}
                >
                  -
                </button>

                <span style={{ width: 30, textAlign: "center" }}>
                  {p.quantity}
                </span>

                <button
                  onClick={() =>
                    dispatch(
                      updateProductQuantity({
                        productId: p.productId,
                        quantity: p.quantity + 1,
                      })
                    )
                  }
                  disabled={p.quantity >= p.stock}
                  style={button(false)}
                >
                  +
                </button>
              </div>

              <div style={{ fontWeight: 700 }}>
                {currency(p.price * p.quantity)}
              </div>

              <button
  onClick={() => dispatch(removeProductFromCart(p.productId))}
  className="button trash"
>
  {/* Tapa */}
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 69 14"
    className="svgIcon bin-top"
  >
    <path d="M20.8232 2.62734L19.9948 4.21304C19.8224 4.54309 19.4808 4.75 19.1085 4.75H4.92857C2.20246 4.75 0 6.87266 0 9.5C0 12.1273 2.20246 14.25 4.92857 14.25H64.0714C66.7975 14.25 69 12.1273 69 9.5C69 6.87266 66.7975 4.75 64.0714 4.75H49.8915C49.5192 4.75 49.1776 4.54309 49.0052 4.21305L48.1768 2.62734C47.3451 1.00938 45.6355 0 43.7719 0H25.2281C23.3645 0 21.6549 1.00938 20.8232 2.62734Z"></path>
  </svg>

  {/* Cuerpo */}
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 69 57"
    className="svgIcon bin-bottom"
  >
    <path d="M6 10H63L59 50C58.5 54 55.5 57 51.5 57H17.5C13.5 57 10.5 54 10 50L6 10Z"></path>
  </svg>
</button>
            </div>
          ))
        )}
      </div>

      <div style={{ ...card, padding: 16, height: "fit-content" }}>
        <h3 style={{ marginTop: 0 }}>Resumen del Pedido</h3>

        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
          <span>Subtotal</span>
          <span>{currency(subtotal)}</span>
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 18, fontWeight: 900 }}>
          <span>Total</span>
          <span>{currency(total)}</span>
        </div>

        <button
  onClick={() => {
    dispatch(purchaseCart())
      .unwrap()
      .then(() => {
        window.location.hash = "#/payment";   
      });
  }}
  disabled={items.length === 0}
  className="confirm-cart-btn"
  style={{
    ...button(true),
    display: "block",
    textAlign: "center",
    marginTop: 16,
    opacity: items.length === 0 ? 0.6 : 1,
  }}
>
  Confirmar Carrito
</button>

        {items.length === 0 && (
          <div style={{ color: "red", marginTop: 8, textAlign: "start", fontSize: 13 }}>
            No hay productos en el carrito.
          </div>
        )}
      </div>
    </div>
  );
}

// src/pages/Product.jsx
import { useEffect, useState } from "react";
import Row from "../components/Row.jsx";
import { wrap, card, input, button } from "../utils/styles.jsx";
import { currency } from "../utils/Format.jsx";
import { ProductsAPI } from "../api/index.jsx"; // <-- Agregar esta importación

const Product = ({ store, id }) => {
  const URL = `http://localhost:4002/api/productos/${id}`;
  const [product, setProduct] = useState();
  const [mainImage, setMainImage] = useState(0);
  const [qty, setQty] = useState(1);

  // ⬇️ Nuevo: estados para admin
  const isAdmin = store?.isAdmin?.() === true;
  const [deltaStock, setDeltaStock] = useState(0);
  const [savingStock, setSavingStock] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState("");

  // Cargar producto
  useEffect(() => {
    fetch(URL)
      .then((r) => r.json())
      .then(setProduct)
      .catch((e) => console.error("Error:", e));
  }, [id]);

  if (!product) return <div style={{ ...wrap, marginTop: 24 }}>Producto no encontrado.</div>;

  // ⬇️ Nuevo: handlers admin
  async function applyStockDelta() {
    setError(""); 
    const n = parseInt(deltaStock, 10);
    if (!Number.isFinite(n) || n === 0) { setError("Ingresá un número distinto de 0."); return; }
    try {
      setSavingStock(true);
      // el endpoint suma/resta stock según el signo
      await ProductsAPI.addStock({ id: product.id, stock: n });
      // refrescar UI localmente sin volver a pedir
      setProduct((p) => ({ ...p, stock: (p.stock || 0) + n }));
      setDeltaStock(0);
    } catch (e) {
      setError(e?.message || "No se pudo actualizar el stock");
    } finally {
      setSavingStock(false);
    }
  }

  async function deleteProduct() {
    setError("");
    if (!window.confirm("¿Eliminar este producto? Esta acción no se puede deshacer.")) return;
    try {
      setDeleting(true);
      await ProductsAPI.remove(product.id);
      alert("Producto eliminado");
      // Volver al listado
      window.location.hash = "#/search";
    } catch (e) {
      setError(e?.message || "No se pudo eliminar el producto");
    } finally {
      setDeleting(false);
    }
  }

  return (
    <div style={{ ...wrap, marginTop: 8, display: "grid", gridTemplateColumns: "1.2fr 1fr", gap: 24 }}>
      <div style={{ ...card, padding: 16, minHeight: 340 }}>
        {/* Imagen grande */}
        <img
          src={product.images?.length > 0 ? product.images[mainImage] : "public/imagenPlaceholder.jpg"}
          alt={product.description}
          style={{ height: 300, width: "100%", objectFit: "cover", borderRadius: 12 }}
        />
        {/* Thumbnails */}
        {product.images?.length > 1 && (
          <div style={{ display: "flex", gap: 12, marginTop: 12 }}>
            {product.images.slice(0, 3).map((img, idx) => (
              <img
                key={idx}
                src={img}
                alt={`Miniatura ${idx + 1}`}
                onClick={() => setMainImage(idx)}
                style={{
                  flex: 1, height: 70, borderRadius: 10, objectFit: "cover",
                  cursor: "pointer", border: mainImage === idx ? "2px solid #3b82f6" : "none"
                }}
              />
            ))}
          </div>
        )}
      </div>

      <div style={{ ...card, padding: 16 }}>
        <h1 style={{ margin: 0 }}>{product.description}</h1>
        <div style={{ marginTop: 12 }}>
          <Row label="Precio" value={<b>{currency(product.price)}</b>} />
          <Row label="Stock" value={`${product.stock} unidades`} />
          <Row
            label="Categoría(s)"
            value={
              Array.isArray(product.categories) && product.categories.length > 0
                ? product.categories.join(", ")
                : "Sin categoría"
            }
          />
        </div>

        {/* Compra */}
        <div style={{ display: "flex", gap: 10, marginTop: 14 }}>
          <button onClick={() => setQty((q) => Math.max(1, q - 1))} style={button(false)}>-</button>
          <div style={{ ...input, width: 60, textAlign: "center" }}>{qty}</div>
          <button onClick={() => setQty((q) => q + 1)} style={button(false)}>+</button>
          <button onClick={() => { store.addToCart(product.id, qty); }} style={button(true)}>
            🛒 Agregar al carrito
          </button>
        </div>

        {/* ⬇️ NUEVO: Panel ADMIN */}
        {isAdmin && (
          <div style={{ marginTop: 18, paddingTop: 14, borderTop: "1px solid #eee" }}>
            <div style={{ fontWeight: 800, marginBottom: 8 }}>Panel de administración</div>

            {/* Ajuste de stock */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr auto", gap: 8 }}>
              <input
                style={input}
                placeholder="Ej: +10 para sumar, -3 para restar"
                value={deltaStock}
                onChange={(e) => setDeltaStock(e.target.value)}
              />
              <button
                onClick={applyStockDelta}
                disabled={savingStock}
                style={button(true)}
                title="Aplica el ajuste de stock"
              >
                {savingStock ? "Guardando…" : "Aplicar stock"}
              </button>
            </div>

            {/* Borrar producto */}
            <button
              onClick={deleteProduct}
              disabled={deleting}
              style={{ ...button(false), marginTop: 10, background: "#fee2e2", border: "1px solid #ef4444" }}
              title="Eliminar este producto"
            >
              {deleting ? "Eliminando…" : "🗑️ Eliminar producto"}
            </button>

            {/* Errores */}
            {!!error && <div style={{ color: "#b91c1c", marginTop: 8 }}>{error}</div>}
          </div>
        )}
      </div>
    </div>
  );
};

export default Product;

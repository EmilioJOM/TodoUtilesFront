import React, { useEffect, useState } from "react";
import { palette, input, button, card, wrap } from "../utils/styles.jsx";
import { CategoriesAPI } from "../data/Categories.jsx";
import { ProductsAPI } from "../data/Products.jsx";

export default function AdminCreate() {
  const [cats, setCats] = useState([]);
  const [form, setForm] = useState({
    name: "", desc: "", price: "", stock: "", cat: "", image: null,
  });
  const [newCat, setNewCat] = useState("");

  // Cargar categorías existentes
  useEffect(() => {
    CategoriesAPI.list()
      .then((res) => setCats(res.content || res))
      .catch((err) => console.error("Error al cargar categorías:", err));
  }, []);

  // Crear categoría
  const createCategory = async () => {
    if (!newCat.trim()) return;
    try {
      await CategoriesAPI.create({ description: newCat });
      alert("Categoría creada ✅");
      setNewCat("");
      const updated = await CategoriesAPI.list();
      setCats(updated.content || updated);
    } catch (err) {
      alert("Error al crear categoría ❌");
      console.error(err);
    }
  };

  // Crear producto
  const createProduct = async () => {
    if (!form.name || !form.price || !form.stock || !form.cat)
      return alert("Completa todos los campos obligatorios.");

    try {
      const product = await ProductsAPI.create({
        descripcion: form.name,
        stock: parseInt(form.stock, 10),
        price: parseFloat(form.price),
      });

      if (form.image) {
        await ProductsAPI.uploadImage({ id: product.id, file: form.image });
      }

      alert("Producto creado ✅");
      window.location.hash = "#/search";
    } catch (err) {
      alert("Error al crear el producto ❌");
      console.error(err);
    }
  };

  // Manejo del upload de imágenes
  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) setForm({ ...form, image: file });
  };

  const uploaderBox = {
    border: `2px dashed ${palette.border}`,
    borderRadius: 16,
    height: 140,
    display: "grid",
    placeItems: "center",
    color: palette.muted,
    background: "#fafbff",
    cursor: "pointer",
    position: "relative",
  };

  return (
    <div style={{ ...wrap, marginTop: 8 }}>
      <h2 style={{ margin: "8px 0 16px" }}>Crear Nuevo Producto</h2>
      <div style={{ display: "grid", gridTemplateColumns: "1.35fr 0.9fr", gap: 24 }}>
        {/* COLUMNA A - PRODUCTO */}
        <div style={{ ...card, padding: 16 }}>
          <div style={{ fontSize: 13, color: palette.muted, marginBottom: 8 }}>
            Rellena los detalles para añadir un nuevo artículo a tu inventario.
          </div>

          <Label>Nombre del Producto</Label>
          <input
            style={input}
            placeholder="Ej: Lápiz de Grafito HB #2"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />

          <Label style={{ marginTop: 12 }}>Descripción</Label>
          <textarea
            placeholder="Ej: Lápiz de grafito de alta calidad..."
            value={form.desc}
            onChange={(e) => setForm({ ...form, desc: e.target.value })}
            style={{ ...input, minHeight: 96, resize: "vertical" }}
          />

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginTop: 12 }}>
            <div>
              <Label>Precio</Label>
              <input
                style={input}
                placeholder="Ej: 1.50"
                value={form.price}
                onChange={(e) => setForm({ ...form, price: e.target.value })}
              />
            </div>
            <div>
              <Label>Stock</Label>
              <input
                style={input}
                placeholder="Ej: 100"
                value={form.stock}
                onChange={(e) => setForm({ ...form, stock: e.target.value })}
              />
            </div>
          </div>

          <Label style={{ marginTop: 12 }}>Categoría</Label>
          <select
            style={{ ...input, appearance: "none" }}
            value={form.cat}
            onChange={(e) => setForm({ ...form, cat: e.target.value })}
          >
            <option value="">Seleccionar categoría</option>
            {cats.map((c) => (
              <option key={c.id || c} value={c.description || c}>
                {c.description || c}
              </option>
            ))}
          </select>

          <Label style={{ marginTop: 12 }}>Fotos del Producto</Label>
          <label style={uploaderBox}>
            <input
              type="file"
              accept="image/png, image/jpeg, image/gif"
              onChange={handleFileChange}
              style={{
                opacity: 0,
                position: "absolute",
                width: "100%",
                height: "100%",
                cursor: "pointer",
              }}
            />
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: 28, marginBottom: 6 }}>☁️</div>
              <div>
                <b>{form.image ? form.image.name : "Sube un archivo"}</b> o arrastra y suelta
              </div>
              <div style={{ fontSize: 12, color: palette.muted }}>
                PNG, JPG, GIF hasta 10MB
              </div>
            </div>
          </label>

          <button style={{ ...button(true), marginTop: 16 }} onClick={createProduct}>
            Crear Producto
          </button>
        </div>

        {/* COLUMNA B - CATEGORÍA */}
        <div style={{ ...card, padding: 16 }}>
          <h3 style={{ marginTop: 0 }}>Crear Nueva Categoría</h3>
          <div style={{ fontSize: 13, color: palette.muted, marginBottom: 12 }}>
            Organiza tus productos con categorías personalizadas.
          </div>

          <Label>Nombre de la Categoría</Label>
          <input
            style={input}
            placeholder="Ej: Material de Escritura"
            value={newCat}
            onChange={(e) => setNewCat(e.target.value)}
          />
          <button style={{ ...button(true), marginTop: 12 }} onClick={createCategory}>
            Crear Categoría
          </button>
        </div>
      </div>
    </div>
  );
}

const Label = ({ children, style }) => (
  <div style={{ fontSize: 13, color: palette.muted, margin: "8px 0 6px", ...style }}>
    {children}
  </div>
);

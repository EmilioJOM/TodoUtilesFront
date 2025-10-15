import React, { useState } from "react";
import { wrap, card, input, button, palette } from "../utils/styles.jsx";
import { getCategories, addCategory, addProduct } from "../utils/dataAPI.jsx";

export default function AdminCreate() {
  const [cats, setCats] = useState(getCategories());

  const [form, setForm] = useState({
    name: "", desc: "", price: "", stock: "", cat: "", image: ""
  });

  const [newCat, setNewCat] = useState("");

  const createProduct = () => {
    if (!form.name || !form.price || !form.stock || !form.cat) return;
    addProduct({
      name: form.name,
      price: parseFloat(form.price || "0"),
      stock: parseInt(form.stock || "0", 10),
      cat: form.cat,
      image: form.image || ""
    });
    window.alert("Producto creado ✅");
    window.location.hash = "#/search";
  };

  const createCategory = () => {
    if (!newCat.trim()) return;
    addCategory(newCat);
    setNewCat("");
    setCats(getCategories());
  };

  const uploaderBox = {
    border: `2px dashed ${palette.border}`,
    borderRadius: 16,
    height: 140,
    display: "grid",
    placeItems: "center",
    color: palette.muted,
    background: "#fafbff"
  };

  return (
    <div style={{ ...wrap, marginTop: 8 }}>
      <h2 style={{ margin: "8px 0 16px" }}>Crear Nuevo Producto</h2>
      <div style={{ display: "grid", gridTemplateColumns: "1.35fr 0.9fr", gap: 24 }}>
        {/* Columna A: Producto */}
        <div style={{ ...card, padding: 16 }}>
          <div style={{ fontSize: 13, color: palette.muted, marginBottom: 8 }}>
            Rellena los detalles para añadir un nuevo artículo a tu inventario.
          </div>

          <Label>Nombre del Producto</Label>
          <input style={input} placeholder="Ej: Lápiz de Grafito HB #2" value={form.name}
                 onChange={(e)=>setForm({ ...form, name: e.target.value })} />

          <Label style={{ marginTop: 12 }}>Descripción del Producto</Label>
          <textarea placeholder="Ej: Lápiz de grafito de alta calidad..."
                    value={form.desc}
                    onChange={(e)=>setForm({ ...form, desc: e.target.value })}
                    style={{ ...input, minHeight: 96, resize: "vertical" }} />

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginTop: 12 }}>
            <div>
              <Label>Precio</Label>
              <input style={input} placeholder="Ej: 1.50" value={form.price}
                     onChange={(e)=>setForm({ ...form, price: e.target.value })} />
            </div>
            <div>
              <Label>Stock</Label>
              <input style={input} placeholder="Ej: 100" value={form.stock}
                     onChange={(e)=>setForm({ ...form, stock: e.target.value })} />
            </div>
          </div>

          <Label style={{ marginTop: 12 }}>Categoría</Label>
          <select style={{ ...input, appearance: "none" }} value={form.cat}
                  onChange={(e)=>setForm({ ...form, cat: e.target.value })}>
            <option value="">Seleccionar categoría</option>
            {cats.map(c => <option key={c} value={c}>{c}</option>)}
          </select>

          <Label style={{ marginTop: 12 }}>Fotos del Producto</Label>
          <div style={uploaderBox}>
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: 28, marginBottom: 6 }}>☁️</div>
              <div><b>Sube un archivo</b> o arrastra y suelta</div>
              <div style={{ fontSize: 12, color: palette.muted }}>PNG, JPG, GIF hasta 10MB</div>
            </div>
          </div>

          <button style={{ ...button(true), marginTop: 16 }} onClick={createProduct}>
            Crear Producto
          </button>
        </div>

        {/* Columna B: Categoría */}
        <div style={{ ...card, padding: 16 }}>
          <h3 style={{ marginTop: 0 }}>Crear Nueva Categoría</h3>
          <div style={{ fontSize: 13, color: palette.muted, marginBottom: 12 }}>
            Organiza tus productos con categorías personalizadas.
          </div>

          <Label>Nombre de la Categoría</Label>
          <input style={input} placeholder="Ej: Material de Escritura"
                 value={newCat} onChange={(e)=>setNewCat(e.target.value)} />
          <button style={{ ...button(true), marginTop: 12 }} onClick={createCategory}>
            Crear Categoría
          </button>
        </div>
      </div>
    </div>
  );
}

const Label = ({ children, style }) => (
  <div style={{ fontSize: 13, color: palette.muted, margin: "8px 0 6px", ...style }}>{children}</div>
);

import React, { useState, useRef, useEffect } from "react";
import { wrap, card, input, button, palette } from "../utils/styles.jsx";
import { getCategories } from "../utils/dataAPI.jsx";
import { ProductsAPI, CategoriesAPI } from "../api/index.jsx";

export default function AdminCreate() {
  // categorías como lista de strings (p.ej. ["Librería", "Electrónica"])
  const [cats, setCats] = useState(getCategories());

  const [form, setForm] = useState({
    name: "", desc: "", price: "", stock: "", cat: ""
  });

  // imagen de producto
  const [file, setFile] = useState(null);
  const fileInputRef = useRef(null);
  const [preview, setPreview] = useState(null);

  // categoría nueva + imagen opcional
  const [newCat, setNewCat] = useState({ name: "", description: "" });
  const [catFile, setCatFile] = useState(null);
  const catFileInputRef = useRef(null);
  const [catPreview, setCatPreview] = useState(null);

  // para evitar envíos duplicados
  const [submittingProduct, setSubmittingProduct] = useState(false);
  const [submittingCategory, setSubmittingCategory] = useState(false);

  // limpiar objectURLs
  useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview);
      if (catPreview) URL.revokeObjectURL(catPreview);
    };
  }, [preview, catPreview]);

  const uploaderBox = {
    border: `2px dashed ${palette.border}`,
    borderRadius: 16,
    height: 140,
    display: "grid",
    placeItems: "center",
    color: palette.muted,
    background: "#fafbff",
    cursor: "pointer",
  };

  function validateImage(f) {
    if (!f) return false;
    const okType = /^image\//.test(f.type);
    const okSize = f.size <= 10 * 1024 * 1024; // 10MB
    if (!okType) { alert("El archivo debe ser una imagen"); return false; }
    if (!okSize) { alert("La imagen no debe superar los 10MB"); return false; }
    return true;
  }

  function openPicker() { fileInputRef.current?.click(); }
  function onPickFile(e) {
    const f = e.target.files?.[0];
    if (!f || !validateImage(f)) return;
    setFile(f);
    const url = URL.createObjectURL(f);
    setPreview(prev => { if (prev) URL.revokeObjectURL(prev); return url; });
  }
  function onDrop(e) {
    e.preventDefault();
    const f = e.dataTransfer.files?.[0];
    if (!f || !validateImage(f)) return;
    setFile(f);
    const url = URL.createObjectURL(f);
    setPreview(prev => { if (prev) URL.revokeObjectURL(prev); return url; });
  }
  function onDragOver(e){ e.preventDefault(); }

  // uploader categoría (si lo activás en el JSX)
  function openCatPicker() { catFileInputRef.current?.click(); }
  function onPickCatFile(e) {
    const f = e.target.files?.[0];
    if (!f || !validateImage(f)) return;
    setCatFile(f);
    const url = URL.createObjectURL(f);
    setCatPreview(prev => { if (prev) URL.revokeObjectURL(prev); return url; });
  }

  const createProduct = async () => {
    if (!form.name || !form.price || !form.stock || !form.cat) {
      alert("Completá nombre, precio, stock y categoría");
      return;
    }
    if (submittingProduct) return;
    setSubmittingProduct(true);

    try {
      const payload = {
        descripcion: form.name,                         // <-- ajusta si tu backend espera otra key
        descripcionLarga: form.desc || "",              // <-- opcional
        stock: parseInt(form.stock, 10) || 0,
        price: parseFloat(form.price) || 0,
        categoria: form.cat,                            // <-- si tu backend usa `categoria`
        // category: form.cat,                           // <-- o `category` (descomenta si corresponde)
      };

      // 1) Crear producto
      const created = await ProductsAPI.create(payload);

      // 2) Subir imagen si existe
      if (file && created?.id) {
        await ProductsAPI.uploadImagev2({ id: created.id, file });
      }

      alert("Producto creado ✅");
      window.location.hash = "#/search";
    } catch (e) {
      console.error(e);
      const msg = String(e?.message || "");
      if (msg.includes("403")) {
        alert("No autorizado (403). Verificá el token/cookie y permisos para el endpoint de upload.");
      } else {
        alert(msg || "No se pudo crear el producto");
      }
    } finally {
      setSubmittingProduct(false);
    }
  };

  const createCategory = async () => {
    if (!newCat.name?.trim()) {
      alert("El nombre de la categoría es obligatorio");
      return;
    }
    if (submittingCategory) return;
    setSubmittingCategory(true);

    try {
      // 1) crear categoría
      const created = await CategoriesAPI.create({
        name: newCat.name.trim(),
        description: newCat.description?.trim() || "",
      });

      // 2) si hay imagen, subir
      if (catFile && created?.id) {
        await CategoriesAPI.uploadImagev2({ id: created.id, file: catFile });
      }

      alert("Categoría creado ✅");
      // mantener cats como lista de strings
      setCats(prev => [...prev, created.name]);
      setNewCat({ name: "", description: "" });
      setCatFile(null);
      if (catPreview) { URL.revokeObjectURL(catPreview); setCatPreview(null); }
    } catch (e) {
      console.error(e);
      alert(e?.message || "No se pudo crear la categoría");
    } finally {
      setSubmittingCategory(false);
    }
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
          <input
            style={input}
            placeholder="Ej: Lápiz de Grafito HB #2"
            value={form.name}
            onChange={(e)=>setForm({ ...form, name: e.target.value })}
          />

          <Label style={{ marginTop: 12 }}>Descripción del Producto</Label>
          <textarea
            placeholder="Ej: Lápiz de grafito de alta calidad..."
            value={form.desc}
            onChange={(e)=>setForm({ ...form, desc: e.target.value })}
            style={{ ...input, minHeight: 96, resize: "vertical" }}
          />

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginTop: 12 }}>
            <div>
              <Label>Precio</Label>
              <input
                style={input}
                placeholder="Ej: 1.50"
                value={form.price}
                onChange={(e)=>setForm({ ...form, price: e.target.value })}
              />
            </div>
            <div>
              <Label>Stock</Label>
              <input
                style={input}
                placeholder="Ej: 100"
                value={form.stock}
                onChange={(e)=>setForm({ ...form, stock: e.target.value })}
              />
            </div>
          </div>

          <Label style={{ marginTop: 12 }}>Categoría</Label>
          <select
            style={{ ...input, appearance: "none" }}
            value={form.cat}
            onChange={(e)=>setForm({ ...form, cat: e.target.value })}
          >
            <option value="">Seleccionar categoría</option>
            {cats.map(c => <option key={c} value={c}>{c}</option>)}
          </select>

          <Label style={{ marginTop: 12 }}>Fotos del Producto</Label>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            style={{ display: "none" }}
            onChange={onPickFile}
          />
          <div
            style={uploaderBox}
            onClick={openPicker}
            onDrop={onDrop}
            onDragOver={onDragOver}
            role="button"
            aria-label="Subir imagen del producto"
            title="Subir imagen del producto"
          >
            {!preview ? (
              <div style={{ textAlign: "center" }}>
                <div style={{ fontSize: 28, marginBottom: 6 }}>☁️</div>
                <div><b>Sube un archivo</b> o arrastra y suelta</div>
                <div style={{ fontSize: 12, color: palette.muted }}>PNG, JPG, GIF hasta 10MB</div>
              </div>
            ) : (
              <img
                src={preview}
                alt="Vista previa"
                style={{ maxHeight: 120, borderRadius: 12, objectFit: "cover" }}
              />
            )}
          </div>

          <button
            style={{ ...button(true), marginTop: 16, opacity: submittingProduct ? 0.6 : 1 }}
            onClick={createProduct}
            disabled={submittingProduct}
          >
            {submittingProduct ? "Creando..." : "Crear Producto"}
          </button>
        </div>

        {/* Columna B: Categoría */}
        <div style={{ ...card, padding: 16 }}>
          <h3 style={{ marginTop: 0 }}>Crear Nueva Categoría</h3>
          <div style={{ fontSize: 13, color: palette.muted, marginBottom: 12 }}>
            Organiza tus productos con categorías personalizadas.
          </div>

          <Label>Nombre de la Categoría</Label>
          <input
            style={input}
            placeholder="Ej: Material de Escritura"
            value={newCat.name}
            onChange={(e)=>setNewCat(s => ({ ...s, name: e.target.value }))}
          />

          {/* Si querés habilitar descripción e imagen de categoría, descomenta este bloque */}
          {/*
          <Label style={{ marginTop: 12 }}>Descripción (opcional)</Label>
          <textarea
            style={{ ...input, minHeight: 72, resize: "vertical" }}
            placeholder="Ej: Todo para escribir y dibujar"
            value={newCat.description}
            onChange={(e)=>setNewCat(s => ({ ...s, description: e.target.value }))}
          />

          <Label style={{ marginTop: 12 }}>Imagen de la Categoría (opcional)</Label>
          <input
            ref={catFileInputRef}
            type="file"
            accept="image/*"
            style={{ display: "none" }}
            onChange={onPickCatFile}
          />
          <div
            style={uploaderBox}
            onClick={openCatPicker}
            role="button"
            aria-label="Subir imagen de la categoría"
            title="Subir imagen de la categoría"
          >
            {!catPreview ? (
              <div style={{ textAlign: "center" }}>
                <div style={{ fontSize: 28, marginBottom: 6 }}>🖼️</div>
                <div><b>Sube una imagen</b> (opcional)</div>
                <div style={{ fontSize: 12, color: palette.muted }}>PNG, JPG, GIF hasta 10MB</div>
              </div>
            ) : (
              <img
                src={catPreview}
                alt="Vista previa categoría"
                style={{ maxHeight: 120, borderRadius: 12, objectFit: "cover" }}
              />
            )}
          </div>
          */}

          <button
            style={{ ...button(true), marginTop: 12, opacity: submittingCategory ? 0.6 : 1 }}
            onClick={createCategory}
            disabled={submittingCategory}
          >
            {submittingCategory ? "Creando..." : "Crear Categoría"}
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

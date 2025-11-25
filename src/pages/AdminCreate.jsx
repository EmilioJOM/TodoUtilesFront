import React, { useState, useRef, useEffect } from "react";
import { wrap, card, input, button, palette } from "../utils/styles.jsx";
import { ProductsAPI, CategoriesAPI } from "../api/index.jsx";
import { fetchCategories } from "../redux/categorySlice.js";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { createCategory } from "../redux/categorySlice.js";
import { createProduct } from "../redux/productSlice.js";

export default function AdminCreate() { //TODAVIA NO ESTA 
  const dispatch=useDispatch()
  const{items: categories}= useSelector((state)=>state.categories)

  //obtengo todas las categorias
  useEffect(()=>{
    dispatch(fetchCategories())
  },[dispatch])


  //estado del coso que va a crear
  const [form, setForm] = useState({
    name: "", desc: "", price: "", stock: "", extraInfo: ""
  });

  // imagen de producto
  const [file, setFile] = useState(null);
  const fileInputRef = useRef(null);
  const [preview, setPreview] = useState(null);

  // categoría nueva
  const [newCategory, setNewCategory] =useState({id: 1, description:""});
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


  //******************************************** MANEJO DE IMAGENES ************************************************************* */ 

  //LA CAJA PARA METER LAS IMAGENES
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

  //********************************************************************************************************************* */


  const createNewProduct = async () => {
    if (!form.name || !form.price || !form.stock || !form.extraInfo) {
      alert("Completá nombre, descripcion, precio y stock");
      return;
    }
    const auxi = {
        descripcion: form.name,                         
        stock: parseInt(form.stock, 10) || 0,
        price: parseFloat(form.price) || 0,
        extraInfo: form.extraInfo
      };
    
    dispatch(createProduct(auxi))
    setForm({name: "", price:"",stock:"",extraInfo:""})
    }

    
/*     if (submittingProduct) return; 
    setSubmittingProduct(true); */
/* 
    try {
      const payload = {
        descripcion: form.name,                         // <-- ajusta si tu backend espera otra key
        extraInfo: form.desc || "",              // <-- opcional
        stock: parseInt(form.stock, 10) || 0,
        price: parseFloat(form.price) || 0,
        //categoria: form.cat,                            // <-- si tu backend usa `categoria`
        category: form.cat,                           // <-- o `category` (descomenta si corresponde)
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
    } */



  //Para crear categorias nuevas
  const createNewCategory = async () => {
    if (!newCategory.description?.trim()) {
      alert("El nombre de la categoría es obligatorio");
      return;
    }
    dispatch(createCategory(newCategory))
    setNewCategory({ id: 1, description: "" });
  };


  //LO QUE SE VE EN PANTALLA
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
          
          {/*este no funciona >:[*/}
          <Label style={{ marginTop: 12 }}>Descripción del Producto</Label>
          <textarea
            placeholder="Ej: Lápiz de grafito de alta calidad..."
            value={form.extraInfo}
            onChange={(e)=>setForm({ ...form, extraInfo: e.target.value })}
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
            {categories.map(c => <option key={c.id} value={c.description}>{c.description}</option>)}
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
            onClick={createNewProduct}
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
            value={newCategory.description}
            onChange={(e)=> setNewCategory(s=>({...2, description: e.target.value}))}
          />
          <button
            style={{ ...button(true), marginTop: 12, opacity: submittingCategory ? 0.6 : 1 }}
            onClick={()=>createNewCategory(newCategory)}
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

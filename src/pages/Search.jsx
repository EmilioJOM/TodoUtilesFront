import React, { useEffect, useMemo, useState } from "react";
import { input, tag, wrap } from "../utils/styles.jsx";
import ProductCard from "../components/ProductCard.jsx";
import { getProducts, getCategories } from "../utils/dataAPI.jsx";

const Search=({ store, queryFromNav })=>{
  const params = new URLSearchParams(window.location.hash.split("?")[1] || "");
  const startQ = params.get("q") || "";
  const startCat = params.get("cat") || "";
  const [q, setQ] = useState(queryFromNav || startQ);
  const [cat, setCat] = useState(startCat);


  const [products, setProducts] = useState([]);
  const [categories, setCategories]=useState([]);

  //NECESITO UNA URL PARA ACCEDER A TODOS LOS PRODUCTOS, NO SOLO EL QUE PASO POR ID -- ESTO ESTA MAL POR AHORA
  const URL_PRODUCTOS='http://127.0.0.1:4002/api/productos/{id}'
  const URL_CATEGORIAS='http://127.0.0.1:4002/categories'

  //obtengo todos los productos
  useEffect(() => {
    fetch(URL_PRODUCTOS)  
      .then((response) => response.json()) 
      .then((data) => {
        setProducts(data); 
      })
      .catch((error) => { 
        console.error("Error al obtener productos: ", error);
      });
  }, []);

  //obtengo las categorias
  useEffect(() => {
    fetch(URL_CATEGORIAS)  
      .then((response) => response.json()) 
      .then((data) => {
        setCategories(data); 
      })
      .catch((error) => { 
        console.error("Error al obtener categorías: ", error);
      });
  }, []);


  const list = useMemo( //creo una lista con los productos filtrados
  () => products.filter((p) => 
    (!cat || (Array.isArray(p.categories) && p.categories.includes(cat))) &&
    (!q || p.description.toLowerCase().includes(q.toLowerCase()))
  ),
  [q, cat, products]
);


  useEffect(() => { //cambia el URL de la pagina si escribimos algun parametro de busqueda
    const search = new URLSearchParams();
    if (q) search.set("q", q);
    if (cat) search.set("cat", cat);
    window.location.hash = `#/search${search.toString() ? "?" + search.toString() : ""}`;
  }, [q, cat]);

  return (
    <div style={{ ...wrap }}>
      <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 12 }}>
        <div style={{ ...tag }}>Filtros</div>
        <select value={cat} onChange={(e) => setCat(e.target.value)} style={{ ...input, maxWidth: 200 }}>
          <option value="">Categorías</option>
          {categories.map((c) => <option 
          key={c.id} 
          value={c.description}>{c.description}
          </option>)}
        </select>
        <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Realizar busqueda…" style={{ ...input, maxWidth: 280 }} />
        {(q || cat) && (
          <button onClick={() => { setQ(""); setCat(""); }} style={{ padding: "10px 14px", borderRadius: 12, border: "1px solid #e5e7eb", background: "#fff" }}>
            Limpiar filtros
          </button>
        )}
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(220px,1fr))", gap: 16 }}>
        {list.map((p) => //muestro los productos que se filtraron antes, en ProductCard's
        <ProductCard 
        key={p.id} 
        product={p} 
        onAdd={store.add} />)}
      </div>
    </div>
  );
}

export default Search

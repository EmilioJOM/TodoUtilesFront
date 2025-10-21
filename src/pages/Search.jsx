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

  const PRODUCTS = getProducts();
  const CATEGORIES = getCategories();

  const list = useMemo(
    () => PRODUCTS.filter((p) => (!cat || p.cat === cat) && (!q || p.name.toLowerCase().includes(q.toLowerCase()))),
    [q, cat, PRODUCTS]
  );

  useEffect(() => {
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
          {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>
        <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Cuadernos…" style={{ ...input, maxWidth: 280 }} />
        {(q || cat) && (
          <button onClick={() => { setQ(""); setCat(""); }} style={{ padding: "10px 14px", borderRadius: 12, border: "1px solid #e5e7eb", background: "#fff" }}>
            Limpiar filtros
          </button>
        )}
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(220px,1fr))", gap: 16 }}>
        {list.map((p) => <ProductCard key={p.id} product={p} onAdd={store.add} />)}
      </div>
    </div>
  );
}

export default Search

import { useEffect, useMemo, useState } from "react";
import { input, tag, wrap } from "../utils/styles.jsx";
import ProductCard from "../components/ProductCard.jsx";
import NoResults from "../components/NoResults.jsx";

const Search = ({ store, queryFromNav}) => {

  // Estado para filtros activos
  const [cat, setCat] = useState(""); 
  const [maxPrice, setMaxPrice] = useState("");
  const [searchQuery, setSearchQuery] = useState(""); 

  //lo que estan escribiendo los usuarios en el momento
  const[query,setQuery]=useState("");
  const[price,setPrice]=useState("");

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);

  const URL_PRODUCTOS = "http://localhost:4002/api/productos";
  const URL_CATEGORIAS = "http://localhost:4002/categories";

  // Obtengo todos los productos
  useEffect(() => {
    fetch(URL_PRODUCTOS)
      .then((response) => response.json())
      .then((data) => setProducts(data))
      .catch((error) => console.error("Error al obtener productos: ", error));
  }, []);


  //todas las categorias
  useEffect(() => { //el back maneja las categorias como Page
  fetch(URL_CATEGORIAS)
    .then((response) => response.json())
    .then((data) => {
      setCategories(Array.isArray(data.content) ? data.content : []);
    })
    .catch((error) => console.error("Error al obtener las categorías: ", error));
}, []);


  //creo una lista con todos los productos filtrados
  const list = useMemo(() => { 
    return products.filter((p) => {
      const inCategory = !cat || (Array.isArray(p.categories) && p.categories.map(c=>c.description).includes(cat)); //filtra por categoria
      const inQuery = !searchQuery || p.description.toLowerCase().includes(searchQuery.toLowerCase()); //este es el que filtra por descripcion
      
      const price = parseFloat(p.price);
      const max = parseFloat(maxPrice);
      const inMax = !maxPrice || (!isNaN(max) && price <= max);
      

      return inCategory && inQuery && inMax;
    });
  }, [searchQuery, cat, maxPrice, products]);



  return (
    <div style={{ ...wrap }}>
      <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 12 }}>
        <div style={{ ...tag }}>Filtros</div>

        {/* Para filtrar por categoria*/}
        <select value={cat} onChange={(e) => setCat(e.target.value)} style={{ ...input, maxWidth: 200 }}>
          <option value="">Categorías</option>
          {Array.isArray(categories) &&
            categories.map((c) => (
              <option key={c.id} value={c.description}>
                {c.description}
              </option>
            ))}
        </select>



        {/* Filtro por precio máximo */}
        <input
          type="number"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              setMaxPrice(price); // aplicar búsqueda al presionar Enter
            }
          }}
          placeholder="Precio máximo"
          style={{ ...input, maxWidth: 120 }}
        />

        {/* Input de búsqueda (escribe libremente) -- se filtra por descripcion */}
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              setSearchQuery(query); // aplicar búsqueda al presionar Enter
            }
          }}
          placeholder="Realizar búsqueda…"
          style={{ ...input, maxWidth: 280 }}
        />


        {/* Botón para aplicar la búsqueda manualmente */}
        <button
          onClick={() => setQ(searchQuery)}
          style={{ padding: "10px 14px", borderRadius: 12, border: "1px solid #e5e7eb", background: "#fff" }}
        >
          Buscar
        </button>


        {/* Botón para limpiar filtros */}
        {(searchQuery || cat || maxPrice) && (
          <button
            onClick={() => {
              setSearchQuery("");
              setQuery("");
              setCat("");
              setMaxPrice("");
              setPrice("");
            }}
            style={{
              padding: "10px 14px",
              borderRadius: 12,
              border: "1px solid #e5e7eb",
              background: "#fff",
            }}
          >
            Limpiar filtros
          </button>
        )}
      </div>
      
      {/*renderizado condicional*/}
      {list.length===0 ? ( //si la busqueda con filtros no da ningun resultado
        <NoResults/>
      ) : ( //si SI tiene resultados
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill,minmax(220px,1fr))",
            gap: "16px", 
            padding: "20px", 
            justifyItems: "center", 
        }}
      >
        {list.map((p) => ( //muestro los productos que se filtraron antes, en ProductCard's
          <ProductCard key={p.id} product={p} onAdd={store.add} />
        ))}
      </div>
      )
      }

    </div>
  );
};

export default Search;



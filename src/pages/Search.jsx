import { useEffect, useMemo, useState } from "react";
import { input, tag, wrap } from "../utils/styles.jsx";
import ProductCard from "../components/ProductCard.jsx";
import NoResults from "../components/NoResults.jsx";
import { useDispatch } from "react-redux";
import { fetchAllProducts } from "../redux/productSlice.js";
import { useSelector } from "react-redux";
import { fetchCategories } from "../redux/categorySlice.js";
import {setFilterCategory} from "../redux/categorySlice.js";

const Search = ({ store, queryFromNav}) => {

  const dispatch=useDispatch()
  const {items: products,error:productError,loading:productLoading} = useSelector((state)=>state.products)
  const{items: categories,filterCategory:cat}= useSelector((state)=>state.categories)

  //obtengo todos los productos
  useEffect(()=>{ 
    dispatch(fetchAllProducts())
  },[dispatch])

  //obtengo todas las categorias
  useEffect(()=>{
    dispatch(fetchCategories())
  },[dispatch])

  // Estado para filtros activos
  const [maxPrice, setMaxPrice] = useState("");
  const [searchQuery, setSearchQuery] = useState(""); 

  //lo que estan escribiendo los usuarios en el momento
  const[query,setQuery]=useState("");
  const[price,setPrice]=useState("");

  //creo una lista con todos los productos filtrados
  const list = useMemo(() => { 
    return products.filter((p) => {
      const inCategory = !cat || (Array.isArray(p.categories) && p.categories.map(c=>c.description).includes(cat)); //filtra por categoria
      const inQuery = !searchQuery || p.description.toLowerCase().includes(searchQuery.toLowerCase()); //filtra por descripcion
      
      const price = parseFloat(p.price);
      const max = parseFloat(maxPrice);
      const inMax = !maxPrice || (!isNaN(max) && price <= max);
      

      return inCategory && inQuery && inMax;
    });
  }, [searchQuery, cat, maxPrice, products]);


if (productLoading) return <p>Cargando productos...</p>
if (productError) return <p>Error al cargar los productos: {error}</p>
  return (
    <div style={{ ...wrap }}>
      <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 12 }}>
        <div style={{ ...tag }}>Filtros</div>

        {/* Para filtrar por categoria*/}
        <select value={cat} onChange={(e) => dispatch(setFilterCategory(e.target.value))} style={{ ...input, maxWidth: 200 }}>
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
              dispatch(setFilterCategory(""));
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



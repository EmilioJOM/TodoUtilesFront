
import Hero from "../components/Hero.jsx";
import Section from "../components/Section.jsx";
import { card, palette } from "../utils/styles.jsx";
import ProductCard from "../components/ProductCard.jsx";
import { useEffect, useState } from "react";
import "./pagesStyles/Home.css"

const Home=({store}) =>{

  const [products, setProducts] = useState([]);
  const [categories, setCategories]=useState([]);

  //La URL accede a todos los productos
  const URL_PRODUCTOS='http://localhost:4002/api/productos'
  
  //accede a todas las categorias
  const URL_CATEGORIAS='http://localhost:4002/categories'

  //obtengo todos los productos
  useEffect(() => {
    fetch(URL_PRODUCTOS)  
      .then((response) => response.json()) 
      .then((data) => {
        setProducts(data); 
      })
      .catch((error) => { 
        console.error("Error al obtener los datos: ", error);
      });
  }, []);

  //obtengo las categorias
  useEffect(() => { //el back maneja las categorias como page, no como una lista
  fetch(URL_CATEGORIAS)
    .then((response) => response.json())
    .then((data) => {
      setCategories(Array.isArray(data.content) ? data.content : []);
    })
    .catch((error) => console.error("Error al obtener las categorías: ", error));
}, []);


  return (
    <>

      <Hero />
        <Section title="Nuestros productos" link={<a href="#/search">Ver todo</a>}>
          <div className="carousel-wrap">
            <div
              className="product-carousel"
              onWheel={(e) => {
                const el = e.currentTarget;
                if (el.scrollWidth > el.clientWidth) {
                  e.preventDefault();
                  el.scrollLeft += e.deltaY;
                }
              }}
            >
              {products.slice(0, 10).map((p) => (
                <ProductCard key={p.id} product={p} onAdd={store.add} />
              ))}
            </div>
          </div>
        </Section>
      <Section title="Categorías">
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(160px,1fr))", gap: 12 ,color: "8cacf2ff"}}>
          {categories.map((c) => (
            <a key={c.id} 
            href={`#/search`} style={{ ...card, padding: 16, textDecoration: "none", color: "#2563eb" }}>
              <div style={{ fontWeight: 700 }}>{c.description}</div>
            </a>
          ))}
        </div>
      </Section>


    </>
  );

}

export default Home



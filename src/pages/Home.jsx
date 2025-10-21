
import Hero from "../components/Hero.jsx";
import Section from "../components/Section.jsx";
import { card, palette } from "../utils/styles.jsx";
import ProductCard from "../components/ProductCard.jsx";
import { useEffect, useState } from "react";

const Home=({store}) =>{

  const [productCards, setProductCards] = useState([]);
  const [categories, setCategories]=useState([]);

  //NECESITO UNA URL PARA ACCEDER A TODOS LOS PRODUCTOS, NO SOLO EL QUE PASO POR ID
  const URL_PRODUCTOS='http://127.0.0.1:4002/api/productos/{id}'
  const URL_CATEGORIAS='http://127.0.0.1:4002/categories'

  //obtengo todos los productos
  useEffect(() => {
    fetch(URL_PRODUCTOS)  
      .then((response) => response.json()) 
      .then((data) => {
        setProductCards(data); 
      })
      .catch((error) => { 
        console.error("Error al obtener los datos: ", error);
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
        console.error("Error al obtener los datos: ", error);
      });
  }, []);


  return (
    <>

      <Hero />
      <Section title="Nuestros productos" link={<a href="#/search">Ver todo</a>}>
        <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>

          {productCards.slice(0,5).map((card) => ( //tengo que mapear el estado asi que uso map
          <ProductCard
            key={card.id} //map SIEMPRE necesita una key para funcionar
            product={card}
            onAdd={store.add}
          />
        ))}
        </div>
        </Section>

      <Section title="Categorías">
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(160px,1fr))", gap: 12 }}>
          {categories.map((c) => (
            <a key={c.id} 
            href={`#/search?cat=${encodeURIComponent(c.description)}`} style={{ ...card, padding: 16, textDecoration: "none", color: palette.ink }}>
              <div style={{ fontWeight: 700 }}>{c.description}</div>
            </a>
          ))}
        </div>
      </Section>


    </>
  );

}

export default Home



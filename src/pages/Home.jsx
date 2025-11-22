
import Hero from "../components/Hero.jsx";
import Section from "../components/Section.jsx";
import { card, palette } from "../utils/styles.jsx";
import ProductCard from "../components/ProductCard.jsx";
import { useEffect, useState } from "react";
import "./pagesStyles/Home.css"
import { useDispatch } from "react-redux";
import { fetchProducts } from "../redux/productSlice.js";
import { useSelector } from "react-redux";
import { fetchCategories } from "../redux/categorySlice.js";
import {setFilterCategory} from "../redux/categorySlice.js";

const Home=({store}) =>{

  const dispatch=useDispatch()
  const {items: products,error: productError,loading:productLoading} = useSelector((state)=>state.products)
  const {items: categories}= useSelector((state)=>state.categories)
  
  //obtengo todos los productos
  useEffect(()=>{  
    dispatch(fetchProducts())
  },[dispatch])

  //obtengo todas las categorias
  useEffect(()=>{
    dispatch(fetchCategories())
  },[dispatch])

if (productLoading) return <p>Cargando productos...</p>
if (productError) return <p>Error al cargar los productos: {error}</p>
  return (
    <>

      <Hero />
        <Section title="Nuestros productos" 
        link={<a
        onClick={()=>dispatch(setFilterCategory(""))} 
        href="#/search">Ver todo</a>}>
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
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(160px,1fr))", gap: 12 ,color:"#eb25baff" }}>
          {categories.map((c) => (
            <a key={c.id}
            onClick={()=>dispatch(setFilterCategory(c.description))}
            href={`#/search`} style={{ ...card, padding: 16, textDecoration: "none", color: "#165ef8ff" }}>
              <div style={{ fontWeight: 700 }}>{c.description}</div>
            </a>
          ))}
        </div>
      </Section>


    </>
  );

}

export default Home



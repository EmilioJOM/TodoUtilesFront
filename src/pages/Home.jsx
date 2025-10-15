import React from "react";
import Hero from "../components/Hero.jsx";
import Section from "../components/Section.jsx";
import ProductCard from "../components/ProductCard.jsx";
import OfferCard from "../components/OfferCard.jsx";
import { card, palette } from "../utils/styles.jsx";
import { getProducts, getCategories } from "../utils/dataAPI.jsx";

export default function Home({ store }) {
  const PRODUCTS = getProducts();
  const CATEGORIES = getCategories();

  return (
    <>
      <Hero />
      <Section title="Productos más vendidos" link={<a href="#/search">Ver todo</a>}>
        <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
          {PRODUCTS.slice(0, 5).map((p) => <ProductCard key={p.id} product={p} onAdd={store.add} />)}
        </div>
      </Section>

      <Section title="Categorías">
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(160px,1fr))", gap: 12 }}>
          {CATEGORIES.map((c) => (
            <a key={c} href={`#/search?cat=${encodeURIComponent(c)}`} style={{ ...card, padding: 16, textDecoration: "none", color: palette.ink }}>
              <div style={{ height: 80, borderRadius: 12, background: "#eef2ff", marginBottom: 10 }} />
              <div style={{ fontWeight: 700 }}>{c}</div>
            </a>
          ))}
        </div>
      </Section>

      <Section title="Ofertas especiales">
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(260px,1fr))", gap: 16 }}>
          <OfferCard title="Descuento en mochilas" text="¡20% de descuento en todas las mochilas!" />
          <OfferCard title="Oferta en cuadernos" text="Compra 2 y llévate el tercero gratis." />
          <OfferCard title="Promoción de bolígrafos" text="Cajas de bolígrafos seleccionadas con 15% off." />
          <OfferCard title="Rebajas en material de arte" text="Hasta 30% de descuento en pinturas y pinceles." />
        </div>
      </Section>
    </>
  );
}

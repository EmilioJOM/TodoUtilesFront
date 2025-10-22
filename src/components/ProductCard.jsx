import React from "react";
import { card, button, palette } from "../utils/styles.jsx";
import { currency } from "../utils/Format.jsx";

const ProductCard = ({ product, onAdd }) => {

    //estoy asumiendo que los productos tienen una lista de URLs de imagenes
  const imageUrl = product.images?.[0] || "/imagenPlaceholder.jpg";

  return ( 
    
    //manejo de la imagen
    <div style={{ ...card, padding: 12, width: 220 }}>
      <img
        src={imageUrl}
        alt={product.description}
        style={{
          height: 120,
          width: "100%",
          objectFit: "cover",
          borderRadius: 12,
          marginBottom: 10
        }}
      />
      
      {/*Informacion del producto*/}
      <div style={{ fontWeight: 700 }}>{product.description}</div>
      <div style={{ color: palette.muted, fontSize: 13, marginTop: 4 }}>
        {currency(product.price)}
      </div>
      <div style={{ marginTop: 10, display: "flex", gap: 8 }}>
        <a
          href={`#/product/${product.id}`}
          style={{ ...button(false), padding: "8px 12px" }}
        >
          Ver
        </a>

      </div>
    </div>
  );
};

export default ProductCard;



 
import React from "react";
import { card, button, palette } from "../utils/styles.jsx";
import { currency } from "../utils/Format.jsx";

const ProductCard=({ product, onAdd })=>{


    return (
<div style={{ ...card, padding: 12, width: 220 }}>
<div style={{ height: 120, borderRadius: 12, background: "#e2e8f0", marginBottom: 10 }} />
<div style={{ fontWeight: 700 }}>{product.description}</div>
<div style={{ color: palette.muted, fontSize: 13, marginTop: 4 }}>{currency(product.price)}</div>
<div style={{ marginTop: 10, display: "flex", gap: 8 }}>
<a href={`#/product/${product.id}`} style={{ ...button(false), padding: "8px 12px" }}>Ver</a>
<button style={{ ...button(true), padding: "8px 12px" }} onClick={() => onAdd(product.id)}>Agregar</button>
</div>
</div>
);

}

export default ProductCard



 
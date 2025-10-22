import { useEffect, useState } from "react";
import Row from "../components/Row.jsx";
import { wrap, card, input, button } from "../utils/styles.jsx";
import { currency } from "../utils/Format.jsx";


const Product=({store,id})=>{ 
  
  const URL = `http://localhost:4002/api/productos/${id}`;

  const [product, setProduct] = useState();

  const [mainImage, setMainImage] = useState(0);
  
  //Obtengo el producto
  useEffect(() => {
  fetch(URL)
    .then((response) => response.json())
    .then((data) => setProduct(data))
    .catch((error) => console.error("Error:", error));
  }, [id]);


  const [qty, setQty] = useState(1);
  if (!product) return <div style={{ ...wrap, marginTop: 24 }}>Producto no encontrado.</div>;
  return (
    <div style={{ ...wrap, marginTop: 8, display: "grid", gridTemplateColumns: "1.2fr 1fr", gap: 24 }}>
      <div style={{ ...card, padding: 16, minHeight: 340 }}>

        {//Imagen grande
        }
      <img
        src={
          product.images?.length > 0
            ? product.images[mainImage]
            : "public\imagenPlaceholder.jpg"
        }
        alt={product.description}
        style={{ height: 300, width: "100%", objectFit: "cover", borderRadius: 12 }}
      />

      {//imagenes chiquitas
      }
      <div style={{ display: "flex", gap: 12, marginTop: 12 }}>
        {product.images?.length > 1 && (
          <div style={{ display: "flex", gap: 12, marginTop: 12 }}>
            {product.images.slice(0, 3).map((img, idx) => (
              <img
                key={idx}
                src={img}
                alt={`Miniatura ${idx + 1}`}
                onClick={() => setMainImage(idx)}
                style={{
                  flex: 1,
                  height: 70,
                  borderRadius: 10,
                  objectFit: "cover",
                  cursor: "pointer",
                  border: mainImage === idx ? "2px solid #3b82f6" : "none"
                }}
              />
            ))}
          </div>
        )}

      </div>


      {//informacion del producto
      }
      </div>
      <div style={{ ...card, padding: 16 }}>
        <h1 style={{ margin: 0 }}>{product.description}</h1>
        <div style={{ marginTop: 12 }}>
          <Row label="Precio" value={<b>{currency(product.price)}</b>} />
          <Row label="Stock" value={`${product.stock} unidades`} />
          <Row label="Categoría(s)" value={
            Array.isArray(product.categories) && product.categories.length > 0 
            ? product.categories.join(", ")
            : "Sin categoría"
            }
          />
        </div>
        <div style={{ display: "flex", gap: 10, marginTop: 14 }}>
          <button onClick={() => setQty((q) => Math.max(1, q - 1))} style={button(false)}>-</button>
          <div style={{ ...input, width: 60, textAlign: "center" }}>{qty}</div>
          <button onClick={() => setQty((q) => q + 1)} style={button(false)}>+</button>
          <button onClick={() => { store.add(product.id, qty); window.location.hash = "#/cart"; }} style={button(true)}>
            🛒 Agregar al carrito
          </button>
        </div>
      </div>
    </div>
  );
}



export default Product

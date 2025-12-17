import React, { useEffect } from "react";
import { card, button, palette } from "../utils/styles.jsx";
import { currency } from "../utils/Format.jsx";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchProductImage,
  selectImageByProduct,
} from "../redux/imagenSlice";

const ProductCard = ({ product }) => {
  const dispatch = useDispatch();

  const imageUrl = useSelector(selectImageByProduct(product.id));

  // pedir imagen solo una vez por producto
  useEffect(() => {
    if (!imageUrl) {
      dispatch(fetchProductImage({ productId: product.id }));
    }
  }, [dispatch, product.id, imageUrl]);

  return (
    <div style={{ ...card, padding: 12, width: 220 }}>
      {/* Imagen */}
      <img
        src={imageUrl || "/imagenPlaceholder.jpg"}
        alt={product.description}
        style={{
          height: 120,
          width: "100%",
          objectFit: "cover",
          borderRadius: 12,
          marginBottom: 10,
          background: "#f1f5f9",
        }}
      />

      {/* Info */}
      <div style={{ fontWeight: 700 }}>{product.description}</div>
      <div style={{ color: palette.muted, fontSize: 13, marginTop: 4 }}>
        {currency(product.price)}
      </div>

      <div style={{ marginTop: 10 }}>
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

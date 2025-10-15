import { useEffect, useMemo, useState } from "react";
import { getProducts, findCoupon } from "../utils/dataAPI.jsx";

// Cupón de demo previo: se mantiene como fallback
const COUPON_FALLBACK = { code: "CUPONAZO24", percent: 15 };

export default function useStore() {
  const [cart, setCart] = useState(() => JSON.parse(localStorage.getItem("tu_cart") || "[]"));
  const [user, setUser] = useState(() => JSON.parse(localStorage.getItem("tu_user") || null));
  const [coupon, setCoupon] = useState(() => localStorage.getItem("tu_coupon") || "");

  useEffect(() => localStorage.setItem("tu_cart", JSON.stringify(cart)), [cart]);
  useEffect(() => localStorage.setItem("tu_user", JSON.stringify(user)), [user]);
  useEffect(() => localStorage.setItem("tu_coupon", coupon), [coupon]);

  const add = (id, qty = 1) =>
    setCart((c) => {
      const found = c.find((i) => i.id === id);
      if (found) return c.map((i) => (i.id === id ? { ...i, qty: Math.max(1, i.qty + qty) } : i));
      return [...c, { id, qty }];
    });

  const setQty = (id, qty) => setCart((c) => c.map((i) => (i.id === id ? { ...i, qty: Math.max(1, qty) } : i)));
  const remove = (id) => setCart((c) => c.filter((i) => i.id !== id));
  const clear = () => setCart([]);

  const products = getProducts();
  const items = useMemo(() => cart.map((i) => ({ ...i, product: products.find((p) => p.id === i.id) })), [cart, products]);

  const subtotal = items.reduce((s, i) => s + (i.product?.price || 0) * i.qty, 0);

  // cupones: primero buscar en admin, luego fallback
  let couponPercent = 0;
  const adminCoupon = findCoupon(coupon);
  if (adminCoupon) couponPercent = adminCoupon.percent;
  else if (coupon === COUPON_FALLBACK.code) couponPercent = COUPON_FALLBACK.percent;

  const discount = subtotal * (couponPercent / 100);
  const taxes = subtotal > 0 ? subtotal * 0.08 : 0;
  const shipping = subtotal > 0 ? 0 : 0;
  const total = Math.max(0, subtotal - discount + taxes + shipping);

  return { cart, add, setQty, remove, clear, items, subtotal, discount, taxes, shipping, total, coupon, setCoupon, user, setUser };
}

export { COUPON_FALLBACK as COUPON };

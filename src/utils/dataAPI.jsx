// Utilidades simples con LocalStorage (demo)

import { PRODUCTS as BASE_PRODUCTS } from "../data/products.jsx";
import { CATEGORIES as BASE_CATEGORIES } from "../data/categories.jsx";

const LS_PRODUCTS = "tu_products_custom";
const LS_CATEGORIES = "tu_categories_custom";
const LS_COUPONS = "tu_coupons_list";

const read = (k, fallback) => {
  try { return JSON.parse(localStorage.getItem(k) || JSON.stringify(fallback)); }
  catch { return fallback; }
};
const write = (k, v) => localStorage.setItem(k, JSON.stringify(v));

// ---------- Productos ----------
export function getProducts() {
  const extra = read(LS_PRODUCTS, []);
  return [...BASE_PRODUCTS, ...extra];
}

export function addProduct(p) {
  const extra = read(LS_PRODUCTS, []);
  extra.push({ ...p, id: `u${Date.now()}` });
  write(LS_PRODUCTS, extra);
}

export function getCategories() {
  const extra = read(LS_CATEGORIES, []);
  const merged = [...BASE_CATEGORIES, ...extra];
  // únicos preservando orden
  return [...new Set(merged)];
}

export function addCategory(name) {
  const trimmed = `${name}`.trim();
  if (!trimmed) return;
  const extra = read(LS_CATEGORIES, []);
  if (extra.includes(trimmed) || BASE_CATEGORIES.includes(trimmed)) return;
  extra.push(trimmed);
  write(LS_CATEGORIES, extra);
}

// ---------- Cupones ----------
const defaultCoupons = [
  { code: "DESCUENTO10", percent: 10, expires: "2024-12-31" },
  { code: "ESPECIAL20",  percent: 20, expires: "2024-11-15" },
  { code: "REGRESO5",    percent: 5,  expires: "2024-09-30" },
];

export function getCoupons() {
  const list = read(LS_COUPONS, defaultCoupons);
  if (!localStorage.getItem(LS_COUPONS)) write(LS_COUPONS, list);
  return list;
}

export function addCoupon(coupon) {
  const list = getCoupons();
  list.push(coupon);
  write(LS_COUPONS, list);
}

export function deleteCoupon(idx) {
  const list = getCoupons();
  list.splice(idx, 1);
  write(LS_COUPONS, list);
}

export function findCoupon(code) {
  if (!code) return null;
  const cc = code.trim().toUpperCase();
  const now = new Date();
  const list = getCoupons();
  const c = list.find(x => x.code.toUpperCase() === cc);
  if (!c) return null;
  if (c.expires) {
    const d = new Date(c.expires);
    if (isFinite(d) && d < now) return null;
  }
  return c;
}

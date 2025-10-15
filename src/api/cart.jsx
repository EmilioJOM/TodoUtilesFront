import { request } from "./http.jsx";

// /carts/**
export const CartAPI = {
  getOrCreateCart() {
    return request(`/carts/cart`);
  },
  listProducts() {
    return request(`/carts/products`);
  },
  add({ productId, quantity = 1 }) {
    return request(`/carts/add/${productId}`, { method: "POST", query: { quantity } });
  },
  update({ productId, quantity }) {
    return request(`/carts/update/${productId}`, { method: "PUT", query: { quantity } });
  },
  remove({ productId }) {
    return request(`/carts/remove/${productId}`, { method: "DELETE" });
  },
  purchase() {
    return request(`/carts/purchase`, { method: "POST" });
  },
};

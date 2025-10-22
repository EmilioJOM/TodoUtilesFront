import { request } from "./http.jsx";

export const CartAPI = {
  getOrCreate: () => request("/carts/cart"),
  listProducts: () => request("/carts/products"),
  add: (productId, quantity = 1) =>
    request(`/carts/add/${productId}`, { method: "POST", query: { quantity } }),
  update: (productId, quantity) =>
    request(`/carts/update/${productId}`, { method: "PUT", query: { quantity } }),
  remove: (productId) =>
    request(`/carts/remove/${productId}`, { method: "DELETE" }),
  purchase: () => request(`/carts/purchase`, { method: "POST" }),
};
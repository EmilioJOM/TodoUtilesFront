import { request } from "./http.jsx";

// /api/productos/**
export const ProductsAPI = {
  getById(id) {
    return request(`/api/productos/${id}`);
  },
  create({ descripcion, stock, price }) {
    return request("/api/productos", { method: "POST", data: { descripcion, stock, price } });
  },
  remove(id) {
    return request(`/api/productos/${id}`, { method: "DELETE" });
  },
  addCategory({ id, categoryDescription }) {
    return request(`/api/productos/add-category`, { method: "POST", query: { id, categoryDescription } });
  },
  deleteCategory({ id, categoryDescription }) {
    return request(`/api/productos/delete-category`, { method: "POST", query: { id, categoryDescription } });
  },
  changeDescription({ id, description }) {
    return request(`/api/productos/change-description`, { method: "POST", query: { id, description } });
  },
  addStock({ id, stock }) {
    return request(`/api/productos/add-stock`, { method: "POST", query: { id, stock } });
  },
  changePrice({ id, price }) {
    return request(`/api/productos/change-price`, { method: "POST", query: { id, price } });
  },

  // Opción 1: usa el endpoint clásico con @RequestParam("file")
  uploadImage({ id, file }) {
    const fd = new FormData();
    fd.append("file", file);
    return request(`/api/productos/${id}/imagen`, { method: "POST", data: fd, isForm: true });
  },

  // Opción 2: usa el endpoint v2 con @RequestPart("file")
  uploadImagev2({ id, file }) {
    const fd = new FormData();
    fd.append("file", file); // el nombre debe coincidir con @RequestPart("file")
    return request(`/api/productos/${id}/imagen/v2`, { method: "POST", data: fd, isForm: true });
  },
};

import { request } from "./http.jsx";

// /categories/**
export const CategoriesAPI = {
  list({ page, size } = {}) {
    return request(`/categories`, { query: { page, size } });
  },
  get(id) {
    return request(`/categories/${id}`);
  },
  create({ description }) {
    return request(`/categories`, { method: "POST", data: { description } });
  },
  remove(id) {
    return request(`/categories/${id}`, { method: "DELETE" });
  },
};

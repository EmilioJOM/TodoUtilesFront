import { request } from "./http.jsx";

// /searches/**
export const SearchAPI = {
  byPrice(price) {
    return request(`/searches/precio/${encodeURIComponent(price)}`);
  },
  byDescription(description) {
    return request(`/searches/producto/${encodeURIComponent(description)}`);
  },
  byCategory(category) {
    return request(`/searches/category/${encodeURIComponent(category)}`);
  },
  byCategoryAndPrice({ category, price }) {
    return request(`/searches/product/${encodeURIComponent(category)}/${encodeURIComponent(price)}`);
  },
};

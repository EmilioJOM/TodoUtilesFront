import { request } from "./http.jsx";

// /cupones/**
export const CouponsAPI = {
  list() {
    return request(`/cupones`);
  },
  getByCode(codigo) {
    return request(`/cupones/${encodeURIComponent(codigo)}`);
  },
  create(cupon) {
    return request(`/cupones`, { method: "POST", data: cupon });
  },
  remove(idCupon) {
    return request(`/cupones/${idCupon}`, { method: "DELETE" });
  },
};

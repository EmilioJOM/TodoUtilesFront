import { request } from "./http.jsx";

// /ventas/**
export const SalesAPI = {
  list() {
    return request(`/ventas`);
  },
  byUser(idUsuario) {
    return request(`/ventas/${idUsuario}`);
  },
  create({ idUsuario, total, metodoPago, idCupon }) {
    return request(`/ventas`, { method: "POST", query: { idUsuario, total, metodoPago, idCupon } });
  },
  checkout({ idUsuario, total, metodoPago, codigoCupon }) {
    return request(`/ventas/checkout`, {
      method: "POST",
      query: { idUsuario, total, metodoPago, codigoCupon },
    });
  },
};

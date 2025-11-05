// src/api/sales.jsx
import { request } from "./http.jsx";

// /ventas/**
export const SalesAPI = {
  list() { return request(`/ventas`); },

  byUser(idUsuario) {
    return request(`/ventas/${idUsuario}`);
  },

  myPurchases() {                     // 👈 NUEVO ENDPOINT
    return request(`/ventas/my`, {
      method: "GET",
    });
  },

  details(idVenta) {
  return request(`/ventas/${idVenta}/details`);
  },

  create({ idUsuario, total, metodoPago, idCupon }) {
    return request(`/ventas`, {
      method: "POST",
      query: { idUsuario, total, metodoPago, idCupon },
    });
  },

  checkout({ idUsuario, total, metodoPago, codigoCupon }) {
    return request(`/ventas/checkout`, {
      method: "POST",
      query: { idUsuario, total, metodoPago, codigoCupon },
    });
  },

  confirm({ metodoPago, codigoCupon }) {
    return request(`/ventas/confirm`, {
      method: "PUT",
      query: { metodoPago, codigoCupon },
    });
  },

  cancel() {
    return request(`/ventas/cancel`, { method: "PUT" });
  },
};

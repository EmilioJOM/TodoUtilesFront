import { request, setToken, clearToken } from "./http.jsx";

// /api/v1/auth/**
export const AuthAPI = {
  async register({ firstname, lastname, email, password, role = "USER" }) {
    const r = await request("/api/v1/auth/register", {
      method: "POST",
      data: { firstname, lastname, email, password, role },
    });
    if (r?.access_token) setToken(r.access_token);
    return r;
  },
  async login({ email, password }) {
    const r = await request("/api/v1/auth/authenticate", {
      method: "POST",
      data: { email, password },
    });
    if (r?.access_token) setToken(r.access_token);
    return r;
  },
  logout() {
    clearToken();
  },
};

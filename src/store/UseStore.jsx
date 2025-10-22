import { create } from "zustand";
import { AuthAPI } from "../api/index.jsx";
import { getToken } from "../api/http.jsx";

// Decodifica el JWT por si hace falta completar datos
const makeUserFromJwt = (jwt) => {
  try {
    const [, payload] = jwt.split(".");
    const data = JSON.parse(atob(payload));
    return {
      email: data.sub || null,
      name: data.sub?.split("@")[0] || "Usuario",
      // si también agregaste "role" como claim en el token, lo tomamos
      role: typeof data.role === "string" ? data.role.toUpperCase() : null,
    };
  } catch { return null; }
};

const normalizeRole = (r) =>
  typeof r === "string" ? r.toUpperCase() : null;

const useStore = create((set, get) => ({
  user: null,

  hydrate: async () => {
    const jwt = getToken();
    if (!jwt) return;
    const u = makeUserFromJwt(jwt);
    if (u) set({ user: u });
  },

  // login({ email, password }) -> usa lo que devuelve el backend y completa con JWT/form
  login: async ({ email, password }) => {
    const r = await AuthAPI.login({ email, password }); // setToken ya ocurre adentro
    const fromJwt = r?.access_token ? makeUserFromJwt(r.access_token) : null;
    const user = {
      // preferí los campos que te manda el backend
      name: r?.firstName || fromJwt?.name || email.split("@")[0] || "Usuario",
      email: fromJwt?.email || email,
      role: normalizeRole(r?.role) || fromJwt?.role || null,
    };
    set({ user });
    return user;
  },

  // register(form) -> idem login
  register: async ({ firstname, lastname, email, password, role = "USER" }) => {
    const r = await AuthAPI.register({ firstname, lastname, email, password, role }); // setToken ya ocurre
    const fromJwt = r?.access_token ? makeUserFromJwt(r.access_token) : null;
    const user = {
      name: r?.firstName || firstname || fromJwt?.name || "Usuario",
      email: fromJwt?.email || email,
      role: normalizeRole(r?.role) || fromJwt?.role || null,
    };
    set({ user });
    return user;
  },

  logout: () => {
    // borra token y usuario
    AuthAPI.logout();
    set({ user: null });
  },

  isAdmin: () => get().user?.role === "ADMIN",
}));

export default useStore;

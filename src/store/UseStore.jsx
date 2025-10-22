import { create } from "zustand";
import { AuthAPI } from "../api/index.jsx";
import { getToken } from "../api/http.jsx";
import { CartAPI } from "../api/cart.jsx";

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

  // --- 🛒 sincronización con backend ---
  loadCart: async () => {
    try {
      const cart = await CartAPI.getOrCreate();
      const products = await CartAPI.listProducts();

      const subtotal = (products || []).reduce(
        (acc, p) => acc + (p.price || 0) * (p.quantity || 0),
        0
      );

      set({
        items: products || [],
        subtotal,
        total: subtotal, // o podés sumar envío, impuestos, etc.
        discount: 0,
        coupon: "",
      });
    } catch (err) {
      console.error("Error cargando carrito:", err);
    }
  },

  addToCart: async (productId, quantity = 1) => {
    await CartAPI.add(productId, quantity);
    await get().loadCart();
  },

  updateCartItem: async (productId, quantity) => {
    await CartAPI.update(productId, quantity);
    await get().loadCart();
  },

  removeFromCart: async (productId) => {
    await CartAPI.remove(productId);
    await get().loadCart();
  },

  purchaseCart: async () => {
    await CartAPI.purchase();
    await get().loadCart(); // crea un carrito nuevo vacío
  },

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

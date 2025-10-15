// Barrel export para importar todo desde 'src/api'
export * from "./http.jsx";
export * from "./auth.jsx";
export * from "./products.jsx";
export * from "./categories.jsx";
export * from "./searches.jsx";
export * from "./cart.jsx";
export * from "./coupons.jsx";
export * from "./sales.jsx";

// Hook opcional
export function useApi() {
  // importaciones lazy para tree-shaking en bundlers modernos
  return {
    // http
    getToken: (await import("./http.jsx")).getToken,
    setToken: (await import("./http.jsx")).setToken,
    clearToken: (await import("./http.jsx")).clearToken,
    // dominios
    AuthAPI: (await import("./auth.jsx")).AuthAPI,
    ProductsAPI: (await import("./products.jsx")).ProductsAPI,
    CategoriesAPI: (await import("./categories.jsx")).CategoriesAPI,
    SearchAPI: (await import("./searches.jsx")).SearchAPI,
    CartAPI: (await import("./cart.jsx")).CartAPI,
    CouponsAPI: (await import("./coupons.jsx")).CouponsAPI,
    SalesAPI: (await import("./sales.jsx")).SalesAPI,
  };
}

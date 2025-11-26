// src/App.jsx
import React, { useEffect, useState } from "react";
import { appBg } from "./utils/styles.jsx";
import Nav from "./components/Nav.jsx";
import Footer from "./components/Footer.jsx";
import Home from "./pages/Home.jsx";
import Search from "./pages/Search.jsx";
import Product from "./pages/Product.jsx";
import Cart from "./pages/Cart.jsx";
import Shipping from "./pages/Shipping.jsx";
import Payment from "./pages/Payment.jsx";
import About from "./pages/About.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import { useHashRoute } from "./utils/Router.jsx";
import AdminCreate from "./pages/AdminCreate.jsx";
import Sales from "./pages/Sales.jsx";
import Coupons from "./pages/Coupons.jsx";
import Purchases from "./pages/Purchases.jsx";
import "./App.css";

// Redux
import { useDispatch, useSelector } from "react-redux";
import { hydrateAuthFromStorage } from "./redux/authSlice";
import { fetchCart, fetchCartProducts } from "./redux/cartSlice";

export default function App() {
  const route = useHashRoute();

  const dispatch = useDispatch();
  const user = useSelector((s) => s.auth.user);

  const [navQuery, setNavQuery] = useState("");

  // Ahora sólo usamos Redux para saber si es admin
  const isAdmin =
    user?.role === "ADMIN" ||
    user?.role === "ROLE_ADMIN";

  useEffect(() => {
    dispatch(hydrateAuthFromStorage());
    dispatch(fetchCart());
    dispatch(fetchCartProducts());
  }, [dispatch]);

  const page = (() => {
    // Home
    if (!route.path) return <Home />;

    switch (route.path) {
      case "admin":
        if (!isAdmin)
          return <div style={{ padding: 24 }}>No autorizado.</div>;
        if (route.rest[0] === "new") return <AdminCreate />;
        if (route.rest[0] === "sales") return <Sales />;
        if (route.rest[0] === "coupons") return <Coupons />;
        return <div style={{ padding: 24 }}>Panel no encontrado.</div>;

      case "search":
        return <Search queryFromNav={navQuery} />;

      case "product":
        // Product usa sólo el id
        return <Product id={route.rest[0]} />;

      case "cart":
        return <Cart />;

      case "shipping":
        return <Shipping />;

      case "payment":
        return <Payment />;

      case "about":
        return <About />;

      case "login":
        return <Login />;

      case "register":
        return <Register />;

      case "purchases":
        return <Purchases />;

      default:
        return <div style={{ padding: 24 }}>Página no encontrada.</div>;
    }
  })();

  return (
    <div style={appBg}>
      <Nav onSearch={(v) => setNavQuery(v)} q={navQuery} />
      <div style={{ paddingTop: 64 }}>
        {page}
        <Footer />
      </div>
    </div>
  );
}

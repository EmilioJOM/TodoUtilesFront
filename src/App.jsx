import React, { useEffect, useState } from "react";
import { palette, appBg } from "./utils/styles.jsx";
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
import useStore from "./store/UseStore.jsx";
import AdminCreate from "./pages/AdminCreate.jsx";
import Sales from "./pages/Sales.jsx";
import Coupons from "./pages/Coupons.jsx";





export default function App() {
const route = useHashRoute();
const store = useStore();
useEffect(() => { store.hydrate(); }, []);
const [navQuery, setNavQuery] = useState("");


const page = (() => {
if (!route.path) return <Home store={store} />;
switch (route.path) {
case "admin":
if (!store.isAdmin()) return <div style={{ padding: 24 }}>No autorizado.</div>;
if (route.rest[0] === "new") return <AdminCreate />;
if (route.rest[0] === "sales") return <Sales />;
if (route.rest[0] === "coupons") return <Coupons />;
return <div style={{ padding: 24 }}>Panel no encontrado.</div>;

case "search":
return <Search store={store} queryFromNav={navQuery} />;
case "product":
return <Product store={store} id={route.rest[0]} />;
case "cart":
return <Cart store={store} />;
case "shipping":
return <Shipping store={store} />;
case "payment":
return <Payment store={store} />;
case "about":
return <About />;
case "login":    
return <Login />;
case "register": 
return <Register />;
default:
return <div style={{ padding: 24 }}>Página no encontrada.</div>;
}
})();


return (
<div style={appBg}>
<Nav onSearch={(v) => setNavQuery(v)} q={navQuery} />
{page}
<Footer />
</div>
);
}
// src/redux/store.js
import { configureStore } from "@reduxjs/toolkit";
import productsReducer from "./productSlice";
import categoriesReducer from "./categorySlice";
import cartReducer from "./cartSlice";
import authReducer from "./authSlice";
import couponsReducer from "./couponsSlice";
import salesReducer from "./salesSlice";

export const store = configureStore({
  reducer: {
    products: productsReducer,
    categories: categoriesReducer,
    cart: cartReducer,
    auth: authReducer,
    coupons: couponsReducer,
    sales: salesReducer,
  },
});

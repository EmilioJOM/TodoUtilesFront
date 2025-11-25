import { configureStore } from "@reduxjs/toolkit";
import productReducer from './productSlice'
import categoryReducer from './categorySlice'
import cartReducer from "./cartSlice";

export const store = configureStore({
    reducer: {products:productReducer , categories:categoryReducer, cart: cartReducer,} //aca se guardan todos los estados globales

})
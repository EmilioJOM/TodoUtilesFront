import { configureStore } from "@reduxjs/toolkit";
import productReducer from './productSlice'
import categoryReducer from './categorySlice'
import cartReducer from "./cartSlice";
import authReducer from "./authSlice";
import checkoutReducer from "./checkoutSlice";
import couponsReducer from "./couponsSlice";


export const store = configureStore({
    reducer: {
        products:productReducer , 
        categories:categoryReducer, 
        cart: cartReducer,
        auth: authReducer,
        coupons: couponsReducer,
        checkout: checkoutReducer,       
    } //aca se guardan todos los estados globales

})
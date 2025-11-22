import { configureStore } from "@reduxjs/toolkit";
import productReducer from './productSlice'

export const store = configureStore({
    reducer: {products:productReducer} //aca se guardan todos los estados globales

})
import { createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'
import { createSlice } from '@reduxjs/toolkit'

const URL="http://localhost:4002/api/productos"

export const fetchProducts =createAsyncThunk('productos/fetchProducts',async()=>{
    const {data}= await axios.get(URL) //espero a que la api me de una respuesta
    return data

})
//recibe un objeto de configuracion
const productSlice=createSlice({
    name: 'products',
    initialState:{
        items: [],
        loading: false,
        error: null
    },
    reducers:{}, //operaciones sincronas que no necesitan ingresar al back pero necesito que persistan en el estado global. ej: filtrar desde frontend
    extraReducers: (builder)=>{ //logica de las operaciones asincronas - que si ingresan a base de datos
        builder
        .addCase(fetchProducts.pending, (state)=>{
            state.loading = true,
            state.error = null
        })
        .addCase(fetchProducts.fulfilled, (state,action)=>{
            state.loading = false,
            state.items = action.payload //payload es la respuesta de la base de datos
        })
        .addCase(fetchProducts.rejected, (state,action)=>{
            state.loading = false,
            state.error=action.error.message
        })
    }

})

export default productSlice.reducer
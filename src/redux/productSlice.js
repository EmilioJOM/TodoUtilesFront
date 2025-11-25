import { createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'
import { createSlice } from '@reduxjs/toolkit'

const URL="http://localhost:4002/api/productos"

export const fetchAllProducts =createAsyncThunk('productos/fetchProducts',async()=>{
    const {data}= await axios.get(URL) //espero a que la api me de una respuesta
    return data
})

export const createProduct =createAsyncThunk('productos/createProduct',async(newProduct)=>{
    const token =localStorage.getItem("tu_jwt")
    const{data}=await axios.post(URL, newProduct,{
        headers:{
            Authorization: `Bearer ${token}`
        }
    })
return data
})

//recibe un objeto de configuracion
const productSlice=createSlice({
    name: 'products',
    initialState:{
        items: [],
        loading: false,
        error: null,
        loadingNewProduct: false,
        errorNewProduct: null
    },
    reducers:{}, //operaciones sincronas que no necesitan ingresar al back pero necesito que persistan en el estado global. ej: filtrar desde frontend
    extraReducers: (builder)=>{ //logica de las operaciones asincronas - que si ingresan a base de datos
        builder
        .addCase(fetchAllProducts.pending, (state)=>{
            state.loading = true,
            state.error = null
        })
        .addCase(fetchAllProducts.fulfilled, (state,action)=>{
            state.loading = false,
            state.items = action.payload //payload es la respuesta de la base de datos
        })
        .addCase(fetchAllProducts.rejected, (state,action)=>{
            state.loading = false,
            state.error=action.error.message
        })
        .addCase(createProduct.fulfilled, (state,action)=>{
            state.loadingNewProduct =false,
            state.items=[...state.items, action.payload]
            alert("Producto creado correctamente ✅")
        })
        .addCase(createProduct.pending, (state)=>{
            state.loadingNewProduct=true,
            state.errorNewProduct=null
        })
        .addCase(createProduct.rejected, (state,action)=>{
            state.loadingNewProduct=false,
            state.errorNewProduct=action.error.message
            alert(action.error.message|| "No se pudo crear el producto");
        })

    }

})

export default productSlice.reducer
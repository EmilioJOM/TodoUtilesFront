import { createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'
import { createSlice } from '@reduxjs/toolkit'

const URL='http://localhost:4002/categories'

export const fetchCategories= createAsyncThunk('categories/fetchCategories', async()=>{
    const {data}= await axios.get(URL)
    return data.content
})

export const createCategory = createAsyncThunk("categories/createCategory", async (newCategory) => {
      const token = localStorage.getItem("tu_jwt");
      const { data } = await axios.post(URL, newCategory, {
          headers: {
            Authorization: `Bearer ${token}` //aca se manda el token
          }
        }
      );
      return data;
  }
);


const categorySlice=createSlice({
    name: 'categories',
    initialState:{
        items:[],
        loading: false,
        error: null,
        loadingCreate: false,
        errorCreate: false,
        filterCategory: "" //categoria con la que estoy filtrando en el momento
    },
    reducers: { //operaciones sincronas - no ingreso al back
        setFilterCategory: (state,action)=>{
            state.filterCategory = action.payload
        }
    }, 
    extraReducers: (builder)=>{ //operaciones asincronas
        builder
        .addCase(fetchCategories.pending,(state)=>{
            state.loading = true,
            state.error = null
        })
        .addCase(fetchCategories.fulfilled, (state,action)=>{
            state.loading= false,
            state.items= action.payload
        })
        .addCase(fetchCategories.rejected, (state,action)=>{
            state.loading = false,
            state.error=action.error.message
        })
        .addCase(createCategory.fulfilled, (state, action) => {
            state.loadingCreate=false,
            state.items = [...state.items, action.payload]
            alert("Categoría creada ✅");
        })
        .addCase(createCategory.pending,(state) =>{
            state.loadingCreate=true,
            state.errorCreate =null
        })
        .addCase(createCategory.rejected,(state,action) =>{
            state.loadingCreate=false,
            state.errorCreate=action.error.message
            alert(errorCreate || "No se pudo crear la categoría");
        })

    }
})

export const {setFilterCategory} = categorySlice.actions
export default categorySlice.reducer
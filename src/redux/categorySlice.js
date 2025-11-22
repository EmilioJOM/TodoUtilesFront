import { createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'
import { createSlice } from '@reduxjs/toolkit'

const URL='http://localhost:4002/categories'

export const fetchCategories= createAsyncThunk('categories/fetchCategories', async()=>{
    const {data}= await axios.get(URL)
    return data.content
})

const categorySlice=createSlice({
    name: 'categories',
    initialState:{
        items:[],
        loading: false,
        error: null,
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

    }
})

export const {setFilterCategory} = categorySlice.actions
export default categorySlice.reducer
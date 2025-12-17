import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { CouponsAPI } from "../api/index.jsx";

// Admin: listar cupones
export const fetchCoupons = createAsyncThunk(
  "coupons/fetchAll",
  async () => {
    return await CouponsAPI.list();
  }
);

// Admin: crear cupón
export const createCoupon = createAsyncThunk(
  "coupons/create",
  async (payload) => {
    return await CouponsAPI.create(payload);
  }
);

// Admin: borrar cupón
export const deleteCoupon = createAsyncThunk(
  "coupons/delete",
  async (idCupon) => {
    await CouponsAPI.remove(idCupon);
    return idCupon;
  }
);

const couponsSlice = createSlice({
  name: "coupons",
  initialState: {
    items: [],
    status: "idle",
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCoupons.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchCoupons.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.items = action.payload;
      })
      .addCase(fetchCoupons.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })

      .addCase(createCoupon.fulfilled, (state, action) => {
        state.items.push(action.payload);
      })

      .addCase(deleteCoupon.fulfilled, (state, action) => {
        state.items = state.items.filter(c => c.idCupon !== action.payload);
      });
  },
});

export const selectCoupons = (state) => state.coupons.items;
export const selectCouponsStatus = (state) => state.coupons.status;

export default couponsSlice.reducer;

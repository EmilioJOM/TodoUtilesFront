// src/redux/couponsSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { CouponsAPI } from "../api"; // o "../api/index.jsx" si tu config no resuelve el barrel

const initialState = {
  items: [],          // lista de cupones
  loading: false,     // cualquier operación en progreso
  error: null,        // último error
  currentCoupon: null // cupón validado/aplicado (para Payment)
};

// Listar cupones
export const fetchCoupons = createAsyncThunk(
  "coupons/fetchCoupons",
  async () => {
    const data = await CouponsAPI.list();
    return data;
  }
);

// Crear cupón
export const createCoupon = createAsyncThunk(
  "coupons/createCoupon",
  async (couponBody) => {
    // NO hay lógica acá: solo llamada a API y luego refrescar lista
    await CouponsAPI.create(couponBody);
    const data = await CouponsAPI.list();
    return data;
  }
);

// Eliminar cupón
export const deleteCoupon = createAsyncThunk(
  "coupons/deleteCoupon",
  async (idCupon) => {
    await CouponsAPI.remove(idCupon);
    const data = await CouponsAPI.list();
    return data;
  }
);

// Validar cupón por código (para la pantalla de pago)
export const validateCoupon = createAsyncThunk(
  "coupons/validateCoupon",
  async (codigo) => {
    const data = await CouponsAPI.getByCode(codigo);
    return data;
  }
);

const couponsSlice = createSlice({
  name: "coupons",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // ───── fetchCoupons ─────
      .addCase(fetchCoupons.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCoupons.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload || [];
      })
      .addCase(fetchCoupons.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.error.message || "No se pudieron cargar los cupones";
      })

      // ───── createCoupon ─────
      .addCase(createCoupon.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createCoupon.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload || [];
      })
      .addCase(createCoupon.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "No se pudo crear el cupón";
      })

      // ───── deleteCoupon ─────
      .addCase(deleteCoupon.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteCoupon.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload || [];
      })
      .addCase(deleteCoupon.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "No se pudo eliminar el cupón";
      })

      // ───── validateCoupon ─────
      .addCase(validateCoupon.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.currentCoupon = null;
      })
      .addCase(validateCoupon.fulfilled, (state, action) => {
        state.loading = false;
        state.currentCoupon = action.payload;
      })
      .addCase(validateCoupon.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Cupón inválido";
        state.currentCoupon = null;
      });
  },
});

export default couponsSlice.reducer;

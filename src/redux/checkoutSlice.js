import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { CouponsAPI } from "../api/index.jsx";

export const fetchCoupons = createAsyncThunk("coupons/fetchCoupons", async () => {
  const data = await CouponsAPI.list(); // GET /cupones
  return data || [];
});

export const createCoupon = createAsyncThunk(
  "coupons/createCoupon",
  async ({ cupon, descuento, tipo, validez }, { rejectWithValue }) => {
    try {
      const body = {
        cupon: (cupon || "").trim().toUpperCase(),
        descuento: parseInt(descuento || "0", 10),
        tipo, // "porcentaje" | "monto" (según tu UI/backend actual)
        validez: validez ? `${validez}:00` : null, // LocalDateTime
      };
      const created = await CouponsAPI.create(body); // POST /cupones
      return created || body; // por si el backend no devuelve el objeto creado
    } catch (e) {
      return rejectWithValue(e?.message || "No se pudo crear el cupón");
    }
  }
);

export const deleteCoupon = createAsyncThunk(
  "coupons/deleteCoupon",
  async (idCupon, { rejectWithValue }) => {
    try {
      await CouponsAPI.remove(idCupon); // DELETE /cupones/{id}
      return idCupon;
    } catch (e) {
      return rejectWithValue(e?.message || "No se pudo eliminar");
    }
  }
);

const couponsSlice = createSlice({
  name: "coupons",
  initialState: {
    items: [],
    status: "idle",
    error: null,
    saving: false,
  },
  reducers: {
    clearCouponsError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // fetch
      .addCase(fetchCoupons.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchCoupons.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.items = action.payload;
      })
      .addCase(fetchCoupons.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })

      // create
      .addCase(createCoupon.pending, (state) => {
        state.saving = true;
        state.error = null;
      })
      .addCase(createCoupon.fulfilled, (state, action) => {
        state.saving = false;
        // preferimos refrescar con fetchCoupons, pero esto ayuda al UX si el backend devuelve el creado
        state.items = [action.payload, ...state.items];
      })
      .addCase(createCoupon.rejected, (state, action) => {
        state.saving = false;
        state.error = action.payload || "No se pudo crear el cupón";
      })

      // delete
      .addCase(deleteCoupon.fulfilled, (state, action) => {
        state.items = state.items.filter((c) => c.idCupon !== action.payload);
      })
      .addCase(deleteCoupon.rejected, (state, action) => {
        state.error = action.payload || "No se pudo eliminar";
      });
  },
});

export const { clearCouponsError } = couponsSlice.actions;

export const selectCoupons = (state) => state.coupons.items;
export const selectCouponsStatus = (state) => state.coupons.status;
export const selectCouponsSaving = (state) => state.coupons.saving;
export const selectCouponsError = (state) => state.coupons.error;

export default couponsSlice.reducer;

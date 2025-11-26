// src/redux/salesSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { SalesAPI } from "../api/sales.jsx";

const initialState = {
  items: [],        // lista de ventas (admin)
  myPurchases: [],  // "mis compras"
  details: null,    // detalle de una venta

  loadingList: false,
  loadingMy: false,
  loadingDetails: false,

  errorList: null,
  errorMy: null,
  errorDetails: null,

  // para checkout / confirm / cancel
  loadingCheckout: false,
  loadingConfirm: false,
  loadingCancel: false,

  errorCheckout: null,
  errorConfirm: null,
  errorCancel: null,
};

// ─────────────────────────────────────
// Todas las ventas (admin)
export const fetchSales = createAsyncThunk("sales/fetchSales", async () => {
  const data = await SalesAPI.list();
  return data;
});

// Mis compras (usuario logueado)
export const fetchMyPurchases = createAsyncThunk(
  "sales/fetchMyPurchases",
  async () => {
    const data = await SalesAPI.myPurchases();
    return data;
  }
);

// Detalle de una venta
export const fetchSaleDetails = createAsyncThunk(
  "sales/fetchSaleDetails",
  async (idVenta) => {
    const data = await SalesAPI.details(idVenta);
    return data;
  }
);

// Checkout: crea venta pendiente
export const checkoutSale = createAsyncThunk(
  "sales/checkoutSale",
  async ({ idUsuario, total, metodoPago, codigoCupon }, { rejectWithValue }) => {
    try {
      const data = await SalesAPI.checkout({
        idUsuario,
        total,
        metodoPago,
        codigoCupon,
      });
      return data;
    } catch (err) {
      const msg = err?.message || "Error al iniciar el pago";
      return rejectWithValue(msg);
    }
  }
);

// Confirmar pago
export const confirmSale = createAsyncThunk(
  "sales/confirmSale",
  async ({ metodoPago, codigoCupon }, { rejectWithValue }) => {
    try {
      const data = await SalesAPI.confirm({
        metodoPago,
        codigoCupon,
      });
      return data;
    } catch (err) {
      const msg = err?.message || "Error al confirmar el pago";
      return rejectWithValue(msg);
    }
  }
);

// Cancelar venta pendiente
export const cancelSale = createAsyncThunk(
  "sales/cancelSale",
  async (_, { rejectWithValue }) => {
    try {
      await SalesAPI.cancel();
      return null;
    } catch (err) {
      const msg = err?.message || "Error al cancelar la venta";
      return rejectWithValue(msg);
    }
  }
);

// ─────────────────────────────────────

const salesSlice = createSlice({
  name: "sales",
  initialState,
  reducers: {
    clearDetails(state) {
      state.details = null;
      state.loadingDetails = false;
      state.errorDetails = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // fetchSales
      .addCase(fetchSales.pending, (state) => {
        state.loadingList = true;
        state.errorList = null;
      })
      .addCase(fetchSales.fulfilled, (state, action) => {
        state.loadingList = false;
        state.items = action.payload || [];
      })
      .addCase(fetchSales.rejected, (state, action) => {
        state.loadingList = false;
        state.errorList =
          action.error.message || "No se pudieron cargar las ventas";
      })

      // fetchMyPurchases
      .addCase(fetchMyPurchases.pending, (state) => {
        state.loadingMy = true;
        state.errorMy = null;
      })
      .addCase(fetchMyPurchases.fulfilled, (state, action) => {
        state.loadingMy = false;
        state.myPurchases = action.payload || [];
      })
      .addCase(fetchMyPurchases.rejected, (state, action) => {
        state.loadingMy = false;
        state.errorMy =
          action.error.message || "No se pudieron cargar tus compras";
      })

      // fetchSaleDetails
      .addCase(fetchSaleDetails.pending, (state) => {
        state.loadingDetails = true;
        state.errorDetails = null;
        state.details = null;
      })
      .addCase(fetchSaleDetails.fulfilled, (state, action) => {
        state.loadingDetails = false;
        state.details = action.payload || null;
      })
      .addCase(fetchSaleDetails.rejected, (state, action) => {
        state.loadingDetails = false;
        state.errorDetails =
          action.error.message || "No se pudo cargar el detalle de la venta";
        state.details = null;
      })

      // checkoutSale
      .addCase(checkoutSale.pending, (state) => {
        state.loadingCheckout = true;
        state.errorCheckout = null;
      })
      .addCase(checkoutSale.fulfilled, (state) => {
        state.loadingCheckout = false;
      })
      .addCase(checkoutSale.rejected, (state, action) => {
        state.loadingCheckout = false;
        state.errorCheckout =
          action.payload || "Error al iniciar el pago";
      })

      // confirmSale
      .addCase(confirmSale.pending, (state) => {
        state.loadingConfirm = true;
        state.errorConfirm = null;
      })
      .addCase(confirmSale.fulfilled, (state) => {
        state.loadingConfirm = false;
      })
      .addCase(confirmSale.rejected, (state, action) => {
        state.loadingConfirm = false;
        state.errorConfirm =
          action.payload || "Error al confirmar el pago";
      })

      // cancelSale
      .addCase(cancelSale.pending, (state) => {
        state.loadingCancel = true;
        state.errorCancel = null;
      })
      .addCase(cancelSale.fulfilled, (state) => {
        state.loadingCancel = false;
      })
      .addCase(cancelSale.rejected, (state, action) => {
        state.loadingCancel = false;
        state.errorCancel =
          action.payload || "Error al cancelar la venta";
      });
  },
});

export const { clearDetails } = salesSlice.actions;
export default salesSlice.reducer;

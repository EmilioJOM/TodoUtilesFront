import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { request } from "../api/http.jsx";   

//---------------------------------------
// THUNKS
//---------------------------------------

export const fetchCart = createAsyncThunk("cart/fetchCart", async () => {
  const data = await request("/carts/cart");
  return data;
});

export const fetchCartProducts = createAsyncThunk(
  "cart/fetchCartProducts",
  async () => {
    const data = await request("/carts/products");
    return data || [];
  }
);

export const addProductToCart = createAsyncThunk(
  "cart/addProductToCart",
  async ({ productId, quantity }) => {
    const data = await request(`/carts/add/${productId}`, {
      method: "POST",
      query: { quantity },
    });
    return { productId, quantity, message: data };
  }
);

export const updateProductQuantity = createAsyncThunk(
  "cart/updateProductQuantity",
  async ({ productId, quantity }) => {
    const data = await request(`/carts/update/${productId}`, {
      method: "PUT",
      query: { quantity },
    });
    return { productId, quantity, message: data };
  }
);

export const removeProductFromCart = createAsyncThunk(
  "cart/removeProductFromCart",
  async (productId) => {
    const data = await request(`/carts/remove/${productId}`, {
      method: "DELETE",
    });
    return productId;
  }
);

export const purchaseCart = createAsyncThunk("cart/purchaseCart", async () => {
  const data = await request(`/carts/purchase`, { method: "POST" });
  return data;
});

//---------------------------------------
// SLICE
//---------------------------------------

const initialState = {
  cartId: null,
  items: [],
  subtotal: 0,
  total: 0,
  loading: false,
  error: null,
};

// 📌 NUEVO: función para recalcular totals
const recalcTotals = (state) => {
  state.subtotal = state.items.reduce(
    (acc, p) => acc + p.price * p.quantity,
    0
  );
  state.total = state.subtotal;
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {},

  extraReducers: (builder) => {
    builder

      //---------------------------------------
      // GET CART
      //---------------------------------------
      .addCase(fetchCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.loading = false;
        state.cartId = action.payload.cartId;
        state.subtotal = action.payload.subtotal || 0;
        state.total = action.payload.subtotal || 0;
      })
      .addCase(fetchCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      //---------------------------------------
      // LIST PRODUCTS
      //---------------------------------------
      .addCase(fetchCartProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCartProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
        recalcTotals(state);
      })
      .addCase(fetchCartProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      //---------------------------------------
      // ADD PRODUCT
      //---------------------------------------
      .addCase(addProductToCart.fulfilled, (state, action) => {
        const { productId, quantity } = action.meta.arg;
        const existing = state.items.find((i) => i.productId === productId);

        if (existing) {
          existing.quantity += quantity;
        }
        recalcTotals(state);
      })

      //---------------------------------------
      // UPDATE QUANTITY
      //---------------------------------------
      .addCase(updateProductQuantity.fulfilled, (state, action) => {
        const { productId, quantity } = action.meta.arg;
        const item = state.items.find((i) => i.productId === productId);
        if (item) item.quantity = quantity;
        recalcTotals(state);
      })

      //---------------------------------------
      // REMOVE PRODUCT
      //---------------------------------------
      .addCase(removeProductFromCart.fulfilled, (state, action) => {
        state.items = state.items.filter(
          (i) => i.productId !== action.payload
        );
        recalcTotals(state);
      })

      //---------------------------------------
      // PURCHASE
      //---------------------------------------
      .addCase(purchaseCart.fulfilled, (state) => {
        state.items = [];
        state.subtotal = 0;
        state.total = 0;
      });
  },
});

export default cartSlice.reducer;
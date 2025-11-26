import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { request } from "../api/http.jsx";   
import { CartAPI } from "../api/cart.jsx"; 

//---------------------------------------
// THUNKS
//---------------------------------------

export const fetchCart = createAsyncThunk(
  "cart/fetchCart",
  async (_, { rejectWithValue }) => {
    try {
      const cart = await CartAPI.getOrCreate();
      const products = await CartAPI.listProducts();
      return { cart, products };
    } catch (err) {
      if (err.status === 401 || err.status === 403) {
        // usuario no logueado → no es un error fatal, volvemos carrito vacío
        return rejectWithValue({ code: err.status, silent: true });
      }
      return rejectWithValue({ message: err.message || "Error cargando carrito" });
    }
  }
);


export const fetchCartProducts = createAsyncThunk(
  "cart/fetchCartProducts",
  async () => {
    const data = await request("/carts/products");
    return data || [];
  }
);

export const addProductToCart = createAsyncThunk(
  "cart/addProductToCart",
  async ({ productId, quantity = 1 }, { dispatch, rejectWithValue }) => {
    try {
      // Llama al backend para agregar el producto
      await CartAPI.add(productId, quantity);
      // Después de agregar, recargamos los productos del carrito
      await dispatch(fetchCartProducts());
      return;
    } catch (err) {
      console.error("Error agregando al carrito", err);
      return rejectWithValue(
        err?.message || "Error al agregar producto al carrito"
      );
    }
  }
);


export const addToCart = createAsyncThunk(
  "cart/addToCart",
  async ({ productId, quantity }, { rejectWithValue }) => {
    try {
      const res = await CartAPI.add(productId, quantity);
      return res;
    } catch (err) {
      return rejectWithValue(err.message || "No se pudo agregar al carrito");
    }
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


      // GET CARIT
      .addCase(fetchCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.loading = false;
        const { cart, products } = action.payload;
        state.cartId = cart.id ?? cart.cartId ?? null;
        state.items = products ?? [];
        recalcTotals(state);
      })
      .addCase(fetchCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      // LISTA DE PRODUCTOS
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

      //ACTUALIZAR CANTIDAD
      .addCase(updateProductQuantity.fulfilled, (state, action) => {
        const { productId, quantity } = action.meta.arg;
        const item = state.items.find((i) => i.productId === productId);
        if (item) item.quantity = quantity;
        recalcTotals(state);
      })

      //ELIMINAR DEL CARRITO
      .addCase(removeProductFromCart.fulfilled, (state, action) => {
        state.items = state.items.filter(
          (i) => i.productId !== action.payload
        );
        recalcTotals(state);
      })

      //
      .addCase(purchaseCart.fulfilled, (state) => {
        state.items = [];
        state.subtotal = 0;
        state.total = 0;
      })
      .addCase(addProductToCart.pending, (state) => {
        state.loading = true;
      })
      .addCase(addProductToCart.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(addProductToCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "No se pudo agregar al carrito";
      });
  },
});

export default cartSlice.reducer;
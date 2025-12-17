import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { ProductsAPI } from "../api/products.jsx";

/* ===========================
   THUNKS
=========================== */

// Subir imagen
export const uploadProductImage = createAsyncThunk(
  "imagen/upload",
  async ({ productId, file }, { rejectWithValue }) => {
    try {
      await ProductsAPI.uploadImage({ id: productId, file });
      return { productId };
    } catch (e) {
      return rejectWithValue(e.message || "Error al subir la imagen");
    }
  }
);

// Obtener imagen
export const fetchProductImage = createAsyncThunk(
  "imagen/fetch",
  async ({ productId }, { rejectWithValue }) => {
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL || "http://localhost:4002"}/api/productos/${productId}/imagen`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("tu_jwt")}`,
          },
        }
      );

      // 👉 NO tiene imagen
      if (res.status === 404) {
        return {
          productId,
          imageUrl: null,
        };
      }

      if (!res.ok) throw new Error("Error al obtener imagen");

      const blob = await res.blob();

      return {
        productId,
        imageUrl: URL.createObjectURL(blob),
      };
    } catch {
      return {
        productId,
        imageUrl: null,
      };
    }
  }
);


/* ===========================
   SLICE
=========================== */

const imagenSlice = createSlice({
  name: "imagen",
  initialState: {
    imagesByProduct: {}, // { [productId]: imageUrl }
    loading: false,
    error: null,
  },
  reducers: {
    clearImage(state, action) {
      const id = action.payload;
      if (state.imagesByProduct[id]) {
        URL.revokeObjectURL(state.imagesByProduct[id]);
        delete state.imagesByProduct[id];
      }
    },
  },
  extraReducers: (builder) => {
    builder
      // subir
      .addCase(uploadProductImage.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(uploadProductImage.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(uploadProductImage.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // obtener
      .addCase(fetchProductImage.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProductImage.fulfilled, (state, action) => {
        state.loading = false;
        state.imagesByProduct[action.payload.productId] =
          action.payload.imageUrl;
      })
      .addCase(fetchProductImage.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearImage } = imagenSlice.actions;

export default imagenSlice.reducer;

/* ===========================
   SELECTORS
=========================== */

export const selectImageByProduct =
  (productId) => (state) =>
    state.imagen.imagesByProduct[productId];

export const selectImageLoading = (state) => state.imagen.loading;
export const selectImageError = (state) => state.imagen.error;

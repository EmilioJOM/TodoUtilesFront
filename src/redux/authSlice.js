import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { AuthAPI } from "../api/index.jsx";

const initialState = {
  user: null,
  status: "idle",      // idle | loading | succeeded | failed
  error: null,
};

export const hydrateAuth = createAsyncThunk(
  "auth/hydrate",
  async (_, { rejectWithValue }) => {
    try {
      // debe devolver user si hay token válido, o null si no
      const user = await AuthAPI.hydrate(); 
      return user ?? null;
    } catch (err) {
      return rejectWithValue(err?.message || "Error hidratando sesión");
    }
  }
);

export const login = createAsyncThunk(
  "auth/login",
  async (credentials, { rejectWithValue }) => {
    try {
      // debería setear token internamente (AuthAPI) y devolver user
      const user = await AuthAPI.login(credentials);
      return user;
    } catch (err) {
      return rejectWithValue(err?.message || "Login falló");
    }
  }
);

export const register = createAsyncThunk(
  "auth/register",
  async (payload, { rejectWithValue }) => {
    try {
      const user = await AuthAPI.register(payload);
      return user;
    } catch (err) {
      return rejectWithValue(err?.message || "Registro falló");
    }
  }
);

export const logout = createAsyncThunk(
  "auth/logout",
  async (_, { rejectWithValue }) => {
    try {
      await AuthAPI.logout(); // debería clearToken internamente
      return null;
    } catch (err) {
      return rejectWithValue(err?.message || "Logout falló");
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    clearAuthError(state) {
      state.error = null;
    },
    // útil si más tarde querés setear user desde otro flujo
    setUser(state, action) {
      state.user = action.payload ?? null;
    },
  },
  extraReducers: (builder) => {
    builder
      // hydrate
      .addCase(hydrateAuth.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(hydrateAuth.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.user = action.payload;
      })
      .addCase(hydrateAuth.rejected, (state, action) => {
        state.status = "failed";
        state.user = null;
        state.error = action.payload || "Error hidratando sesión";
      })

      // login
      .addCase(login.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.user = action.payload;
      })
      .addCase(login.rejected, (state, action) => {
        state.status = "failed";
        state.user = null;
        state.error = action.payload || "Login falló";
      })

      // register
      .addCase(register.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.user = action.payload;
      })
      .addCase(register.rejected, (state, action) => {
        state.status = "failed";
        state.user = null;
        state.error = action.payload || "Registro falló";
      })

      // logout
      .addCase(logout.fulfilled, (state) => {
        state.status = "idle";
        state.user = null;
        state.error = null;
      })
      .addCase(logout.rejected, (state, action) => {
        // aunque falle la request, normalmente igual conviene limpiar UI
        state.status = "idle";
        state.user = null;
        state.error = action.payload || "Logout falló";
      });
  },
});

export const { clearAuthError, setUser } = authSlice.actions;

export const selectUser = (state) => state.auth.user;
export const selectAuthStatus = (state) => state.auth.status;
export const selectAuthError = (state) => state.auth.error;
export const selectIsAdmin = (state) => state.auth.user?.role === "ADMIN";

export default authSlice.reducer;

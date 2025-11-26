// src/redux/authSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { AuthAPI } from "../api/auth";        // donde llamás al backend
import { getToken, setToken } from "../api/http"; // helpers que usan localStorage
import { makeUserFromJwt } from "../utils/jwt";   // función para decodificar el JWT

// 🔹 LOGIN
export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const res = await AuthAPI.login({ email, password });

      // Por las dudas, nos aseguramos de guardar el token
      if (res?.access_token) {
        setToken(res.access_token);
      }

      const fromJwt = res?.access_token
        ? makeUserFromJwt(res.access_token)
        : null;

      const user = {
        name: res?.firstName || fromJwt?.name || email.split("@")[0] || "Usuario",
        email: fromJwt?.email || email,
        role: res?.role || fromJwt?.role || null,
      };

      return { user };
    } catch (err) {
      return rejectWithValue(err?.message || "Error al iniciar sesión");
    }
  }
);

// 🔹 REGISTER
export const registerUser = createAsyncThunk(
  "auth/registerUser",
  async (data, { rejectWithValue }) => {
    // data suele tener { firstName, lastName, email, password } o similar
    try {
      const res = await AuthAPI.register(data);

      // Si el backend devuelve un token al registrarse, lo guardamos
      if (res?.access_token) {
        setToken(res.access_token);
      }

      const fromJwt = res?.access_token
        ? makeUserFromJwt(res.access_token)
        : null;

      const email = res?.email || data.email;

      const user = {
        name:
          res?.firstName ||
          fromJwt?.name ||
          data.firstName ||
          (email ? email.split("@")[0] : "Usuario"),
        email,
        role: res?.role || fromJwt?.role || null,
      };

      return { user };
    } catch (err) {
      return rejectWithValue(err?.message || "Error al registrarse");
    }
  }
);

// 🔹 HYDRATE desde localStorage al recargar
export const hydrateAuthFromStorage = createAsyncThunk(
  "auth/hydrateAuthFromStorage",
  async () => {
    const token = getToken();
    if (!token) return { user: null };

    const fromJwt = makeUserFromJwt(token);
    if (!fromJwt) return { user: null };

    const user = {
      name: fromJwt.name || (fromJwt.email ? fromJwt.email.split("@")[0] : "Usuario"),
      email: fromJwt.email,
      role: fromJwt.role || null,
    };

    return { user };
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: null,
    loading: false,
    error: null,
  },
  reducers: {
    logout(state) {
      state.user = null;
      setToken(""); // borrar JWT de localStorage
    },
  },
  extraReducers: (builder) => {
    builder
      // LOGIN
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Error al iniciar sesión";
      })

      // REGISTER
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Error al registrarse";
      })

      // HYDRATE
      .addCase(hydrateAuthFromStorage.fulfilled, (state, action) => {
        state.user = action.payload.user;
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;

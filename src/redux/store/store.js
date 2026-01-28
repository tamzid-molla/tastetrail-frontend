import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../api/authSlice.js";
import { authApi } from "../api/authApiSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    [authApi.reducerPath]: authApi.reducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(authApi.middleware),
});

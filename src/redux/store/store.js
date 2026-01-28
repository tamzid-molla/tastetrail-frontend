import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../api/authSlice.js";
import { authApi } from "../api/authApiSlice";
import { recipeApi } from "../api/recipeApiSlice.js";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    [authApi.reducerPath]: authApi.reducer,
    [recipeApi.reducerPath]: recipeApi.reducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(authApi.middleware, recipeApi.middleware),
});

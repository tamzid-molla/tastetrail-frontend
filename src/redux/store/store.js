import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../api/authSlice.js";
import { authApi } from "../api/authApiSlice";
import { recipeApi } from "../api/recipeApiSlice.js";
import { categoryApi } from "../api/categoryApiSlice.js";
import { reviewApi } from "../api/reviewApiSlice.js";
import { userApi } from "../api/userApiSlice.js";
import { cuisineApi } from "../api/cuisineApiSlice.js";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    [authApi.reducerPath]: authApi.reducer,
    [recipeApi.reducerPath]: recipeApi.reducer,
    [categoryApi.reducerPath]: categoryApi.reducer,
    [reviewApi.reducerPath]: reviewApi.reducer,
    [userApi.reducerPath]: userApi.reducer,
    [cuisineApi.reducerPath]: cuisineApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      authApi.middleware,
      recipeApi.middleware,
      categoryApi.middleware,
      reviewApi.middleware,
      userApi.middleware,
      cuisineApi.middleware
    ),
});

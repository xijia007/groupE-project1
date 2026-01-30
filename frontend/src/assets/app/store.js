import { configureStore } from "@reduxjs/toolkit";
import cartReducer from "../../features/cart/slices/cartSlice";
import productsReducer from "../../features/products/slices/productsSlice";

export const store = configureStore({
  reducer: {
    cart: cartReducer,
    products: productsReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore serialization checks for these action types.
        ignoredActions: ["cart/addToCart"],
      },
    }),
});

export default store;

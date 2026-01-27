import { configureStore } from "@reduxjs/toolkit";
import cartReducer from "../../features/cart/slices/cartSlice";
import productsReducer from "../../features/products/slices/productsSlice";

export const store = configureStore({
  reducer: {
    cart: cartReducer,
    products: productsReducer,
    // 未来可以在这里添加其他 reducers
    // auth: authReducer,
    // products: productsReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // 忽略这些 action types 的序列化检查
        ignoredActions: ["cart/addToCart"],
      },
    }),
});

export default store;

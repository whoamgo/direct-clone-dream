import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import otpAuthReducer from "./slices/otpAuthSlice";
import productReducer from "./slices/productSlice";
import cartReducer from "./slices/cartSlice";
import orderReducer from "./slices/orderSlice";
import prescriptionReducer from "./slices/prescriptionSlice";
import uiReducer from "./slices/uiSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    otpAuth: otpAuthReducer,
    products: productReducer,
    cart: cartReducer,
    orders: orderReducer,
    prescriptions: prescriptionReducer,
    ui: uiReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ["auth/login/fulfilled", "auth/register/fulfilled", "cart/addToCart"],
        ignoredPaths: ["cart.items"],
      },
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

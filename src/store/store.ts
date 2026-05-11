import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import productReducer from "./slices/productSlice";
import otpAuthReducer from "./slices/otpAuthSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    otpAuth: otpAuthReducer,
    products: productReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ["auth/login/fulfilled", "auth/register/fulfilled"],
      },
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

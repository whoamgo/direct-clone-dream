import { RootState } from "./store";

export const selectAuth = (state: RootState) => state.auth;
export const selectOtpAuth = (state: RootState) => state.otpAuth;
export const selectIsAuthenticated = (state: RootState) =>
  state.auth.isAuthenticated || state.otpAuth.isAuthenticated;
export const selectCurrentUser = (state: RootState) =>
  state.auth.user || state.otpAuth.user;

export const selectProducts = (state: RootState) => state.products;
export const selectProductItems = (state: RootState) => state.products.items;
export const selectProductsLoading = (state: RootState) => state.products.loading;

export const selectCart = (state: RootState) => state.cart;
export const selectCartItems = (state: RootState) => state.cart.items;
export const selectCartCount = (state: RootState) => state.cart.count;
export const selectCartTotal = (state: RootState) => state.cart.total;
export const selectWishlist = (state: RootState) => state.cart.wishlist;

export const selectOrders = (state: RootState) => state.orders;
export const selectOrderList = (state: RootState) => state.orders.orders;
export const selectSelectedOrder = (state: RootState) => state.orders.selectedOrder;

export const selectPrescriptions = (state: RootState) => state.prescriptions;
export const selectPrescriptionList = (state: RootState) => state.prescriptions.prescriptions;

export const selectUi = (state: RootState) => state.ui;
export const selectGlobalLoading = (state: RootState) => state.ui.globalLoading;
export const selectPrescriptionModalOpen = (state: RootState) => state.ui.prescriptionModalOpen;

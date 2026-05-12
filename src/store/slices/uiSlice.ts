import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface UiState {
  globalLoading: boolean;
  mobileMenuOpen: boolean;
  searchOpen: boolean;
  prescriptionModalOpen: boolean;
  activeModal: string | null;
  toasts: { id: string; message: string; type: "success" | "error" | "info" }[];
}

const initialState: UiState = {
  globalLoading: false,
  mobileMenuOpen: false,
  searchOpen: false,
  prescriptionModalOpen: false,
  activeModal: null,
  toasts: [],
};

const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    setGlobalLoading(state, action: PayloadAction<boolean>) { state.globalLoading = action.payload; },
    openMobileMenu(state) { state.mobileMenuOpen = true; },
    closeMobileMenu(state) { state.mobileMenuOpen = false; },
    toggleSearch(state) { state.searchOpen = !state.searchOpen; },
    openPrescriptionModal(state) { state.prescriptionModalOpen = true; },
    closePrescriptionModal(state) { state.prescriptionModalOpen = false; },
    openModal(state, action: PayloadAction<string>) { state.activeModal = action.payload; },
    closeModal(state) { state.activeModal = null; },
    addToast(state, action: PayloadAction<{ id: string; message: string; type: "success" | "error" | "info" }>) {
      state.toasts.push(action.payload);
    },
    removeToast(state, action: PayloadAction<string>) {
      state.toasts = state.toasts.filter((t) => t.id !== action.payload);
    },
  },
});

export const {
  setGlobalLoading,
  openMobileMenu,
  closeMobileMenu,
  toggleSearch,
  openPrescriptionModal,
  closePrescriptionModal,
  openModal,
  closeModal,
  addToast,
  removeToast,
} = uiSlice.actions;

export default uiSlice.reducer;

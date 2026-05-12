import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { DEMO } from "@/constants";
import { mockFetchOrders, mockFetchOrder, MockOrder } from "@/services/mocks";

export interface OrderState {
  orders: MockOrder[];
  selectedOrder: MockOrder | null;
  pagination: { total: number; page: number; pageSize: number; totalPages: number };
  loading: boolean;
  error: string | null;
}

const initialState: OrderState = {
  orders: [],
  selectedOrder: null,
  pagination: { total: 0, page: 1, pageSize: 10, totalPages: 0 },
  loading: false,
  error: null,
};

export const fetchOrders = createAsyncThunk(
  "orders/fetchAll",
  async (params: { page?: number; pageSize?: number } = {}, { rejectWithValue }) => {
    try {
      if (DEMO.MODE) {
        const res = await mockFetchOrders(params.page, params.pageSize);
        return res.data;
      }
      const { ApiService } = await import("@/services/transformers");
      const { ENDPOINTS } = await import("@/services/endpoints");
      const qs = params ? `?page=${params.page || 1}&pageSize=${params.pageSize || 10}` : "";
      const res = await ApiService.get(ENDPOINTS.ORDERS.LIST + qs);
      return res.data;
    } catch (err: unknown) {
      return rejectWithValue((err as Error).message || "Failed to fetch orders");
    }
  }
);

export const fetchOrder = createAsyncThunk(
  "orders/fetchOne",
  async (id: string, { rejectWithValue }) => {
    try {
      if (DEMO.MODE) {
        const res = await mockFetchOrder(id);
        return res.data;
      }
      const { ApiService } = await import("@/services/transformers");
      const { ENDPOINTS } = await import("@/services/endpoints");
      const res = await ApiService.get(ENDPOINTS.ORDERS.GET(id));
      return res.data;
    } catch (err: unknown) {
      return rejectWithValue((err as Error).message || "Failed to fetch order");
    }
  }
);

const orderSlice = createSlice({
  name: "orders",
  initialState,
  reducers: {
    clearOrderError(state) { state.error = null; },
    clearSelectedOrder(state) { state.selectedOrder = null; },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchOrders.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(fetchOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = action.payload?.data || [];
        state.pagination = action.payload?.pagination || initialState.pagination;
      })
      .addCase(fetchOrders.rejected, (state, action) => { state.loading = false; state.error = action.payload as string; })
      .addCase(fetchOrder.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(fetchOrder.fulfilled, (state, action) => { state.loading = false; state.selectedOrder = action.payload; })
      .addCase(fetchOrder.rejected, (state, action) => { state.loading = false; state.error = action.payload as string; });
  },
});

export const { clearOrderError, clearSelectedOrder } = orderSlice.actions;
export default orderSlice.reducer;

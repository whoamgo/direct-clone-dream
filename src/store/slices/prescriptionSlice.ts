import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { DEMO } from "@/constants";
import { mockFetchPrescriptions, mockUploadPrescription, MockPrescription } from "@/services/mocks";

export interface PrescriptionState {
  prescriptions: MockPrescription[];
  loading: boolean;
  uploading: boolean;
  error: string | null;
}

const initialState: PrescriptionState = {
  prescriptions: [],
  loading: false,
  uploading: false,
  error: null,
};

export const fetchPrescriptions = createAsyncThunk(
  "prescriptions/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      if (DEMO.MODE) {
        const res = await mockFetchPrescriptions();
        return res.data;
      }
      const { ApiService } = await import("@/services/transformers");
      const { ENDPOINTS } = await import("@/services/endpoints");
      const res = await ApiService.get(ENDPOINTS.PRESCRIPTIONS.LIST);
      return res.data;
    } catch (err: unknown) {
      return rejectWithValue((err as Error).message || "Failed to fetch prescriptions");
    }
  }
);

export const uploadPrescription = createAsyncThunk(
  "prescriptions/upload",
  async (payload: { fileName: string; note?: string }, { rejectWithValue }) => {
    try {
      if (DEMO.MODE) {
        const res = await mockUploadPrescription(payload.fileName, payload.note);
        return res.data;
      }
      const { ApiService } = await import("@/services/transformers");
      const { ENDPOINTS } = await import("@/services/endpoints");
      const res = await ApiService.post(ENDPOINTS.PRESCRIPTIONS.UPLOAD, payload);
      return res.data;
    } catch (err: unknown) {
      return rejectWithValue((err as Error).message || "Failed to upload prescription");
    }
  }
);

const prescriptionSlice = createSlice({
  name: "prescriptions",
  initialState,
  reducers: {
    clearPrescriptionError(state) { state.error = null; },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPrescriptions.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(fetchPrescriptions.fulfilled, (state, action) => {
        state.loading = false;
        state.prescriptions = action.payload || [];
      })
      .addCase(fetchPrescriptions.rejected, (state, action) => { state.loading = false; state.error = action.payload as string; })
      .addCase(uploadPrescription.pending, (state) => { state.uploading = true; state.error = null; })
      .addCase(uploadPrescription.fulfilled, (state, action) => {
        state.uploading = false;
        if (action.payload) state.prescriptions.push(action.payload);
      })
      .addCase(uploadPrescription.rejected, (state, action) => { state.uploading = false; state.error = action.payload as string; });
  },
});

export const { clearPrescriptionError } = prescriptionSlice.actions;
export default prescriptionSlice.reducer;

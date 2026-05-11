import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { OtpAuthService, OtpAuthResponse } from "@/api/services/otpAuthService";
import { LOCAL_STORAGE_KEYS } from "@/config";

/** Demo mode flag — when true we mock the backend (no real API yet). */
const DEMO_MODE = true;
const DEMO_OTP = "123456";
const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));

export interface OtpAuthState {
  phone: string | null;
  requestId: string | null;
  otpSent: boolean;
  verifying: boolean;
  sending: boolean;
  error: string | null;
  user: OtpAuthResponse["user"] | null;
  isAuthenticated: boolean;
}

const initialState: OtpAuthState = {
  phone: null,
  requestId: null,
  otpSent: false,
  verifying: false,
  sending: false,
  error: null,
  user: null,
  isAuthenticated: false,
};

export const sendOtp = createAsyncThunk(
  "otpAuth/sendOtp",
  async (payload: { phone: string; purpose?: "login" | "register" }, { rejectWithValue }) => {
    try {
      if (DEMO_MODE) {
        await wait(600);
        return { phone: payload.phone, requestId: `demo-${Date.now()}` };
      }
      const res = await OtpAuthService.sendOtp(payload);
      return { phone: payload.phone, requestId: res.data?.requestId ?? null };
    } catch (err: unknown) {
      return rejectWithValue((err as Error).message || "Failed to send OTP");
    }
  }
);

export const verifyOtp = createAsyncThunk(
  "otpAuth/verifyOtp",
  async (
    payload: { phone: string; otp: string; name?: string; purpose: "login" | "register" },
    { rejectWithValue }
  ) => {
    try {
      if (DEMO_MODE) {
        await wait(500);
        if (payload.otp !== DEMO_OTP) {
          return rejectWithValue("Invalid OTP. Use 123456 in demo mode.");
        }
        const fake: OtpAuthResponse = {
          accessToken: "demo-access-token",
          refreshToken: "demo-refresh-token",
          user: { id: `u_${payload.phone}`, phone: payload.phone, name: payload.name },
        };
        localStorage.setItem(LOCAL_STORAGE_KEYS.AUTH_TOKEN, fake.accessToken);
        localStorage.setItem(LOCAL_STORAGE_KEYS.USER_DATA, JSON.stringify(fake.user));
        return fake;
      }
      const res =
        payload.purpose === "register"
          ? await OtpAuthService.registerWithOtp(payload)
          : await OtpAuthService.verifyOtp(payload);
      if (res.data) {
        localStorage.setItem(LOCAL_STORAGE_KEYS.AUTH_TOKEN, res.data.accessToken);
        localStorage.setItem(LOCAL_STORAGE_KEYS.REFRESH_TOKEN, res.data.refreshToken);
        localStorage.setItem(LOCAL_STORAGE_KEYS.USER_DATA, JSON.stringify(res.data.user));
      }
      return res.data!;
    } catch (err: unknown) {
      return rejectWithValue((err as Error).message || "OTP verification failed");
    }
  }
);

const otpAuthSlice = createSlice({
  name: "otpAuth",
  initialState,
  reducers: {
    resetOtp: (state) => {
      state.otpSent = false;
      state.requestId = null;
      state.error = null;
    },
    logoutOtp: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.otpSent = false;
      state.phone = null;
    },
  },
  extraReducers: (b) => {
    b.addCase(sendOtp.pending, (s) => { s.sending = true; s.error = null; });
    b.addCase(sendOtp.fulfilled, (s, a) => {
      s.sending = false; s.otpSent = true; s.phone = a.payload.phone; s.requestId = a.payload.requestId;
    });
    b.addCase(sendOtp.rejected, (s, a) => { s.sending = false; s.error = a.payload as string; });

    b.addCase(verifyOtp.pending, (s) => { s.verifying = true; s.error = null; });
    b.addCase(verifyOtp.fulfilled, (s, a) => {
      s.verifying = false;
      s.user = a.payload.user;
      s.isAuthenticated = true;
    });
    b.addCase(verifyOtp.rejected, (s, a) => { s.verifying = false; s.error = a.payload as string; });
  },
});

export const { resetOtp, logoutOtp } = otpAuthSlice.actions;
export default otpAuthSlice.reducer;
import { ApiService } from "../apiService";
import { API_PATHS } from "@/config";

export interface SendOtpPayload {
  phone: string;
  purpose?: "login" | "register";
}

export interface VerifyOtpPayload {
  phone: string;
  otp: string;
  purpose?: "login" | "register";
}

export interface OtpAuthResponse {
  accessToken: string;
  refreshToken: string;
  user: {
    id: string;
    phone: string;
    name?: string;
  };
}

/**
 * OTP based phone authentication.
 * In demo mode the slice short-circuits the network call and accepts `123456`.
 */
export class OtpAuthService {
  static sendOtp(payload: SendOtpPayload) {
    return ApiService.post<{ requestId: string }>(API_PATHS.AUTH.SEND_OTP, payload);
  }
  static verifyOtp(payload: VerifyOtpPayload) {
    return ApiService.post<OtpAuthResponse>(API_PATHS.AUTH.VERIFY_OTP, payload);
  }
  static registerWithOtp(payload: VerifyOtpPayload & { name?: string }) {
    return ApiService.post<OtpAuthResponse>(API_PATHS.AUTH.REGISTER_OTP, payload);
  }
}
import { ApiService } from "../apiService";
import { API_PATHS } from "@/config";
import { AuthCredentials, RegisterCredentials, AuthResponse, User, ResetPasswordPayload, ChangePasswordPayload } from "@/types";

export class AuthService {
  static async login(credentials: AuthCredentials) {
    return ApiService.post<AuthResponse>(API_PATHS.AUTH.LOGIN, credentials);
  }

  static async register(credentials: RegisterCredentials) {
    return ApiService.post<AuthResponse>(API_PATHS.AUTH.REGISTER, credentials);
  }

  static async logout() {
    return ApiService.post(API_PATHS.AUTH.LOGOUT);
  }

  static async refreshToken() {
    return ApiService.post<AuthResponse>(API_PATHS.AUTH.REFRESH);
  }

  static async forgotPassword(email: string) {
    return ApiService.post(API_PATHS.AUTH.FORGOT_PASSWORD, { email });
  }

  static async resetPassword(payload: ResetPasswordPayload) {
    return ApiService.post(API_PATHS.AUTH.RESET_PASSWORD, payload);
  }

  static async verifyEmail(token: string) {
    return ApiService.post(API_PATHS.AUTH.VERIFY_EMAIL, { token });
  }

  static async getProfile() {
    return ApiService.get<User>(API_PATHS.USERS.PROFILE);
  }

  static async changePassword(payload: ChangePasswordPayload) {
    return ApiService.post(API_PATHS.USERS.CHANGE_PASSWORD, payload);
  }
}

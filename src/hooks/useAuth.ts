import { useAppSelector } from "./useAppSelector";
import { useAppDispatch } from "./useAppDispatch";
import { login, register, logout, getProfile, forgotPassword, resetPassword, changePassword } from "@/store/slices/authSlice";

export const useAuth = () => {
  const dispatch = useAppDispatch();
  const auth = useAppSelector((state) => state.auth);

  return {
    ...auth,
    login: (credentials: any) => dispatch(login(credentials)),
    register: (credentials: any) => dispatch(register(credentials)),
    logout: () => dispatch(logout()),
    getProfile: () => dispatch(getProfile()),
    forgotPassword: (email: string) => dispatch(forgotPassword(email)),
    resetPassword: (payload: any) => dispatch(resetPassword(payload)),
    changePassword: (payload: any) => dispatch(changePassword(payload)),
  };
};

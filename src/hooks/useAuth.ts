import { create } from 'zustand';
import authApi from '../api/auth';
import type { User, LoginRequest, RegisterRequest } from '../types';

interface AuthState {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  error: Error | null;
  checkAuth: () => Promise<void>;
  login: (data: LoginRequest) => Promise<User>;
  register: (data: RegisterRequest) => Promise<User>;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isLoading: true,
  isAuthenticated: false,
  error: null,

  checkAuth: async () => {
    try {
      const token = localStorage.getItem('accessToken');
      if (!token) {
        set({ isLoading: false, isAuthenticated: false, user: null });
        return;
      }

      const response = await authApi.getMe();
      // backend API returns { success: true, data: User, message: ... }
      // The Axios interceptor might return response.data which is the ApiResponse
      const userData = (response as any).data?.data || response.data;

      set({
        user: userData,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      });
    } catch (error) {
      set({
        isLoading: false,
        isAuthenticated: false,
        user: null,
        error: error instanceof Error ? error : new Error('Authentication check failed'),
      });
    }
  },

  login: async (data: LoginRequest) => {
    try {
      set({ isLoading: true, error: null });
      const response = await authApi.login(data);

      const authData = (response as any).data?.data || response.data;

      authApi.setTokens(authData.token, authData.refreshToken);

      set({
        user: authData.user,
        isAuthenticated: true,
        isLoading: false,
      });
      return authData.user;
    } catch (error) {
      const err = error instanceof Error ? error : new Error('Login failed');
      set({ isLoading: false, error: err });
      throw err;
    }
  },

  register: async (data: RegisterRequest) => {
    try {
      set({ isLoading: true, error: null });
      const response = await authApi.register(data);

      const authData = (response as any).data?.data || response.data;

      authApi.setTokens(authData.token, authData.refreshToken);

      set({
        user: authData.user,
        isAuthenticated: true,
        isLoading: false,
      });
      return authData.user;
    } catch (error) {
      const err = error instanceof Error ? error : new Error('Registration failed');
      set({ isLoading: false, error: err });
      throw err;
    }
  },

  logout: () => {
    authApi.logout();
    set({
      user: null,
      isLoading: false,
      isAuthenticated: false,
      error: null,
    });
  },
}));

export function useAuth() {
  const store = useAuthStore();
  return store;
}

export default useAuth;

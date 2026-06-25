/**
 * API Endpoints cho Authentication
 * - Đăng ký, Đăng nhập
 * - Refresh token
 * - Lấy thông tin user
 */

import axiosClient from './axiosClient';
import type { AuthResponse, LoginRequest, RegisterRequest, User } from '../types';

export const authApi = {
  /**
   * Đăng ký tài khoản mới
   */
  register: (data: RegisterRequest) => {
    return axiosClient.post<AuthResponse>('/auth/register', data);
  },

  /**
   * Đăng nhập
   */
  login: (data: LoginRequest) => {
    return axiosClient.post<AuthResponse>('/auth/login', data);
  },

  /**
   * Refresh access token
   */
  refreshToken: (refreshToken: string) => {
    return axiosClient.post<{ token: string; refreshToken: string }>(
      '/auth/refresh',
      { refreshToken }
    );
  },

  /**
   * Lấy thông tin user hiện tại
   */
  getMe: () => {
    return axiosClient.get<User>('/auth/me');
  },

  /**
   * Logout (xoá token ở client side)
   */
  logout: () => {
    axiosClient.clearTokens();
  },

  /**
   * Lưu tokens vào localStorage sau khi đăng nhập
   */
  setTokens: (accessToken: string, refreshToken: string) => {
    axiosClient.setTokens(accessToken, refreshToken);
  },
};

export default authApi;

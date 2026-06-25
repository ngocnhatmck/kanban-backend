/**
 * Cấu hình Axios Client
 * - Tự động thêm JWT token vào header
 * - Xử lý lỗi 401 (Unauthorized) -> Logout & Redirect
 * - Refresh token khi token hết hạn
 */

import axios, {
  type AxiosInstance,
  type AxiosRequestConfig,
  type InternalAxiosRequestConfig,
} from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api/v1';

interface CustomAxiosConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

class AxiosClient {
  private instance: AxiosInstance;
  private isRefreshing = false;
  private refreshSubscribers: Array<(token: string) => void> = [];

  constructor() {
    this.instance = axios.create({
      baseURL: API_BASE_URL,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Request Interceptor - Thêm JWT token vào header
    this.instance.interceptors.request.use(
      (config: InternalAxiosRequestConfig) => {
        const token = this.getAccessToken();
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Response Interceptor - Xử lý lỗi 401, refresh token
    this.instance.interceptors.response.use(
      (response) => response,
      (error) => this.handleResponseError(error)
    );
  }

  /**
   * Lấy Access Token từ localStorage
   */
  private getAccessToken(): string | null {
    return localStorage.getItem('accessToken');
  }

  /**
   * Lấy Refresh Token từ localStorage
   */
  private getRefreshToken(): string | null {
    return localStorage.getItem('refreshToken');
  }

  /**
   * Lưu tokens vào localStorage
   */
  public setTokens(accessToken: string, refreshToken: string): void {
    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('refreshToken', refreshToken);
  }

  /**
   * Xoá tokens khỏi localStorage (logout)
   */
  public clearTokens(): void {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
  }

  /**
   * Xử lý lỗi response
   * - Nếu 401 -> Refresh token hoặc logout
   * - Nếu 403 -> Redirect to /forbidden
   * - Các lỗi khác -> Throw error
   */
  private async handleResponseError(error: any) {
    const originalRequest = error.config as CustomAxiosConfig;

    // Xử lý lỗi 401 Unauthorized
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      if (!this.isRefreshing) {
        this.isRefreshing = true;

        try {
          const refreshToken = this.getRefreshToken();
          if (!refreshToken) {
            throw new Error('No refresh token available');
          }

          // Gọi endpoint refresh token
          const response = await axios.post(
            `${API_BASE_URL}/auth/refresh`,
            { refreshToken }
          );

          const { token, refreshToken: newRefreshToken } = response.data.data;
          this.setTokens(token, newRefreshToken);

          // Cập nhật header của request cũ
          originalRequest.headers.Authorization = `Bearer ${token}`;

          // Notify tất cả request đang chờ
          this.onRefreshed(token);
          this.isRefreshing = false;

          // Retry request cũ
          return this.instance(originalRequest);
        } catch (refreshError) {
          // Refresh token thất bại -> Logout
          this.clearTokens();
          this.isRefreshing = false;
          this.refreshSubscribers = [];

          // Redirect to login
          window.location.href = '/login';
          return Promise.reject(refreshError);
        }
      } else {
        // Nếu đang refresh, chờ token mới
        return new Promise((resolve) => {
          this.addRefreshSubscriber((token: string) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            resolve(this.instance(originalRequest));
          });
        });
      }
    }

    // Xử lý lỗi 403 Forbidden
    if (error.response?.status === 403) {
      window.location.href = '/forbidden';
    }

    return Promise.reject(error);
  }

  /**
   * Thêm subscriber để chờ token được refresh
   */
  private addRefreshSubscriber(callback: (token: string) => void): void {
    this.refreshSubscribers.push(callback);
  }

  /**
   * Notify tất cả subscribers khi token được refresh
   */
  private onRefreshed(token: string): void {
    this.refreshSubscribers.forEach((callback) => callback(token));
    this.refreshSubscribers = [];
  }

  /**
   * GET request
   */
  public get<T = any>(url: string, config?: AxiosRequestConfig) {
    return this.instance.get<T>(url, config);
  }

  /**
   * POST request
   */
  public post<T = any>(url: string, data?: any, config?: AxiosRequestConfig) {
    return this.instance.post<T>(url, data, config);
  }

  /**
   * PUT request
   */
  public put<T = any>(url: string, data?: any, config?: AxiosRequestConfig) {
    return this.instance.put<T>(url, data, config);
  }

  /**
   * PATCH request
   */
  public patch<T = any>(url: string, data?: any, config?: AxiosRequestConfig) {
    return this.instance.patch<T>(url, data, config);
  }

  /**
   * DELETE request
   */
  public delete<T = any>(url: string, config?: AxiosRequestConfig) {
    return this.instance.delete<T>(url, config);
  }
}

export const axiosClient = new AxiosClient();
export default axiosClient;

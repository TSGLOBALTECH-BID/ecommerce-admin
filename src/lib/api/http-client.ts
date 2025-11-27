// src/lib/api/http-client.ts
import axios, { AxiosError, AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { useAuthStore } from '@/stores/auth-store';
import { ApiResponse, Session } from './types';

const baseURL = process.env.NEXT_PUBLIC_API_URL || '/api';

// Create base axios instance
const createHttpClient = (config?: AxiosRequestConfig): AxiosInstance => {
  const instance = axios.create({
    baseURL,
    timeout: 10000,
    headers: {
      'Content-Type': 'application/json',
    },
    ...config,
  });

  // Request interceptor
  instance.interceptors.request.use(
    (config) => {
      const token = useAuthStore.getState().session?.access_token;
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error: AxiosError) => Promise.reject(error)
  );

  // Response interceptor
  instance.interceptors.response.use(
    (response: AxiosResponse) => response,
    async (error: AxiosError) => {
      const originalRequest = error.config as any;
      
      // Handle token refresh logic here if needed
      // if (error.response?.status === 401 && !originalRequest._retry) {
      //   originalRequest._retry = true;
      //   // Add refresh token logic
      // }
      
      return Promise.reject(error);
    }
  );

  return instance;
};

// Create a pre-configured instance
export const httpClient = createHttpClient();

// Type-safe API methods
export const api = {
  async get<T>(url: string, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    const response = await httpClient.get<ApiResponse<T>>(url, config);
    return response.data;
  },

  async post<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    const response = await httpClient.post<ApiResponse<T>>(url, data, config);
    return response.data;
  },

  async put<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    const response = await httpClient.put<ApiResponse<T>>(url, data, config);
    return response.data;
  },

  async delete<T>(url: string, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    const response = await httpClient.delete<ApiResponse<T>>(url, config);
    return response.data;
  },
};
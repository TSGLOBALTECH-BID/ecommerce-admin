// src/lib/api/services/auth.service.ts
import { api } from '../http-client';
import { LoginRequest, RegisterRequest, ForgotPasswordRequest, ResetPasswordRequest } from '../types/auth';

export const authService = {
  login: (data: LoginRequest) => api.post<{ user: any; session: any }>('/auth/login', data),
  register: (data: RegisterRequest) => api.post('/auth/register', data),
  forgotPassword: (data: ForgotPasswordRequest) => api.post('/auth/forgot-password', data),
  resetPassword: (data: ResetPasswordRequest) => api.post('/auth/reset-password', data),
  logout: () => api.post('/auth/logout'),
  refreshToken: (refreshToken: string) => api.post('/auth/refresh-token', { refreshToken }),
  getProfile: () => api.get('/auth/me'),
};
// types/api.ts
interface ErrorDetails {
  message: string;
  code?: string | number;
  details?: Record<string, string[]>;
  stack?: string; // For development only
}

export interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface BaseResponse<T = unknown> {
  success: boolean;
  message?: string;
  data?: T;
  error?: ErrorDetails;
  status: number;
  version: string;
  timestamp: string;
  meta?: PaginationMeta;
  requestId?: string;
}

// Type guards
export function isSuccessResponse<T>(response: BaseResponse<T>): response is BaseResponse<T> & { success: true; data: T } {
  return response.success === true && 'data' in response;
}

export function isErrorResponse(response: BaseResponse): response is BaseResponse & { success: false; error: ErrorDetails } {
  return response.success === false && 'error' in response;
}

// For backward compatibility
export type ApiResponse<T = any> = BaseResponse<T>;
export type ApiError = ErrorDetails;
export type ApiPromise<T = any> = Promise<BaseResponse<T>>;

// Extended pagination response
export interface PaginatedResponse<T> extends BaseResponse<T[]> {
  meta: PaginationMeta & {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

// API client configuration
export interface ApiClientConfig {
  baseURL: string;
  timeout?: number;
  headers?: Record<string, string>;
  version?: string;
}

// Request options
export interface RequestOptions {
  headers?: Record<string, string>;
  params?: Record<string, any>;
  signal?: AbortSignal;
}

// Session types
export interface Session {
  access_token: string;
  refresh_token: string;
  expires_in: number;
}
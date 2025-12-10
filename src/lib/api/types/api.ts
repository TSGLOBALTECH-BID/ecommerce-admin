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

// Base response without pagination
export interface BaseResponse<T = unknown> {
  success: boolean;
  message?: string;
  data?: T;  // Make data required
  error?: ErrorDetails;
  status: number;
  version: string;
  timestamp: string;
  requestId?: string;
}

// Paginated response with metadata
export interface PaginatedData<T> {
  items: T[];
  meta: PaginationMeta;
}

// Type guards
export function isSuccessResponse<T>(response: BaseResponse<T>): response is BaseResponse<T> & { 
  success: true; 
  data: T  // data is guaranteed to exist when success is true
} {
  return response.success === true && 'data' in response && response.data !== undefined;
}

export function isErrorResponse(response: BaseResponse): response is BaseResponse & { success: false; error: ErrorDetails } {
  return response.success === false && 'error' in response;
}

// For backward compatibility
export type ApiResponse<T = any> = BaseResponse<T>;
export type ApiError = ErrorDetails;
export type ApiPromise<T = any> = Promise<BaseResponse<T>>;

// For paginated responses
export type PaginatedResponse<T> = BaseResponse<PaginatedData<T>>;


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
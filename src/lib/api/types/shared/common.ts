// shared/common.ts

// Generic response types
export interface ListResponse<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// Common query params for listing endpoints
export interface PaginationParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

// Common filter params
export interface FilterParams {
  [key: string]: string | number | boolean | undefined;
}

// Common search params
export interface SearchParams extends PaginationParams {
  query?: string;
  filters?: FilterParams;
}
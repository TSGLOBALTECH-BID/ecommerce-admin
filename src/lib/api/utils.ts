// src/lib/api/utils.ts
import { ApiResponse, BaseResponse, isSuccessResponse, PaginatedData, PaginatedResponse } from './types';

export async function handleApiResponse<T>(apiCall: Promise<BaseResponse<T>>): Promise<T> {
  const response = await apiCall;
  
  if (response.success && response.data !== undefined) {
    return response.data;
  }

  const errorMessage = response.error?.message || 'An error occurred';
  throw new Error(errorMessage);
}

// For paginated responses
export async function handlePaginatedResponse<T>(
  apiCall: Promise<PaginatedResponse<T>>
): Promise<PaginatedData<T>> {
  return handleApiResponse(apiCall);
}
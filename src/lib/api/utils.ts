// src/lib/api/utils.ts
import { ApiResponse, isSuccessResponse } from './types';

export async function handleApiResponse<T>(apiCall: Promise<ApiResponse<T>>): Promise<T> {
  const response = await apiCall;
  
  if (isSuccessResponse(response)) {
    return response.data;
  }

  const errorMessage = response.error?.message || 'An error occurred';
  throw new Error(errorMessage);
}
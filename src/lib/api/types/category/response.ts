// src/lib/api/types/category/response.ts
import { BaseResponse, PaginatedResponse } from '../api';
import { Category } from '../shared/category';

// Single Category Response
export interface CategoryResponseData {
  category: Category;
}

// Multiple Categories Response (for pagination)
export interface CategoriesResponseData {
  categories: Category[];
}

// Response Types
export type CreateCategoryResponse = BaseResponse<CategoryResponseData>;
export type GetCategoryResponse = BaseResponse<CategoryResponseData>;
export type GetCategoriesResponse = PaginatedResponse<Category>;
export type UpdateCategoryResponse = BaseResponse<CategoryResponseData>;
export type DeleteCategoryResponse = BaseResponse<{ id: string }>;
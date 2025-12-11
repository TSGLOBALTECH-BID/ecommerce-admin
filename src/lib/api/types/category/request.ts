// src/lib/api/types/category/request.ts
import { Category } from '../shared/category';

// Create Category Request
export interface CreateCategoryRequest {
  name: string;
  slug: string;
  parent_category_id?: string | null;
}

// Update Category Request
export type UpdateCategoryRequest = Partial<CreateCategoryRequest> & {
  category_id: string;
};

// Delete Category Request
export interface DeleteCategoryRequest {
  category_id: string;
}

// Get Categories Request (for filtering/pagination)
export interface GetCategoriesRequest {
  page?: number;
  limit?: number;
  search?: string;
  parent_category_id?: string | null;
}
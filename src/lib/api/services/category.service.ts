// src/lib/api/services/category.service.ts
import { api } from '../http-client';
import {
  CreateCategoryRequest,
  UpdateCategoryRequest,
  DeleteCategoryRequest,
  GetCategoriesRequest
} from '../types/category/request';
import {
  CreateCategoryResponse, 
  UpdateCategoryResponse,
  DeleteCategoryResponse,
  CategoriesResponseData,
  CategoryResponseData
} from '../types/category/response';

export const categoryService = {
  // Create a new category
  create: (data: CreateCategoryRequest) => 
    api.post<CategoryResponseData>('/categories', data),

  // Get all categories with optional pagination and filtering
  getAll: (params?: GetCategoriesRequest) =>
    api.get<CategoriesResponseData>('/categories', { params }),

  // Get a single category by ID
  getById: (id: string) =>
    api.get<CategoryResponseData>(`/categories/${id}`),

  // Update a category
  update: ({ category_id, ...data }: UpdateCategoryRequest) =>
    api.patch<UpdateCategoryResponse>(`/categories/${category_id}`, data),

  // Delete a category
  delete: ({ category_id }: DeleteCategoryRequest) =>
    api.delete<DeleteCategoryResponse>(`/categories/${category_id}`),

  // Get all parent categories (categories with no parent)
  getParentCategories: () =>
    api.get<CategoriesResponseData>('/categories/parents'),

  // Get subcategories for a specific parent category
  getSubcategories: (parentId: string) =>
    api.get<CategoriesResponseData>(`/categories/parent/${parentId}`)
};
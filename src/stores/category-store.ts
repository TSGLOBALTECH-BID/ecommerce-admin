import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { categoryService, handleApiResponse, handlePaginatedResponse, PaginatedData } from '@/lib/api';
import { Category, CategoryWithChildren } from '@/lib/api/types/shared/category';
import { CategoriesResponseData, CategoryResponseData, CreateCategoryRequest } from '@/lib/api/types/category';

type CategoryState = {
    categories: CategoryWithChildren[];
    currentCategory: Category | null;
    isLoading: boolean;
    error: string | null;
    fetchCategories: () => Promise<void>;
    fetchCategoryById: (id: string) => Promise<Category | null>;
    createCategory: (data: CreateCategoryRequest) => Promise<Category | null>;
    updateCategory: (id: string, data: FormData) => Promise<Category | null>;
    deleteCategory: (id: string) => Promise<boolean>;
    setLoading: (isLoading: boolean) => void;
    setError: (error: string | null) => void;
    clearError: () => void;
};

const buildCategoryTree = (data: Category[] | { data: Category[] }): CategoryWithChildren[] => {
    // Handle both direct array and paginated response
    const categories = Array.isArray(data) ? data : data.data;
    // Create a map of all categories
    const map = new Map<string, CategoryWithChildren>();
    const result: CategoryWithChildren[] = [];

    // First pass: create all nodes
    categories.forEach(category => {
        map.set(category.category_id, { ...category, children: [] });
    });

    // Second pass: build the tree
    categories.forEach(category => {
       
        const node = map.get(category.category_id)!;
        if (category.parent_category_id) {
            const parent = map.get(category.parent_category_id);
            if (parent) {
                parent.children = parent.children || [];
                parent.children.push(node);
                return;
            }
        }
        result.push(node);
    });

    return result;
};

export const useCategoryStore = create<CategoryState>()(
    persist(
        (set, get) => ({
            categories: [],
            currentCategory: null,
            isLoading: false,
            error: null,



            fetchCategories: async (params?: { page?: number; limit?: number }) => {
                set({ isLoading: true, error: null });
                try {
                    const response = await handleApiResponse<CategoriesResponseData>(categoryService.getAll(params));
                    const categoryTree = buildCategoryTree(response.categories || []);
                    set({
                        categories: categoryTree,
                        // If you need pagination in your store:
                        // pagination: {
                        //     total: response.meta.total,
                        //     page: response.meta.page,
                        //     limit: response.meta.limit,
                        //     totalPages: response.meta.totalPages,
                        //     hasNextPage: response.meta.hasNextPage,
                        //     hasPreviousPage: response.meta.hasPreviousPage
                        // }
                    });
                } catch (error) {
                    set({ error: error instanceof Error ? error.message : 'Failed to fetch categories' });
                } finally {
                    set({ isLoading: false });
                }
            },
            fetchCategoryById: async (id: string) => {
                try {
                    set({ isLoading: true, error: null });
                    const response = await handleApiResponse<CategoryResponseData>(categoryService.getById(id));
                    set({ currentCategory: response.category || null });
                    return response.category || null;
                } catch (error) {
                    set({ error: error instanceof Error ? error.message : 'Failed to fetch category' });
                    throw error;
                } finally {
                    set({ isLoading: false });
                }
            },

            createCategory: async (data: CreateCategoryRequest) => {
                try {
                    set({ isLoading: true, error: null });
                    const response = await handleApiResponse<CategoryResponseData>(categoryService.create(data));
                    await get().fetchCategories();
                    return response.category ?? null;
                } catch (error) {
                    set({ error: error instanceof Error ? error.message : 'Failed to create category' });
                    throw error;
                } finally {
                    set({ isLoading: false });
                }
            },

            updateCategory: async (id: string, data: FormData) => {
                try {
                    set({ isLoading: true, error: null });
                    const response = await handleApiResponse(
                        categoryService.update({ category_id: id, ...Object.fromEntries(data) })
                    );
                    await get().fetchCategories();
                    if (get().currentCategory?.category_id === id) {
                        await get().fetchCategoryById(id);
                    }
                    return response.data?.category || null;
                } catch (error) {
                    set({ error: error instanceof Error ? error.message : 'Failed to update category' });
                    throw error;
                } finally {
                    set({ isLoading: false });
                }
            },

            deleteCategory: async (id: string) => {
                try {
                    set({ isLoading: true, error: null });
                    await handleApiResponse(categoryService.delete({ category_id: id }));
                    await get().fetchCategories();
                    if (get().currentCategory?.category_id === id) {
                        set({ currentCategory: null });
                    }
                    return true;
                } catch (error) {
                    set({ error: error instanceof Error ? error.message : 'Failed to delete category' });
                    throw error;
                } finally {
                    set({ isLoading: false });
                }
            },

            setLoading: (isLoading: boolean) => set({ isLoading }),
            setError: (error: string | null) => set({ error }),
            clearError: () => set({ error: null }),
        }),
        {
            name: 'category-storage',
            storage: createJSONStorage(() => localStorage),
            partialize: (state) => ({
                categories: state.categories,
                currentCategory: state.currentCategory,
            }),
        }
    )
);
// src/app/categories/[id]/page.tsx
'use client'

import { useParams, useRouter } from 'next/navigation'
import { useCategoryStore } from '@/stores/category-store'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Pencil, Trash2, ChevronRight } from 'lucide-react'
import Link from 'next/link'
import { toast } from 'sonner'
import { CategoryWithChildren } from '@/lib/api/types/shared/category'

export default function CategoryDetailPage() {
    const { id } = useParams()
    const router = useRouter()
    const { categories, deleteCategory, isLoading } = useCategoryStore()

    const findCategoryById = (categories: CategoryWithChildren[], id: string): CategoryWithChildren | undefined => {
        for (const category of categories) {
            if (category.category_id === id) {
                return category;
            }
            if (category.children && category.children.length > 0) {
                const found = findCategoryById(category.children, id);
                if (found) return found;
            }
        }
        return undefined;
    };

    const category = findCategoryById(categories, id as string);
    const childCategories = category?.children || [];
    const handleDelete = async () => {
        if (window.confirm('Are you sure you want to delete this category?')) {
            try {
                const success = await deleteCategory(id as string)
                if (success) {
                    toast.success('Category deleted successfully')
                    router.push('/categories')
                }
            } catch (err) {
                console.error('Error deleting category:', err)
                toast.error('Failed to delete category')
            }
        }
    }

    if (isLoading) {
        return <div className="p-6">Loading...</div>
    }

    if (!category) {
        return (
            <div className="p-6">
                <p>Category not found</p>
                <Button variant="outline" className="mt-4" asChild>
                    <Link href="/categories">
                        Back to Categories
                    </Link>
                </Button>
            </div>
        )
    }

    return (
        <div className="p-6 max-w-4xl mx-auto">
            <div className="flex items-center justify-between mb-6">
                <Button variant="outline" size="sm" asChild>
                    <Link href="/categories">
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back to Categories
                    </Link>
                </Button>
                <div className="flex space-x-2">
                    <Button variant="outline" size="sm" asChild>
                        <Link href={`/categories/${id}/edit`}>
                            <Pencil className="mr-2 h-4 w-4" />
                            Edit
                        </Link>
                    </Button>
                    <Button variant="destructive" size="sm" onClick={handleDelete}>
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete
                    </Button>
                </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6 mb-6">
                <h1 className="text-2xl font-bold mb-4">{category.name}</h1>

                <div className="space-y-4">
                    <div>
                        <h3 className="text-sm font-medium text-gray-500">Slug</h3>
                        <p className="mt-1">{category.slug}</p>
                    </div>

                    {category.parent_category_name && (
                        <div>
                            <h3 className="text-sm font-medium text-gray-500">Parent Category</h3>
                            <p className="mt-1">{category.parent_category_name}</p>
                        </div>
                    )}

                    <div>
                        <h3 className="text-sm font-medium text-gray-500">Created At</h3>
                        <p className="mt-1">
                            {new Date(category.created_at).toLocaleDateString()}
                        </p>
                    </div>

                    {category.product_count !== undefined && (
                        <div>
                            <h3 className="text-sm font-medium text-gray-500">Products</h3>
                            <p className="mt-1">{category.product_count} products</p>
                        </div>
                    )}
                </div>
            </div>

            {childCategories.length > 0 && (
                <div className="bg-white rounded-lg shadow p-6">
                    <h2 className="text-lg font-semibold mb-4">Subcategories</h2>
                    <div className="space-y-2">
                        {childCategories.map((child) => (
                            <Link
                                key={child.category_id}
                                href={`/categories/${child.category_id}`}
                                className="flex items-center justify-between p-3 rounded-md hover:bg-gray-50 transition-colors border"
                            >
                                <span>{child.name}</span>
                                <ChevronRight className="h-4 w-4 text-gray-400" />
                            </Link>
                        ))}
                    </div>
                </div>
            )}
        </div>
    )
}
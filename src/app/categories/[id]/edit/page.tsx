'use client'

import { useParams, useRouter } from 'next/navigation'
import { useCategoryStore } from '@/stores/category-store'
import { useEffect, useState } from 'react'
import { Category, CategoryWithChildren } from '@/lib/api/types/shared/category'
import { toast } from 'sonner'
import { CategoryForm } from '@/components/category/category-form'

export default function EditCategoryPage() {
  const { id } = useParams()
  const router = useRouter()
  const { categories, isLoading } = useCategoryStore()

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

  if (isLoading) {
    return <div className="p-6">Loading...</div>
  }

  if (!category) {
    return null
  }

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Edit Category</h1>
      </div>
      <CategoryForm 
        initialData={category} 
        isEditing 
        onSuccess={() => router.push(`/categories/${id}`)} 
      />
    </div>
  )
}
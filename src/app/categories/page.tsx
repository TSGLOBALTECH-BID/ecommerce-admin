// src/app/categories/page.tsx
'use client'

import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import { DataTable } from '@/components/ui/data-table'
import { columns } from './columns'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Category } from '@/lib/api/types/shared/category'


export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch('/api/categories')
        if (!response.ok) {
          throw new Error('Failed to fetch categories')
        }
        const data = await response.json()
        setCategories(data)
      } catch (error) {
        console.error('Error fetching categories:', error)
        // Fallback to mock data if API call fails
        const mockCategories: Category[] = [
          {
            category_id: '1',
            name: 'Electronics',
            slug: 'electronics',
            parent_category_id: null,
            created_at: new Date().toISOString(),
            product_count: 24,
            parent_category_name: null,
          },
          {
            category_id: '2',
            name: 'Laptops',
            slug: 'laptops',
            parent_category_id: '1',
            created_at: new Date().toISOString(),
            product_count: 15,
            parent_category_name: 'Electronics',
          },
          {
            category_id: '3',
            name: 'Smartphones',
            slug: 'smartphones',
            parent_category_id: '1',
            created_at: new Date().toISOString(),
            product_count: 32,
            parent_category_name: 'Electronics',
          },
          {
            category_id: '4',
            name: 'Clothing',
            slug: 'clothing',
            parent_category_id: null,
            created_at: new Date(Date.now() - 86400000).toISOString(),
            product_count: 56,
            parent_category_name: null,
          },
          {
            category_id: '5',
            name: 'Men\'s Fashion',
            slug: 'mens-fashion',
            parent_category_id: '4',
            created_at: new Date(Date.now() - 172800000).toISOString(),
            product_count: 28,
            parent_category_name: 'Clothing',
          },
        ]
        setCategories(mockCategories)
      } finally {
        setLoading(false)
      }
    }

    fetchCategories()
  }, [])

  const handleAddNew = () => {
    // Navigate to add new category page
    window.location.href = '/categories/new'
  }

  if (loading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">Categories</h1>
          <Button onClick={handleAddNew}>
            <Plus className="mr-2 h-4 w-4" />
            Add Category
          </Button>
        </div>
        <div className="rounded-md border">
          <div className="p-4 text-center">Loading categories...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Categories</h1>
          <p className="text-sm text-gray-500">
            {categories.length} {categories.length === 1 ? 'category' : 'categories'} found
          </p>
        </div>
        <Button asChild>
          <Link href="/categories/new">
            <Plus className="mr-2 h-4 w-4" />
            Add Category
          </Link>
        </Button>
      </div>
      <div className="rounded-md border">
        {categories.length === 0 ? (
          <div className="p-8 text-center">
            <p className="text-gray-500 mb-4">No categories found</p>
            <Button asChild>
              <Link href="/categories/new">
                <Plus className="mr-2 h-4 w-4" />
                Create your first category
              </Link>
            </Button>
          </div>
        ) : (
          <DataTable columns={columns} data={categories} searchKey={''} />
        )}
      </div>
    </div>
  )
}
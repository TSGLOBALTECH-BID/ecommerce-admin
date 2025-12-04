// src/app/categories/page.tsx
'use client'

import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import { DataTable } from '@/components/ui/data-table'
import { columns } from './columns'
import { useState, useEffect } from 'react'
import Link from 'next/link'

export type Category = {
  id: string
  name: string
  slug: string
  status: 'active' | 'inactive' | 'archived'
  productCount: number
  createdAt: string
  parentId?: string | null
  parentCategoryName?: string | null
}

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // In a real app, you would fetch this from your API
    const fetchCategories = async () => {
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 500))
        
        // Mock data - replace with actual API call
        const mockCategories: Category[] = [
          {
            id: '1',
            name: 'Electronics',
            slug: 'electronics',
            status: 'active',
            productCount: 24,
            createdAt: new Date().toISOString(),
          },
          {
            id: '2',
            name: 'Clothing',
            slug: 'clothing',
            status: 'active',
            productCount: 56,
            createdAt: new Date(Date.now() - 86400000).toISOString(),
          },
          {
            id: '3',
            name: 'Home & Kitchen',
            slug: 'home-kitchen',
            status: 'active',
            productCount: 15,
            parentId: '1',
            parentCategoryName: 'Electronics',
            createdAt: new Date(Date.now() - 172800000).toISOString(),
          },
          {
            id: '4',
            name: 'Toys & Games',
            slug: 'toys-games',
            status: 'inactive',
            productCount: 18,
            parentId: null,
            parentCategoryName: null,
            createdAt: new Date(Date.now() - 259200000).toISOString(),
          },
          {
            id: '5',
            name: 'Books',
            slug: 'books',
            status: 'archived',
            productCount: 0,
            parentId: null,
            parentCategoryName: null,
            createdAt: new Date(Date.now() - 345600000).toISOString(),
          },
        ]
        
        setCategories(mockCategories)
      } catch (error) {
        console.error('Error fetching categories:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchCategories()
  }, [])

  const handleAddNew = () => {
    // Handle add new category
    console.log('Add new category clicked')
  }

  if (loading) {
    return (
      <div className="container mx-auto py-10">
        <div className="animate-pulse space-y-4">
          <div className="h-10 w-48 bg-gray-200 rounded"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    )
  }

const transformCategory = (apiCategory: Category) => ({
  category_id: apiCategory.id,
  name: apiCategory.name,
  slug: apiCategory.slug,
  parent_category_id: apiCategory.parentId || null,
  created_at: apiCategory.createdAt
});

// Then use it like this:
const transformedCategories = categories.map(transformCategory);

  return (
    <div className="container mx-auto py-10">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Product Categories</h1>
        <Link href="/categories/new" passHref>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add Category
          </Button>
        </Link>
      </div>
      
      <div className="rounded-md border">
        <DataTable
          data={transformedCategories}
          columns={columns}
          searchKey="name"
          onAddNew={handleAddNew}
        />
      </div>
    </div>
  )
}
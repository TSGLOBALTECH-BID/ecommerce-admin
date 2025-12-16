// In your page.tsx
'use client'

import { DataTable } from "@/components/ui/data-table"
import { columns } from "./columns"
import { useCategoryStore } from "@/stores/category-store"
import { useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import Link from "next/link"
import { CategoryWithChildren } from "@/lib/api/types/shared/category"

export default function CategoriesPage() {
  const { categories, fetchCategories, isLoading } = useCategoryStore()

  useEffect(() => {
    fetchCategories()
  }, [fetchCategories])



  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Categories</h1>
          <p className="text-sm text-gray-500">
            {categories.length} root categories
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
        <DataTable<CategoryWithChildren, unknown>
          columns={columns}
          data={categories}
          searchKey="name"
          getRowId={(row) => row.category_id}
          getSubRows={(row) => row.children || []}
          initialState={{
            expanded: {}
          }}
        />
      </div>
    </div>
  )
}
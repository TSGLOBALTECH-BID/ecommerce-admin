'use client'

import { CategoryForm } from "@/components/category/category-form"


export default function AddCategoryPage() {
  return (
    <div className="p-6 max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Add New Category</h1>
      </div>
      <CategoryForm />
    </div>
  )
}
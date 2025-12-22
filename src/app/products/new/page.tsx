'use client'

import { ProductForm } from "@/components/product/product-form"
import { Button } from "@/components/ui/button"
import { X } from "lucide-react"
import Link from "next/link"
import { useState } from "react"

export default function AddProductPage() {
    
    const [refreshKey, setRefreshKey] = useState(0)
    const handleProductAdded = () => {
    setRefreshKey(prev => prev + 1)
  }
  return (
    <div className="p-6 max-w-2xl mx-auto">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Add New Product</h1>
        <Button variant="outline" asChild>
          <Link href="/products">
            <X className="mr-2 h-4 w-4" />
            Cancel
          </Link>
        </Button>
      </div>
       <ProductForm onAdd={handleProductAdded} />
    </div>
  )
}
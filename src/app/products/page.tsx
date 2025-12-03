'use client'


import { columns } from './columns'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import { Product } from './columns'

import { DataTable } from '@/components/ui/data-table'
import { useEffect, useState } from 'react'



export default function Products() {
  const [products, setProducts] = useState<Product[]>([])

  useEffect(() => {
    // This will only run on the client side
    const mockProducts: Product[] = Array.from({ length: 50 }, (_, i) => ({
      id: `prod_${i + 1}`,
      name: `Product ${i + 1}`,
      status: ['active', 'inactive', 'pending'][Math.floor(Math.random() * 3)] as 'active' | 'inactive' | 'pending',
      price: Math.floor(Math.random() * 1000) + 100,
      stock: Math.floor(Math.random() * 100),
      createdAt: new Date(Date.now() - Math.floor(Math.random() * 1000 * 60 * 60 * 24 * 30)).toISOString(),
    }))
    setProducts(mockProducts)
  }, [])
  return (
    <div className="container mx-auto py-10">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Products</h1>
      </div>
      <div className="rounded-md border">
        <DataTable<Product, string | number | Date>
          data={products}
          columns={columns}
          searchKey="name"
          onAddNew={() => {
            // Handle add new product
            console.log('Add new product clicked')
          }}
        />
      </div>
    </div>
  )
}
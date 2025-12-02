import { ColumnDef } from '@tanstack/react-table'
import { Button } from '@/components/ui/button'
import { ArrowUpDown, MoreHorizontal } from 'lucide-react'

export type Product = {
  id: string
  name: string
  status: 'active' | 'inactive' | 'pending'
  price: number
  stock: number
  createdAt: string
}

export const columns: ColumnDef<Product>[] = [
  {
    accessorKey: 'name',
    header: 'Product Name',
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => {
      const status = row.getValue('status') as string
      return (
        <span className={`px-2 py-1 text-xs rounded-full ${
          status === 'active' ? 'bg-green-100 text-green-800' :
          status === 'inactive' ? 'bg-gray-100 text-gray-800' :
          'bg-yellow-100 text-yellow-800'
        }`}>
          {status}
        </span>
      )
    },
  },
  {
    accessorKey: 'price',
    header: 'Price',
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue('price'))
      const formatted = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
      }).format(amount)
      return <div className="font-medium">{formatted}</div>
    },
  },
  {
    accessorKey: 'stock',
    header: 'Stock',
  },
  {
    accessorKey: 'createdAt',
    header: 'Date Added',
    cell: ({ row }) => {
      const date = new Date(row.getValue('createdAt'))
      return date.toLocaleDateString()
    },
  },
  {
    id: 'actions',
    cell: () => {
      return (
        <Button variant="ghost" size="sm">
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      )
    },
  },
]
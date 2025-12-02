import { DataTable } from '@/components/data-table'
import { columns } from './columns'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'

export default function AuthorizedProductsPage() {
  return (
    <div className="container mx-auto py-10">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Authorized Products</h1>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Add Product
        </Button>
      </div>
      <div className="rounded-md border">
        <DataTable columns={columns} data={[]} />
      </div>
    </div>
  )
}
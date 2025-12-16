// src/app/categories/columns.tsx
'use client'

import { ColumnDef } from '@tanstack/react-table'
import { Button } from '@/components/ui/button'
import { ArrowUpDown, ChevronDown, ChevronRight, MoreHorizontal, Pencil, Trash2 } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import Link from 'next/link'
import { Category, CategoryWithChildren } from '@/lib/api/types/shared/category'


export const columns: ColumnDef<CategoryWithChildren>[] = [
  {
    id: "expand",
    size: 40,
    header: () => null,
    cell: ({ row }) => {
      const hasChildren = row.original.children && row.original.children.length > 0
      return hasChildren ? (
        <div className="w-8">
        <Button
          variant="ghost"
          size="sm"
          className="h-8 w-8 p-0"
          onClick={(e) => {
            e.stopPropagation();
            console.log('Toggling row:', row.id, 'Current expanded state:', row.getIsExpanded());
            row.toggleExpanded();
            console.log('New expanded state:', row.getIsExpanded());
          }}
        >
          {row.getIsExpanded() ? (
            <ChevronDown className="h-4 w-4" />
          ) : (
            <ChevronRight className="h-4 w-4" />
          )}
        </Button>
        </div>
      ) : null
    },
  }, {
    accessorKey: 'name',
    header: 'Category Name',
    cell: ({ row }) => {
      const hasChildren = row.original.children && row.original.children.length > 0
      const depth = row.depth // Use the row's depth for indentation
      const paddingLeft = `${depth * 10}px` // 20px per level of depth

      return (
        <Link 
          href={`/categories/${row.original.category_id}`}
          className="font-medium text-blue-600 hover:underline"
          style={{ paddingLeft }}
        >
          {row.getValue('name')}
        </Link>
      )
    },
  },
  {
    accessorKey: 'slug',
    header: 'Slug',
  },
  {
    accessorKey: 'product_count',
    header: 'Products',
    cell: ({ row }) => (
      <span className="px-2 py-1 text-xs font-medium rounded-full bg-blue-50 text-blue-700">
        {row.getValue('product_count') || 0} items
      </span>
    ),
  },
  {
    accessorKey: 'created_at',
    header: 'Created',
    cell: ({ row }) => (
      <span className="text-sm text-gray-500">
        {new Date(row.getValue('created_at')).toLocaleDateString()}
      </span>
    ),
  },
  {
    id: 'actions',
    cell: ({ row }) => {
      const category = row.original

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem asChild>
              <Link href={`/categories/${category.category_id}`} className="cursor-pointer">
                <Pencil className="mr-2 h-4 w-4" />
                Edit
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => console.log('Delete', category.category_id)}
              className="text-red-600 cursor-pointer"
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]
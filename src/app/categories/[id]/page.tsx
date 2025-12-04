// src/app/categories/[id]/page.tsx
'use client'

import { useParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Pencil, Trash2 } from 'lucide-react'
import Link from 'next/link'

type Category = {
    id: string
    name: string
    slug: string
    description?: string
    status: 'active' | 'inactive' | 'archived'
    productCount: number
    createdAt: string
    updatedAt: string
    // Add any other category-specific fields
}

export default function CategoryDetailPage() {
    const { id } = useParams()
    const [category, setCategory] = useState<Category | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        // In a real app, fetch category by ID from your API
        const fetchCategory = async () => {
            try {
                // Simulate API call
                await new Promise(resolve => setTimeout(resolve, 500))

                // Mock data - replace with actual API call
                const mockCategory: Category = {
                    id: id as string,
                    name: 'Electronics',
                    slug: 'electronics',
                    description: 'All electronic devices and accessories',
                    status: 'active',
                    productCount: 24,
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString(),
                }

                setCategory(mockCategory)
            } catch (error) {
                console.error('Error fetching category:', error)
            } finally {
                setLoading(false)
            }
        }

        fetchCategory()
    }, [id])

    const getStatusVariant = (status: string) => {
        switch (status) {
            case 'active':
                return 'bg-green-100 text-green-800'
            case 'inactive':
                return 'bg-yellow-100 text-yellow-800'
            case 'archived':
                return 'bg-gray-100 text-gray-800'
            default:
                return 'bg-gray-100 text-gray-800'
        }
    }

    if (loading) {
        return (
            <div className="container mx-auto py-10">
                <div className="animate-pulse space-y-4">
                    <div className="h-8 w-48 bg-gray-200 rounded"></div>
                    <div className="h-4 w-32 bg-gray-200 rounded"></div>
                    <div className="h-4 w-64 bg-gray-200 rounded"></div>
                </div>
            </div>
        )
    }

    if (!category) {
        return (
            <div className="container mx-auto py-10">
                <div className="text-center">
                    <h1 className="text-2xl font-bold">Category not found</h1>
                    <Link href="/categories" className="text-blue-600 hover:underline mt-4 inline-block">
                        Back to Categories
                    </Link>
                </div>
            </div>
        )
    }

    return (
        <div className="container mx-auto py-10">
            <div className="mb-6">
                <Link href="/categories" className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900 mb-4">
                    <ArrowLeft className="h-4 w-4 mr-1" />
                    Back to Categories
                </Link>

                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold">{category.name}</h1>
                        <div className="flex items-center mt-2 space-x-2">

                            {category.status.charAt(0).toUpperCase() + category.status.slice(1)}

                            <span className="text-sm text-gray-500">
                                {category.productCount} products
                            </span>
                        </div>
                    </div>

                    <div className="space-x-2">
                        <Button variant="outline" size="sm" onClick={() => console.log('Edit', category.id)}>
                            <Pencil className="h-4 w-4 mr-2" />
                            Edit
                        </Button>
                        <Button variant="destructive" size="sm" onClick={() => console.log('Delete', category.id)}>
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete
                        </Button>
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
                <div className="space-y-4">
                    <div>
                        <h2 className="text-lg font-medium text-gray-900">Category Information</h2>
                        <p className="mt-1 text-sm text-gray-500">
                            Basic details about this category.
                        </p>
                    </div>

                    <div className="border-t border-gray-200 pt-4">
                        <dl className="divide-y divide-gray-200">
                            <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4">
                                <dt className="text-sm font-medium text-gray-500">Name</dt>
                                <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                                    {category.name}
                                </dd>
                            </div>
                            <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4">
                                <dt className="text-sm font-medium text-gray-500">Slug</dt>
                                <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                                    {category.slug}
                                </dd>
                            </div>
                            <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4">
                                <dt className="text-sm font-medium text-gray-500">Description</dt>
                                <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                                    {category.description || 'No description provided.'}
                                </dd>
                            </div>
                            <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4">
                                <dt className="text-sm font-medium text-gray-500">Created</dt>
                                <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                                    {new Date(category.createdAt).toLocaleDateString()}
                                </dd>
                            </div>
                            <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4">
                                <dt className="text-sm font-medium text-gray-500">Last Updated</dt>
                                <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                                    {new Date(category.updatedAt).toLocaleDateString()}
                                </dd>
                            </div>
                        </dl>
                    </div>
                </div>
            </div>

            {/* Add more sections here for related products, subcategories, etc. */}
        </div>
    )
}
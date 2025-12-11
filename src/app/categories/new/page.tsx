"use client"

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { toast } from 'sonner'
import { Category } from '@/lib/api/types/shared/category'
import { useCategoryStore } from '@/stores/category-store'

export default function AddCategoryPage() {
  const router = useRouter()
  const createCategory = useCategoryStore(state => state.createCategory);
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    parent_category_id: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch('/api/categories')
        if (!response.ok) throw new Error('Failed to fetch categories')
        const data = await response.json()
        setCategories(data)
      } catch (error) {
        console.error('Error fetching categories:', error)
        toast.error('Failed to load categories')
      } finally {
        setLoading(false)
      }
    }

    fetchCategories()
  }, [])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSelectChange = (value: string) => {
    setFormData(prev => ({
      ...prev,
      parent_category_id: value === 'none' ? '' : value
    }))
  }

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/--+/g, '-')
  }

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setIsSubmitting(true);

  try {
    // Generate slug if not provided
    const slug = formData.slug || generateSlug(formData.name);
    
    // Create the category using the store
    const newCategory = await createCategory({
      name: formData.name,
      slug: slug,
      parent_category_id: formData.parent_category_id || null
    });

    if (newCategory) {
      toast.success('Category created successfully');
      router.push('/categories');
    } else {
      toast.error('Failed to create category');
    }
  } catch (error) {
    console.error('Error creating category:', error);
    toast.error('An error occurred while creating the category');
  } finally {
    setIsSubmitting(false);
  }
}

  if (loading) {
    return <div className="p-6">Loading categories...</div>
  }

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Add New Category</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="name">Category Name *</Label>
          <Input
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Enter category name"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="slug">Slug</Label>
          <div className="flex gap-2">
            <Input
              id="slug"
              name="slug"
              value={formData.slug}
              onChange={handleChange}
              placeholder="category-slug"
            />
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                if (formData.name) {
                  setFormData(prev => ({
                    ...prev,
                    slug: generateSlug(formData.name)
                  }))
                }
              }}
            >
              Generate
            </Button>
          </div>
          <p className="text-sm text-muted-foreground">Leave empty to auto-generate from name</p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="parent">Parent Category</Label>
          <Select onValueChange={handleSelectChange} value={formData.parent_category_id || 'none'}>
            <SelectTrigger>
              <SelectValue placeholder="Select a parent category (optional)" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">None (Top Level Category)</SelectItem>
              {categories.map((category) => (
                <SelectItem key={category.category_id} value={category.category_id}>
                  {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex justify-end gap-4 pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push('/categories')}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Creating...' : 'Create Category'}
          </Button>
        </div>
      </form>
    </div>
  )
}
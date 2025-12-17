'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { toast } from 'sonner'
import { Category, CategoryWithChildren } from '@/lib/api/types/shared/category'
import { useCategoryStore } from '@/stores/category-store'

interface CategoryFormProps {
  initialData?: Category
  isEditing?: boolean
  onSuccess?: () => void
}

export function CategoryForm({ initialData, isEditing = false, onSuccess }: CategoryFormProps) {
  const router = useRouter()
  const { categories, createCategory, updateCategory } = useCategoryStore()
  const [formData, setFormData] = useState({
    name: initialData?.name || '',
    slug: initialData?.slug || '',
    parent_category_id: initialData?.parent_category_id || ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name,
        slug: initialData.slug,
        parent_category_id: initialData.parent_category_id || ''
      })
    }
  }, [initialData])

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
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const slug = formData.slug || generateSlug(formData.name)
      const data = {
        name: formData.name,
        slug,
        parent_category_id: formData.parent_category_id || null
      }

      if (isEditing && initialData) {
        const formData = new FormData()
        Object.entries(data).forEach(([key, value]) => {
          if (value !== null) {
            formData.append(key, value)
          }
        })
        await updateCategory(initialData.category_id, formData)
        toast.success('Category updated successfully')
      } else {
        await createCategory(data)
        toast.success('Category created successfully')
      }

      if (onSuccess) {
        onSuccess()
      } else {
        router.push('/categories')
      }
    } catch (error) {
      console.error('Error saving category:', error)
      toast.error(`Failed to ${isEditing ? 'update' : 'create'} category`)
    } finally {
      setIsSubmitting(false)
    }
  }

  // Filter out the current category and its children from parent options when editing
  const getAvailableParentCategories = () => {
    if (!isEditing || !initialData) return categories
    
    const filterCategoryAndChildren = (category: CategoryWithChildren, id: string): boolean => {
      if (category.category_id === id) return false
      if (category.children) {
        return !category.children.some(child => !filterCategoryAndChildren(child, id))
      }
      return true
    }

    return categories.filter(cat => filterCategoryAndChildren(cat, initialData.category_id))
  }

  return (
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
        <Input
          id="slug"
          name="slug"
          value={formData.slug}
          onChange={handleChange}
          placeholder="category-slug"
        />
        <p className="text-sm text-muted-foreground">
          Leave empty to auto-generate from name
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="parent_category_id">Parent Category</Label>
        <Select
          value={formData.parent_category_id || 'none'}
          onValueChange={handleSelectChange}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select a parent category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="none">None (Top-level category)</SelectItem>
            {getAvailableParentCategories().map((category) => (
              <SelectItem key={category.category_id} value={category.category_id}>
                {category.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex justify-end space-x-4 pt-4">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.push('/categories')}
          disabled={isSubmitting}
        >
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Saving...' : isEditing ? 'Update Category' : 'Create Category'}
        </Button>
      </div>
    </form>
  )
}
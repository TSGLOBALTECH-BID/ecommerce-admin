// src/components/product/product-form.tsx
'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { X } from 'lucide-react'
import Link from 'next/link'

type Variant = {
  variant_sku_suffix: string
  attributes: {
    weight: string
    packaging: string
    price: number
    stock: number
  }
}

export function ProductForm({ onAdd }: { onAdd?: () => void }) {
  const router = useRouter()
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [categoryIds, setCategoryIds] = useState<string[]>([])
  const [variants, setVariants] = useState<Variant[]>([
    {
      variant_sku_suffix: '',
      attributes: {
        weight: '',
        packaging: 'bag',
        price: 0,
        stock: 0,
      },
    },
  ])
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      const response = await fetch('/api/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          description,
          categoryIds,
          variants,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to add product')
      }

      const result = await response.json()
      toast.success('Product added successfully!')
      
      // If we're in a dialog, close it and call onAdd
      if (onAdd) {
        onAdd()
      } else {
        // If we're on a standalone page, redirect to products list
        router.push('/products')
        router.refresh()
      }

      // Reset form
      resetForm()
    } catch (error) {
      console.error('Error adding product:', error)
      toast.error('Failed to add product. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const resetForm = () => {
    setName('')
    setDescription('')
    setCategoryIds([])
    setVariants([
      {
        variant_sku_suffix: '',
        attributes: {
          weight: '',
          packaging: 'bag',
          price: 0,
          stock: 0,
        },
      },
    ])
  }

  const addVariant = () => {
    setVariants([
      ...variants,
      {
        variant_sku_suffix: '',
        attributes: {
          weight: '',
          packaging: 'bag',
          price: 0,
          stock: 0,
        },
      },
    ])
  }

  const updateVariant = (index: number, field: string, value: any) => {
    const newVariants = [...variants]
    if (field.includes('.')) {
      const [parent, child] = field.split('.')
      ;(newVariants[index] as any)[parent][child] = value
    } else {
      ;(newVariants[index] as any)[field] = value
    }
    setVariants(newVariants)
  }

  const removeVariant = (index: number) => {
    if (variants.length > 1) {
      setVariants(variants.filter((_, i) => i !== index))
    }
  }

  return (
    <div className="space-y-6">
    

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Product Name</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label>Categories</Label>
            <div className="flex flex-wrap gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => {
                  // This would open a category selector modal in a real app
                  console.log('Open category selector')
                }}
              >
                + Add Categories
              </Button>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium">Variants</h3>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={addVariant}
            >
              + Add Variant
            </Button>
          </div>

          <div className="space-y-4">
            {variants.map((variant, index) => (
              <div
                key={index}
                className="p-4 border rounded-lg space-y-4 relative"
              >
                {variants.length > 1 && (
                  <button
                    type="button"
                    className="absolute top-2 right-2 text-muted-foreground hover:text-destructive"
                    onClick={() => removeVariant(index)}
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor={`variant-suffix-${index}`}>
                      SKU Suffix (e.g., 250G)
                    </Label>
                    <Input
                      id={`variant-suffix-${index}`}
                      value={variant.variant_sku_suffix}
                      onChange={(e) =>
                        updateVariant(
                          index,
                          'variant_sku_suffix',
                          e.target.value
                        )
                      }
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor={`weight-${index}`}>Weight</Label>
                    <Input
                      id={`weight-${index}`}
                      value={variant.attributes.weight}
                      onChange={(e) =>
                        updateVariant(
                          index,
                          'attributes.weight',
                          e.target.value
                        )
                      }
                      placeholder="e.g., 250g"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor={`packaging-${index}`}>Packaging</Label>
                    <Select
                      value={variant.attributes.packaging}
                      onValueChange={(value) =>
                        updateVariant(
                          index,
                          'attributes.packaging',
                          value
                        )
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select packaging" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="bag">Bag</SelectItem>
                        <SelectItem value="bottle">Bottle</SelectItem>
                        <SelectItem value="box">Box</SelectItem>
                        <SelectItem value="jar">Jar</SelectItem>
                        <SelectItem value="tin">Tin</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor={`price-${index}`}>Price</Label>
                    <Input
                      id={`price-${index}`}
                      type="number"
                      min="0"
                      step="0.01"
                      value={variant.attributes.price}
                      onChange={(e) =>
                        updateVariant(
                          index,
                          'attributes.price',
                          parseFloat(e.target.value) || 0
                        )
                      }
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor={`stock-${index}`}>Stock</Label>
                    <Input
                      id={`stock-${index}`}
                      type="number"
                      min="0"
                      value={variant.attributes.stock}
                      onChange={(e) =>
                        updateVariant(
                          index,
                          'attributes.stock',
                          parseInt(e.target.value) || 0
                        )
                      }
                      required
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-end gap-2 pt-4 border-t">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push('/products')}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={loading}>
            {loading ? 'Saving...' : 'Save Product'}
          </Button>
        </div>
      </form>
    </div>
  )
}
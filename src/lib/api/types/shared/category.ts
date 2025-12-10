export type Category = {
  category_id: string
  name: string
  slug: string
  parent_category_id: string | null
  created_at: string
  product_count?: number
  parent_category_name?: string | null
}

export type CategoryWithChildren = Category & {
  children?: CategoryWithChildren[];
};
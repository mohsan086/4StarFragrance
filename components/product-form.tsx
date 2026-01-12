"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"
import { createClient } from "@/lib/supabase/client"
import { Loader2 } from "lucide-react"

interface Category {
  id: string
  name: string
}

interface Product {
  id: string
  name: string
  slug: string
  description: string
  price: number
  stock: number
  image_url: string | null
  category_id: string
  notes: string[] | null
  size: string | null
}

export function ProductForm({
  categories,
  product,
}: {
  categories: Category[]
  product?: Product
}) {
  const router = useRouter()
  const supabase = createClient()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [formData, setFormData] = useState({
    name: product?.name || "",
    slug: product?.slug || "",
    description: product?.description || "",
    price: product?.price || 0,
    stock: product?.stock || 0,
    image_url: product?.image_url || "",
    category_id: product?.category_id || categories[0]?.id || "",
    size: product?.size || "",
    top_notes: product?.notes?.[0] || "",
    middle_notes: product?.notes?.[1] || "",
    base_notes: product?.notes?.[2] || "",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const notesArray = [formData.top_notes, formData.middle_notes, formData.base_notes].filter(
        (note) => note.trim() !== "",
      )

      const productData = {
        name: formData.name,
        slug:
          formData.slug ||
          formData.name
            .toLowerCase()
            .replace(/\s+/g, "-")
            .replace(/[^a-z0-9-]/g, ""),
        description: formData.description,
        price: Number.parseFloat(formData.price.toString()),
        stock: Number.parseInt(formData.stock.toString()),
        image_url: formData.image_url || null,
        category_id: formData.category_id,
        size: formData.size || null,
        notes: notesArray.length > 0 ? notesArray : null,
      }

      if (product) {
        // Update existing product
        const { error } = await supabase.from("products").update(productData).eq("id", product.id)

        if (error) throw error
      } else {
        // Create new product
        const { error } = await supabase.from("products").insert(productData)

        if (error) throw error
      }

      router.push("/admin/products")
      router.refresh()
    } catch (err: any) {
      setError(err.message || "An error occurred")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card>
      <CardContent className="p-4 md:p-6">
        <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6">
          {error && (
            <div className="p-3 md:p-4 bg-destructive/10 text-destructive rounded-lg text-xs md:text-sm">{error}</div>
          )}

          <div className="space-y-2">
            <Label htmlFor="name" className="text-sm md:text-base">
              Product Name *
            </Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
              className="text-sm md:text-base"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="slug" className="text-sm md:text-base">
              URL Slug
            </Label>
            <Input
              id="slug"
              value={formData.slug}
              onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
              placeholder="auto-generated-from-name"
              className="text-sm md:text-base"
            />
            <p className="text-xs text-muted-foreground">Leave empty to auto-generate from product name</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description" className="text-sm md:text-base">
              Description *
            </Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={4}
              required
              className="text-sm md:text-base"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="price" className="text-sm md:text-base">
                Price (Rs.) *
              </Label>
              <Input
                id="price"
                type="number"
                min="0"
                step="0.01"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: Number.parseFloat(e.target.value) })}
                required
                className="text-sm md:text-base"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="stock" className="text-sm md:text-base">
                Stock Quantity *
              </Label>
              <Input
                id="stock"
                type="number"
                min="0"
                value={formData.stock}
                onChange={(e) => setFormData({ ...formData, stock: Number.parseInt(e.target.value) })}
                required
                className="text-sm md:text-base"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="size" className="text-sm md:text-base">
                Size
              </Label>
              <Input
                id="size"
                value={formData.size}
                onChange={(e) => setFormData({ ...formData, size: e.target.value })}
                placeholder="e.g., 50ml, 100ml"
                className="text-sm md:text-base"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="category" className="text-sm md:text-base">
              Category *
            </Label>
            <select
              id="category"
              value={formData.category_id}
              onChange={(e) => setFormData({ ...formData, category_id: e.target.value })}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm md:text-base ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              required
            >
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="image_url" className="text-sm md:text-base">
              Image URL
            </Label>
            <Input
              id="image_url"
              type="url"
              value={formData.image_url}
              onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
              placeholder="https://example.com/image.jpg"
              className="text-sm md:text-base"
            />
          </div>

          <div className="space-y-4 border-t pt-4">
            <h3 className="font-semibold text-sm md:text-base">Fragrance Notes (Optional)</h3>

            <div className="space-y-2">
              <Label htmlFor="top_notes" className="text-sm md:text-base">
                Top Notes
              </Label>
              <Input
                id="top_notes"
                value={formData.top_notes}
                onChange={(e) => setFormData({ ...formData, top_notes: e.target.value })}
                placeholder="e.g., Bergamot, Lemon, Orange"
                className="text-sm md:text-base"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="middle_notes" className="text-sm md:text-base">
                Middle/Heart Notes
              </Label>
              <Input
                id="middle_notes"
                value={formData.middle_notes}
                onChange={(e) => setFormData({ ...formData, middle_notes: e.target.value })}
                placeholder="e.g., Rose, Jasmine, Lavender"
                className="text-sm md:text-base"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="base_notes" className="text-sm md:text-base">
                Base Notes
              </Label>
              <Input
                id="base_notes"
                value={formData.base_notes}
                onChange={(e) => setFormData({ ...formData, base_notes: e.target.value })}
                placeholder="e.g., Vanilla, Musk, Amber"
                className="text-sm md:text-base"
              />
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 md:gap-4">
            <Button type="submit" disabled={loading} className="flex-1 text-sm md:text-base">
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {product ? "Update Product" : "Create Product"}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push("/admin/products")}
              disabled={loading}
              className="text-sm md:text-base"
            >
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}

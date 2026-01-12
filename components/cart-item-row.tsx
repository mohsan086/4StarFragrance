"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Minus, Plus, Trash2 } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import { useState } from "react"

interface CartItemRowProps {
  item: {
    id: string
    quantity: number
    products: {
      id: string
      name: string
      price: number
      image_url?: string
      slug: string
      stock: number
    }
  }
}

export function CartItemRow({ item }: CartItemRowProps) {
  const [isUpdating, setIsUpdating] = useState(false)
  const router = useRouter()

  const updateQuantity = async (newQuantity: number) => {
    if (newQuantity < 1 || newQuantity > item.products.stock) return

    setIsUpdating(true)
    const supabase = createClient()

    try {
      await supabase.from("cart_items").update({ quantity: newQuantity }).eq("id", item.id)
      router.refresh()
    } catch (error) {
      console.error("[v0] Error updating quantity:", error)
    } finally {
      setIsUpdating(false)
    }
  }

  const removeItem = async () => {
    setIsUpdating(true)
    const supabase = createClient()

    try {
      await supabase.from("cart_items").delete().eq("id", item.id)
      router.refresh()
    } catch (error) {
      console.error("[v0] Error removing item:", error)
    } finally {
      setIsUpdating(false)
    }
  }

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex gap-4">
          <div className="w-24 h-24 flex-shrink-0 overflow-hidden rounded-lg bg-secondary">
            {item.products.image_url ? (
              <img
                src={item.products.image_url || "/placeholder.svg"}
                alt={item.products.name}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="h-full w-full bg-secondary flex items-center justify-center">
                <span className="text-3xl">🌸</span>
              </div>
            )}
          </div>
          <div className="flex-1 flex flex-col justify-between">
            <div>
              <h3 className="font-semibold">{item.products.name}</h3>
              <p className="text-sm text-primary font-semibold mt-1">Rs. {item.products.price.toLocaleString()}</p>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8 bg-transparent"
                  onClick={() => updateQuantity(item.quantity - 1)}
                  disabled={isUpdating || item.quantity <= 1}
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <span className="w-8 text-center font-medium">{item.quantity}</span>
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8 bg-transparent"
                  onClick={() => updateQuantity(item.quantity + 1)}
                  disabled={isUpdating || item.quantity >= item.products.stock}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex items-center gap-4">
                <p className="font-semibold">Rs. {(item.products.price * item.quantity).toLocaleString()}</p>
                <Button variant="ghost" size="icon" onClick={removeItem} disabled={isUpdating}>
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

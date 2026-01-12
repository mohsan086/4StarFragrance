"use client"

import type React from "react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import { useState } from "react"

interface CheckoutFormProps {
  cartItems: Array<{
    id: string
    quantity: number
    products: {
      id: string
      name: string
      price: number
      stock: number
    }
  }>
  profile: {
    full_name?: string
    phone?: string
    address?: string
    city?: string
  } | null
  total: number
  userId: string
}

export function CheckoutForm({ cartItems, profile, total, userId }: CheckoutFormProps) {
  const [formData, setFormData] = useState({
    fullName: profile?.full_name || "",
    phone: profile?.phone || "",
    address: profile?.address || "",
    city: profile?.city || "",
    notes: "",
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    // Validate required fields
    if (!formData.fullName || !formData.phone || !formData.address || !formData.city) {
      setError("Please fill in all required fields")
      setIsLoading(false)
      return
    }

    const supabase = createClient()

    try {
      // Create order in database
      const { data: order, error: orderError } = await supabase
        .from("orders")
        .insert({
          user_id: userId,
          total,
          shipping_address: formData.address,
          shipping_city: formData.city,
          shipping_postal_code: null,
          phone: formData.phone,
          notes: formData.notes || null,
          status: "pending",
        })
        .select()
        .single()

      if (orderError) throw orderError

      // Create order items
      const orderItems = cartItems.map((item) => ({
        order_id: order.id,
        product_id: item.products.id,
        product_name: item.products.name,
        product_price: item.products.price,
        quantity: item.quantity,
      }))

      const { error: itemsError } = await supabase.from("order_items").insert(orderItems)

      if (itemsError) throw itemsError

      // Update product stock
      for (const item of cartItems) {
        const { error: stockError } = await supabase
          .from("products")
          .update({ stock: item.products.stock - item.quantity })
          .eq("id", item.products.id)

        if (stockError) throw stockError
      }

      // Clear cart
      const { error: cartError } = await supabase.from("cart_items").delete().eq("user_id", userId)

      if (cartError) throw cartError

      // Update profile
      await supabase
        .from("profiles")
        .update({
          full_name: formData.fullName,
          phone: formData.phone,
          address: formData.address,
          city: formData.city,
        })
        .eq("id", userId)

      // Format order items for WhatsApp message
      const itemsList = cartItems
        .map(
          (item) =>
            `${item.products.name} × ${item.quantity} - Rs. ${(item.products.price * item.quantity).toLocaleString()}`,
        )
        .join("%0A")

      // Create WhatsApp message with order ID
      const message =
        `*New Order from 4 Star Fragrance*%0A%0A` +
        `*Order ID:* ${order.id}%0A%0A` +
        `*Customer Details:*%0A` +
        `Name: ${formData.fullName}%0A` +
        `Phone: ${formData.phone}%0A` +
        `Address: ${formData.address}%0A` +
        `City: ${formData.city}%0A%0A` +
        `*Order Items:*%0A${itemsList}%0A%0A` +
        `*Subtotal:* Rs. ${total.toLocaleString()}%0A` +
        `*Shipping:* Free%0A` +
        `*Total:* Rs. ${total.toLocaleString()}%0A%0A` +
        (formData.notes ? `*Notes:* ${formData.notes}` : "")

      // Replace with your WhatsApp number (use international format without + sign)
      // Example: For Pakistan number +92 300 1234567, use 923001234567
      const whatsappNumber = "923705168493" // TODO: Replace with your actual WhatsApp number

      // Open WhatsApp with pre-filled message
      const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${message}`
      window.open(whatsappUrl, "_blank")

      // Redirect to order success page
      router.push(`/order-success/${order.id}`)
    } catch (error) {
      console.error("[v0] Error creating order:", error)
      setError("Failed to place order. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg md:text-xl">Shipping Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="fullName" className="text-sm md:text-base">
                  Full Name
                </Label>
                <Input
                  id="fullName"
                  required
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  className="text-sm md:text-base"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="phone" className="text-sm md:text-base">
                  Phone Number
                </Label>
                <Input
                  id="phone"
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="text-sm md:text-base"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="address" className="text-sm md:text-base">
                  Street Address
                </Label>
                <Textarea
                  id="address"
                  required
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="text-sm md:text-base min-h-[80px]"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="city" className="text-sm md:text-base">
                  City
                </Label>
                <Input
                  id="city"
                  required
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  className="text-sm md:text-base"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="notes" className="text-sm md:text-base">
                  Order Notes (Optional)
                </Label>
                <Textarea
                  id="notes"
                  placeholder="Any special instructions for your order"
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="text-sm md:text-base min-h-[80px]"
                />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-1">
          <Card className="lg:sticky lg:top-20">
            <CardHeader>
              <CardTitle className="text-lg md:text-xl">Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex justify-between text-xs md:text-sm gap-2">
                    <span className="truncate">
                      {item.products.name} × {item.quantity}
                    </span>
                    <span className="whitespace-nowrap">
                      Rs. {(item.products.price * item.quantity).toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>
              <div className="space-y-2 pt-4 border-t border-border">
                <div className="flex justify-between text-xs md:text-sm">
                  <span>Subtotal</span>
                  <span>Rs. {total.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-xs md:text-sm">
                  <span>Shipping</span>
                  <span className="text-green-600">Free</span>
                </div>
              </div>
              <div className="flex justify-between font-semibold text-base md:text-lg pt-4 border-t border-border">
                <span>Total</span>
                <span className="text-primary">Rs. {total.toLocaleString()}</span>
              </div>
              {error && <p className="text-xs md:text-sm text-destructive">{error}</p>}
              <Button type="submit" className="w-full text-sm md:text-base" size="lg" disabled={isLoading}>
                {isLoading ? "Processing..." : "Send"}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </form>
  )
}

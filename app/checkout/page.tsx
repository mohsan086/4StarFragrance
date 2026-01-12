import { createClient } from "@/lib/supabase/server"
import { Navbar } from "@/components/navbar"
import { redirect } from "next/navigation"
import { CheckoutForm } from "@/components/checkout-form"

export default async function CheckoutPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  const { data: cartItems } = await supabase.from("cart_items").select("*, products(*)").eq("user_id", user.id)

  if (!cartItems || cartItems.length === 0) {
    redirect("/cart")
  }

  const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single()

  const total = cartItems.reduce((sum, item) => sum + item.products.price * item.quantity, 0)

  return (
    <div className="min-h-screen">
      <Navbar />

      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        <h1 className="font-serif text-3xl sm:text-4xl font-bold mb-6 md:mb-8">Checkout</h1>
        <CheckoutForm cartItems={cartItems} profile={profile} total={total} userId={user.id} />
      </div>
    </div>
  )
}

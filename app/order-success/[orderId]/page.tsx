import { createClient } from "@/lib/supabase/server"
import { Navbar } from "@/components/navbar"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CheckCircle } from "lucide-react"
import Link from "next/link"
import { redirect } from "next/navigation"

export default async function OrderSuccessPage({ params }: { params: Promise<{ orderId: string }> }) {
  const { orderId } = await params
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  const { data: order } = await supabase.from("orders").select("*").eq("id", orderId).eq("user_id", user.id).single()

  if (!order) {
    redirect("/")
  }

  return (
    <div className="min-h-screen">
      <Navbar />

      <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8 py-12">
        <Card>
          <CardContent className="p-12 text-center space-y-6">
            <CheckCircle className="h-16 w-16 text-green-600 mx-auto" />
            <h1 className="font-serif text-3xl font-bold">Order Placed Successfully!</h1>
            <p className="text-muted-foreground">Thank you for your purchase. Your order has been received.</p>
            <div className="bg-secondary p-4 rounded-lg">
              <p className="text-sm text-muted-foreground mb-1">Order Number</p>
              <p className="font-mono font-semibold">{order.id.slice(0, 8).toUpperCase()}</p>
            </div>
            <div className="space-y-2 pt-4 border-t border-border">
              <div className="flex justify-between">
                <span className="text-sm">Status</span>
                <span className="text-sm font-medium capitalize">{order.status}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Total</span>
                <span className="text-sm font-semibold text-primary">Rs. {order.total.toLocaleString()}</span>
              </div>
            </div>
            <p className="text-sm text-muted-foreground">
              We&apos;ll send you a confirmation email with tracking information once your order ships.
            </p>
            <div className="flex gap-4 justify-center pt-4">
              <Button asChild>
                <Link href="/account/orders">View Orders</Link>
              </Button>
              <Button asChild variant="outline">
                <Link href="/products">Continue Shopping</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { OrderStatusBadge } from "@/components/order-status-badge"
import { UpdateOrderStatus } from "@/components/update-order-status"

export default async function AdminOrdersPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  const { data: isAdmin } = await supabase.rpc("is_user_admin", { user_id: user.id })

  if (!isAdmin) {
    redirect("/")
  }

  const { data: orders } = await supabase
    .from("orders")
    .select("*, profiles(full_name), order_items(*, products(name), product_price)")
    .order("created_at", { ascending: false })

  return (
    <div className="min-h-screen bg-background">
      <nav className="border-b border-border bg-card">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <Link href="/admin" className="font-serif text-lg md:text-2xl font-bold">
              Admin Dashboard
            </Link>
            <Button asChild variant="outline" size="sm" className="text-xs md:text-sm bg-transparent">
              <Link href="/">View Store</Link>
            </Button>
          </div>
        </div>
      </nav>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        <div className="flex items-center justify-between mb-6 md:mb-8">
          <h1 className="font-serif text-2xl sm:text-3xl md:text-4xl font-bold">Orders</h1>
        </div>

        {orders && orders.length > 0 ? (
          <div className="space-y-4">
            {orders.map((order) => (
              <Card key={order.id}>
                <CardContent className="p-4 md:p-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 md:gap-6">
                    <div>
                      <p className="text-xs md:text-sm text-muted-foreground mb-1">Order ID</p>
                      <p className="font-mono font-semibold text-xs md:text-base">
                        {order.id.slice(0, 8).toUpperCase()}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs md:text-sm text-muted-foreground mb-1">Date</p>
                      <p className="text-xs md:text-sm font-medium">
                        {new Date(order.created_at).toLocaleDateString("en-GB", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        })}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs md:text-sm text-muted-foreground mb-1">Customer</p>
                      <p className="font-medium text-sm md:text-base truncate">{order.profiles?.full_name || "N/A"}</p>
                    </div>
                    <div>
                      <p className="text-xs md:text-sm text-muted-foreground mb-1">Total</p>
                      <p className="font-semibold text-primary text-sm md:text-base">
                        Rs. {order.total.toLocaleString()}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs md:text-sm text-muted-foreground mb-1">Status</p>
                      <OrderStatusBadge status={order.status} />
                    </div>
                  </div>
                  <div className="mt-4 pt-4 border-t border-border">
                    <p className="text-xs md:text-sm font-medium mb-2">Items:</p>
                    <ul className="text-xs md:text-sm text-muted-foreground space-y-1">
                      {order.order_items?.map(
                        (item: { id: string; products: { name: string }; quantity: number; product_price: number }) => (
                          <li key={item.id} className="truncate">
                            {item.products.name} × {item.quantity} - Rs.{" "}
                            {(item.product_price * item.quantity).toLocaleString()}
                          </li>
                        ),
                      )}
                    </ul>
                  </div>
                  <div className="mt-4 pt-4 border-t border-border">
                    <p className="text-xs md:text-sm font-medium mb-2">Shipping Address:</p>
                    <p className="text-xs md:text-sm text-muted-foreground">
                      {order.shipping_address}, {order.shipping_city}
                    </p>
                    <p className="text-xs md:text-sm text-muted-foreground mt-1">Phone: {order.phone}</p>
                  </div>
                  {order.notes && (
                    <div className="mt-4 pt-4 border-t border-border">
                      <p className="text-xs md:text-sm font-medium mb-2">Customer Notes:</p>
                      <p className="text-xs md:text-sm text-muted-foreground italic">{order.notes}</p>
                    </div>
                  )}
                  <div className="mt-4 pt-4 border-t border-border flex flex-col sm:flex-row gap-2">
                    <UpdateOrderStatus orderId={order.id} currentStatus={order.status} />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="p-12 text-center">
              <p className="text-muted-foreground">No orders found</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}

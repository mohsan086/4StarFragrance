import { createClient } from "@/lib/supabase/server"
import { Navbar } from "@/components/navbar"
import { redirect } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { OrderStatusBadge } from "@/components/order-status-badge"

export default async function OrdersPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  const { data: orders } = await supabase
    .from("orders")
    .select("*, order_items(*, products(name, image_url))")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })

  return (
    <div className="min-h-screen">
      <Navbar />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <h1 className="font-serif text-3xl sm:text-4xl font-bold mb-6 sm:mb-8">Order History</h1>

        {orders && orders.length > 0 ? (
          <div className="space-y-4 sm:space-y-6">
            {orders.map((order) => (
              <Card key={order.id}>
                <CardContent className="p-4 sm:p-6">
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 sm:gap-0 mb-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Order ID</p>
                      <p className="font-mono font-semibold text-sm sm:text-base">
                        {order.id.slice(0, 8).toUpperCase()}
                      </p>
                    </div>
                    <OrderStatusBadge status={order.status} />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mb-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Order Date</p>
                      <p className="text-sm font-medium">
                        {new Date(order.created_at).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Total</p>
                      <p className="text-sm font-semibold text-primary">Rs. {order.total.toLocaleString()}</p>
                    </div>
                  </div>

                  <div className="border-t border-border pt-4">
                    <p className="text-sm font-medium mb-3">Items:</p>
                    <div className="space-y-3">
                      {order.order_items?.map(
                        (item: {
                          id: string
                          products: { name: string; image_url?: string }
                          quantity: number
                          product_price: number
                        }) => (
                          <div key={item.id} className="flex gap-3">
                            <div className="w-12 h-12 sm:w-16 sm:h-16 flex-shrink-0 overflow-hidden rounded bg-secondary">
                              {item.products.image_url ? (
                                <img
                                  src={item.products.image_url || "/placeholder.svg"}
                                  alt={item.products.name}
                                  className="h-full w-full object-cover"
                                />
                              ) : (
                                <div className="h-full w-full bg-secondary flex items-center justify-center">
                                  <span className="text-2xl">🌸</span>
                                </div>
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium truncate">{item.products.name}</p>
                              <p className="text-sm text-muted-foreground">Quantity: {item.quantity}</p>
                              <p className="text-sm font-semibold text-primary">
                                Rs. {item.product_price.toLocaleString()}
                              </p>
                            </div>
                          </div>
                        ),
                      )}
                    </div>
                  </div>

                  <div className="border-t border-border pt-4 mt-4">
                    <p className="text-sm font-medium mb-1">Shipping Address:</p>
                    <p className="text-sm text-muted-foreground">
                      {order.shipping_address}, {order.shipping_city} {order.shipping_postal_code}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="p-12 text-center">
              <p className="text-muted-foreground">No orders yet</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}

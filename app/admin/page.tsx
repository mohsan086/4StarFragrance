import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Package, ShoppingCart, Users, DollarSign } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default async function AdminDashboardPage() {
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

  // Get statistics
  const { count: productsCount } = await supabase.from("products").select("*", { count: "exact", head: true })

  const { count: ordersCount } = await supabase.from("orders").select("*", { count: "exact", head: true })

  const { count: usersCount } = await supabase.from("profiles").select("*", { count: "exact", head: true })

  const { data: orders } = await supabase.from("orders").select("total")

  const totalRevenue = orders?.reduce((sum, order) => sum + Number(order.total), 0) || 0

  const { data: recentOrders } = await supabase
    .from("orders")
    .select(`
      *,
      profiles:user_id (full_name)
    `)
    .order("created_at", { ascending: false })
    .limit(5)

  return (
    <div className="min-h-screen bg-background">
      <nav className="border-b border-border bg-card">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between gap-4">
            <div className="flex items-center gap-4 md:gap-8 min-w-0">
              <Link href="/admin" className="font-serif text-lg md:text-2xl font-bold truncate">
                Admin
              </Link>
              <div className="hidden sm:flex items-center gap-3 md:gap-6">
                <Link
                  href="/admin/products"
                  className="text-xs md:text-sm font-medium hover:text-primary transition-colors whitespace-nowrap"
                >
                  Products
                </Link>
                <Link
                  href="/admin/orders"
                  className="text-xs md:text-sm font-medium hover:text-primary transition-colors whitespace-nowrap"
                >
                  Orders
                </Link>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button asChild variant="outline" size="sm" className="text-xs md:text-sm bg-transparent">
                <Link href="/">Store</Link>
              </Button>
            </div>
          </div>
        </div>
      </nav>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        <h1 className="font-serif text-2xl sm:text-3xl md:text-4xl font-bold mb-6 md:mb-8">Dashboard Overview</h1>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6 mb-6 md:mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-xs md:text-sm font-medium text-muted-foreground">Products</CardTitle>
              <Package className="h-3 w-3 md:h-4 md:w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-xl md:text-2xl font-bold">{productsCount || 0}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-xs md:text-sm font-medium text-muted-foreground">Orders</CardTitle>
              <ShoppingCart className="h-3 w-3 md:h-4 md:w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-xl md:text-2xl font-bold">{ordersCount || 0}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-xs md:text-sm font-medium text-muted-foreground">Users</CardTitle>
              <Users className="h-3 w-3 md:h-4 md:w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-xl md:text-2xl font-bold">{usersCount || 0}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-xs md:text-sm font-medium text-muted-foreground">Revenue</CardTitle>
              <DollarSign className="h-3 w-3 md:h-4 md:w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-lg md:text-2xl font-bold">Rs. {totalRevenue.toLocaleString()}</div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 mb-6 md:mb-8">
          <Card className="hover:shadow-lg transition-shadow">
            <CardContent className="p-4 md:p-6">
              <h3 className="font-semibold text-base md:text-lg mb-2">Manage Products</h3>
              <p className="text-xs md:text-sm text-muted-foreground mb-4">Add, edit, or remove products</p>
              <Button asChild className="w-full text-sm">
                <Link href="/admin/products">Go to Products</Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardContent className="p-4 md:p-6">
              <h3 className="font-semibold text-base md:text-lg mb-2">Manage Orders</h3>
              <p className="text-xs md:text-sm text-muted-foreground mb-4">View and update orders</p>
              <Button asChild className="w-full text-sm">
                <Link href="/admin/orders">Go to Orders</Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardContent className="p-4 md:p-6">
              <h3 className="font-semibold text-base md:text-lg mb-2">Manage Categories</h3>
              <p className="text-xs md:text-sm text-muted-foreground mb-4">Organize products</p>
              <Button asChild className="w-full text-sm">
                <Link href="/admin/categories">Go to Categories</Link>
              </Button>
            </CardContent>
          </Card>
        </div>

        {recentOrders && recentOrders.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <span className="text-lg md:text-xl">Recent Orders</span>
                <Button
                  asChild
                  variant="outline"
                  size="sm"
                  className="w-full sm:w-auto text-xs md:text-sm bg-transparent"
                >
                  <Link href="/admin/orders">View All</Link>
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 md:space-y-4">
                {recentOrders.map((order) => (
                  <div
                    key={order.id}
                    className="flex flex-col sm:flex-row sm:items-center justify-between p-3 md:p-4 border border-border rounded-lg hover:bg-accent/5 transition-colors gap-3"
                  >
                    <div className="space-y-1">
                      <p className="font-semibold text-sm md:text-base truncate">
                        {order.profiles?.full_name || "Unknown"}
                      </p>
                      <p className="text-xs md:text-sm text-muted-foreground">
                        {new Date(order.created_at).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </p>
                    </div>
                    <div className="flex items-center justify-between sm:justify-end gap-3 md:gap-4">
                      <span className="font-semibold text-sm md:text-base">
                        Rs. {Number(order.total).toLocaleString()}
                      </span>
                      <span
                        className={`px-2 py-1 text-xs font-medium rounded-full whitespace-nowrap ${
                          order.status === "delivered"
                            ? "bg-green-500/10 text-green-500"
                            : order.status === "processing"
                              ? "bg-blue-500/10 text-blue-500"
                              : order.status === "shipped"
                                ? "bg-purple-500/10 text-purple-500"
                                : order.status === "cancelled"
                                  ? "bg-red-500/10 text-red-500"
                                  : "bg-yellow-500/10 text-yellow-500"
                        }`}
                      >
                        {order.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}

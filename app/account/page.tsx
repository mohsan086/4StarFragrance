import { createClient } from "@/lib/supabase/server"
import { Navbar } from "@/components/navbar"
import { redirect } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Package, User } from "lucide-react"
import { SignOutButton } from "@/components/sign-out-button"

export default async function AccountPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single()

  const { count: ordersCount } = await supabase
    .from("orders")
    .select("*", { count: "exact", head: true })
    .eq("user_id", user.id)

  return (
    <div className="min-h-screen">
      <Navbar />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        <h1 className="font-serif text-3xl sm:text-4xl font-bold mb-6 md:mb-8">My Account</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Account Info */}
          <div className="md:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg md:text-xl">Account Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-xs md:text-sm text-muted-foreground mb-1">Email</p>
                  <p className="font-medium text-sm md:text-base break-all">{user.email}</p>
                </div>
                <div>
                  <p className="text-xs md:text-sm text-muted-foreground mb-1">Full Name</p>
                  <p className="font-medium text-sm md:text-base">{profile?.full_name || "Not set"}</p>
                </div>
                <div>
                  <p className="text-xs md:text-sm text-muted-foreground mb-1">Phone</p>
                  <p className="font-medium text-sm md:text-base">{profile?.phone || "Not set"}</p>
                </div>
                <div>
                  <p className="text-xs md:text-sm text-muted-foreground mb-1">Address</p>
                  <p className="font-medium text-sm md:text-base">
                    {profile?.address
                      ? `${profile.address}, ${profile.city || ""} ${profile.postal_code || ""}`
                      : "Not set"}
                  </p>
                </div>
                <Button asChild variant="outline" className="bg-transparent w-full sm:w-auto text-sm md:text-base">
                  <Link href="/account/edit">Edit Profile</Link>
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <CardTitle className="text-lg md:text-xl">Order History</CardTitle>
                  <Button
                    asChild
                    variant="outline"
                    size="sm"
                    className="bg-transparent w-full sm:w-auto text-xs md:text-sm"
                  >
                    <Link href="/account/orders">View All</Link>
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm md:text-base text-muted-foreground">You have {ordersCount || 0} orders</p>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <div className="space-y-6">
            <Card>
              <CardContent className="p-4 md:p-6 space-y-3 md:space-y-4">
                <h3 className="font-semibold text-base md:text-lg">Quick Actions</h3>
                <Button asChild variant="outline" className="w-full justify-start bg-transparent text-sm md:text-base">
                  <Link href="/account/orders">
                    <Package className="mr-2 h-4 w-4" />
                    My Orders
                  </Link>
                </Button>
                <Button asChild variant="outline" className="w-full justify-start bg-transparent text-sm md:text-base">
                  <Link href="/account/edit">
                    <User className="mr-2 h-4 w-4" />
                    Edit Profile
                  </Link>
                </Button>
                {profile?.is_admin && (
                  <Button
                    asChild
                    variant="outline"
                    className="w-full justify-start bg-transparent text-sm md:text-base"
                  >
                    <Link href="/admin">Admin Dashboard</Link>
                  </Button>
                )}
                <SignOutButton />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

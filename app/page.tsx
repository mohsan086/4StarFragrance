import { createClient } from "@/lib/supabase/server"
import { Navbar } from "@/components/navbar"
import { ProductCard } from "@/components/product-card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowRight } from "lucide-react"

export default async function HomePage() {
  const supabase = await createClient()

  const { data: featuredProducts } = await supabase.from("products").select("*").eq("featured", true).limit(3)

  return (
    <div className="min-h-screen">
      <Navbar />

      {/* Hero Section */}
      <section className="relative min-h-[500px] md:h-[600px] bg-gradient-to-br from-secondary via-background to-accent/10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 h-full flex items-center py-12 md:py-0">
          <div className="max-w-2xl space-y-4 md:space-y-6">
            <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-balance">
              Luxury Fragrances for Every Moment
            </h1>
            <p className="text-base sm:text-lg md:text-xl text-muted-foreground text-pretty">
              Discover our exquisite collection of premium perfumes, crafted to embody elegance and sophistication.
            </p>
            <div className="flex gap-4">
              <Button asChild size="lg" className="font-semibold">
                <Link href="/products">
                  Explore Collection
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-12 md:py-16 bg-card">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-3 md:space-y-4 mb-8 md:mb-12">
            <h2 className="font-serif text-3xl md:text-4xl font-bold">Featured Fragrances</h2>
            <p className="text-sm md:text-base text-muted-foreground max-w-2xl mx-auto">
              Hand-selected luxury perfumes that define sophistication
            </p>
          </div>
          {featuredProducts && featuredProducts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  id={product.id}
                  name={product.name}
                  price={product.price}
                  image_url={product.image_url}
                  slug={product.slug}
                  description={product.description}
                />
              ))}
            </div>
          ) : (
            <p className="text-center text-muted-foreground">No featured products available</p>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-card py-8 md:py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
            <div className="space-y-4">
              <h3 className="font-serif text-lg font-bold">4 Star Fragrance</h3>
              <p className="text-sm text-muted-foreground">
                Premium luxury fragrances crafted for elegance and sophistication.
              </p>
            </div>
            <div className="space-y-4">
              <h4 className="font-semibold">Shop</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link href="/products" className="hover:text-primary transition-colors">
                    All Products
                  </Link>
                </li>
              </ul>
            </div>
            <div className="space-y-4">
              <h4 className="font-semibold">Account</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link href="/account" className="hover:text-primary transition-colors">
                    My Account
                  </Link>
                </li>
                <li>
                  <Link href="/account/orders" className="hover:text-primary transition-colors">
                    Orders
                  </Link>
                </li>
                <li>
                  <Link href="/cart" className="hover:text-primary transition-colors">
                    Shopping Cart
                  </Link>
                </li>
              </ul>
            </div>
            <div className="space-y-4">
              <h4 className="font-semibold">Contact</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>Karachi, Pakistan</li>
                <li>contact@4starfragrance.com</li>
                <li>+92 300 1234567</li>
              </ul>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-border text-center text-sm text-muted-foreground">
            <p>&copy; 2026 4 Star Fragrance. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

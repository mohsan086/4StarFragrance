import { createClient } from "@/lib/supabase/server"
import { Navbar } from "@/components/navbar"
import { Card, CardContent } from "@/components/ui/card"
import { notFound } from "next/navigation"
import { AddToCartButton } from "@/components/add-to-cart-button"

export default async function ProductDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const supabase = await createClient()

  const { data: product } = await supabase
    .from("products")
    .select("*, categories(name, slug)")
    .eq("slug", slug)
    .single()

  if (!product) {
    notFound()
  }

  return (
    <div className="min-h-screen">
      <Navbar />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8 lg:gap-12">
          {/* Product Image */}
          <div className="space-y-4">
            <div className="aspect-square overflow-hidden rounded-lg bg-secondary">
              {product.image_url ? (
                <img
                  src={product.image_url || "/placeholder.svg"}
                  alt={product.name}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="h-full w-full bg-secondary flex items-center justify-center">
                  <span className="text-7xl md:text-9xl">🌸</span>
                </div>
              )}
            </div>
          </div>

          {/* Product Details */}
          <div className="space-y-4 md:space-y-6">
            {product.categories && <p className="text-sm font-medium text-primary">{product.categories.name}</p>}
            <h1 className="font-serif text-3xl sm:text-4xl font-bold text-balance">{product.name}</h1>
            <p className="text-2xl md:text-3xl font-bold text-primary">Rs. {product.price.toLocaleString()}</p>

            {product.size && (
              <div className="flex items-center gap-2 text-sm md:text-base">
                <span className="font-medium">Size:</span>
                <span className="text-muted-foreground">{product.size}</span>
              </div>
            )}

            {product.stock !== null && product.stock !== undefined && (
              <div className="flex items-center gap-2 text-sm md:text-base">
                <span className="font-medium">Availability:</span>
                <span className={`${product.stock > 0 ? "text-green-600" : "text-destructive"}`}>
                  {product.stock > 0 ? `${product.stock} in stock` : "Out of stock"}
                </span>
              </div>
            )}

            <p className="text-sm md:text-base text-muted-foreground leading-relaxed text-pretty">
              {product.description}
            </p>

            {/* Fragrance Notes */}
            {product.notes && product.notes.length > 0 && (
              <Card>
                <CardContent className="p-4 md:p-6 space-y-3 md:space-y-4">
                  <h3 className="font-serif text-lg md:text-xl font-semibold">Fragrance Notes</h3>
                  <div className="space-y-2 md:space-y-3">
                    {product.notes.map((note: string, index: number) => (
                      <div key={index} className="flex flex-col sm:flex-row gap-1 sm:gap-3">
                        <div className="flex-shrink-0 w-full sm:w-20 text-xs md:text-sm font-medium text-muted-foreground">
                          {index === 0 ? "Top" : index === 1 ? "Heart" : "Base"}
                        </div>
                        <div className="text-sm md:text-base">{note}</div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            <AddToCartButton productId={product.id} productStock={product.stock || 0} />
          </div>
        </div>
      </div>
    </div>
  )
}

import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"

interface ProductCardProps {
  id: string
  name: string
  price: number
  image_url?: string
  slug: string
  description?: string
}

export function ProductCard({ id, name, price, image_url, slug, description }: ProductCardProps) {
  return (
    <Link href={`/products/${slug}`}>
      <Card className="group overflow-hidden border-border hover:shadow-lg transition-all duration-300">
        <div className="aspect-square overflow-hidden bg-secondary">
          {image_url ? (
            <img
              src={image_url || "/placeholder.svg"}
              alt={name}
              className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="h-full w-full bg-secondary flex items-center justify-center">
              <span className="text-6xl">🌸</span>
            </div>
          )}
        </div>
        <CardContent className="p-4 space-y-2">
          <h3 className="font-serif text-lg font-semibold line-clamp-1">{name}</h3>
          {description && <p className="text-sm text-muted-foreground line-clamp-2">{description}</p>}
          <p className="font-semibold text-primary">Rs. {price.toLocaleString()}</p>
        </CardContent>
      </Card>
    </Link>
  )
}

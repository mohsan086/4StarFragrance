import { createBrowserClient } from "@supabase/ssr"

export interface CartItem {
  id: string
  product_id: string
  quantity: number
  products: {
    name: string
    price: number
    image_url: string
    slug: string
    stock_quantity: number
  }
}

export async function getCartItems(): Promise<CartItem[]> {
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  )

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return []

  const { data, error } = await supabase
    .from("cart_items")
    .select(
      `
      id,
      product_id,
      quantity,
      products (
        name,
        price,
        image_url,
        slug,
        stock_quantity
      )
    `,
    )
    .eq("user_id", user.id)

  if (error) {
    console.error("Error fetching cart:", error)
    return []
  }

  return data as CartItem[]
}

export async function getCartCount(): Promise<number> {
  const items = await getCartItems()
  return items.reduce((sum, item) => sum + item.quantity, 0)
}

export function calculateCartTotal(items: CartItem[]): number {
  return items.reduce((sum, item) => {
    return sum + item.products.price * item.quantity
  }, 0)
}

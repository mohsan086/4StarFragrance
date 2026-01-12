import { Star } from "lucide-react"
import Link from "next/link"

export function Logo() {
  return (
    <Link href="/" className="flex items-center gap-2 group">
      <div className="flex items-center gap-0.5">
        {[...Array(4)].map((_, i) => (
          <Star
            key={i}
            className="w-4 h-4 fill-bronze text-bronze transition-transform group-hover:scale-110"
            style={{ transitionDelay: `${i * 50}ms` }}
          />
        ))}
      </div>
      <span className="font-serif text-xl font-semibold text-foreground tracking-wide">4 Star Fragrance</span>
    </Link>
  )
}

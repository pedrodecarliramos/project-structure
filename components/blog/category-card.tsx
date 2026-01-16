import Link from "next/link"
import type { Category } from "@/lib/blog"
import { Card } from "@/components/ui/card"
import { ArrowRight } from "lucide-react"

interface CategoryCardProps {
  category: Category
}

export function CategoryCard({ category }: CategoryCardProps) {
  return (
    <Link href={`/categories/${category.slug}`}>
      <Card className="group p-6 hover:shadow-lg transition-all hover:border-primary">
        <div className="flex items-start justify-between mb-3">
          <h3 className="text-xl font-bold group-hover:text-primary transition-colors">{category.name}</h3>
          <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
        </div>
        <p className="text-muted-foreground mb-4 text-pretty">{category.description}</p>
        <span className="text-sm font-medium">
          {category.postCount} {category.postCount === 1 ? "post" : "posts"}
        </span>
      </Card>
    </Link>
  )
}

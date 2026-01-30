import { getAllCategories } from "@/lib/blog"
import { CategoryCard } from "@/components/blog/category-card"
import { Header } from "@/components/blog/header"
import { Footer } from "@/components/blog/footer"

export const metadata = {
  title: "Categories - Modern Blog",
  description: "Browse blog posts by category",
}

export default function CategoriesPage() {
  const categories = getAllCategories()

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        <section className="py-12 bg-muted/30">
          <div className="container mx-auto px-4">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Categorias</h1>
            <p className="text-lg text-muted-foreground">Explore conteúdo organizado por tópicos</p>
          </div>
        </section>

        <section className="py-12">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
              {categories.map((category) => (
                <CategoryCard key={category.slug} category={category} />
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}

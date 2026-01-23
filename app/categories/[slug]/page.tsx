import { getCategoryBySlug, getPostsByCategory, getAllCategories } from "@/lib/blog"
import { PostCard } from "@/components/blog/post-card"
import { Header } from "@/components/blog/header"
import { Footer } from "@/components/blog/footer"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { notFound } from "next/navigation"

export async function generateStaticParams() {
  const categories = getAllCategories()
  return categories.map((category) => ({
    slug: category.slug,
  }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const category = getCategoryBySlug(slug)

  if (!category) {
    return {
      title: "Categoria não encontrada - Modern Blog",
    }
  }

  return {
    title: `${category.name} - Modern Blog`,
    description: category.description,
  }
}

export default async function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const category = getCategoryBySlug(slug)

  if (!category) {
    notFound()
  }

  const posts = getPostsByCategory(slug)

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        <section className="py-12 bg-muted/30">
          <div className="container mx-auto px-4">
            <Button variant="ghost" size="sm" asChild className="mb-6">
              <Link href="/categories">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Voltar para Categorias
              </Link>
            </Button>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">{category.name}</h1>
            <p className="text-lg text-muted-foreground mb-2">{category.description}</p>
            <p className="text-sm text-muted-foreground">
              {category.postCount} {category.postCount === 1 ? "post" : "posts"}
            </p>
          </div>
        </section>

        <section className="py-12">
          <div className="container mx-auto px-4">
            {posts.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {posts.map((post) => (
                  <PostCard key={post.slug} post={post} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-muted-foreground">Nenhum post encontrado nesta categoria ainda.</p>
              </div>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}

import { getAllPosts } from "@/lib/blog"
import { PostCard } from "@/components/blog/post-card"
import { Header } from "@/components/blog/header"
import { Footer } from "@/components/blog/footer"

export const metadata = {
  title: "All Posts - Modern Blog",
  description: "Browse all blog posts about web development, programming, and design",
}

export default function PostsPage() {
  const posts = getAllPosts()

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        <section className="py-12 bg-muted/30">
          <div className="container mx-auto px-4">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">All Posts</h1>
            <p className="text-lg text-muted-foreground">Explore all {posts.length} articles in our blog</p>
          </div>
        </section>

        <section className="py-12">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {posts.map((post) => (
                <PostCard key={post.slug} post={post} />
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}

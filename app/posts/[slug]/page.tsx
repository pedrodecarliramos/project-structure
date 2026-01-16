import { getPostBySlug, getAllPosts, getRelatedPosts } from "@/lib/blog"
import { getCommentsByPostSlug } from "@/lib/comments"
import { Header } from "@/components/blog/header"
import { Footer } from "@/components/blog/footer"
import { Badge } from "@/components/ui/badge"
import { Calendar, Clock, ArrowLeft } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { PostCard } from "@/components/blog/post-card"
import { Separator } from "@/components/ui/separator"
import { CommentsSection } from "@/components/blog/comments-section"
import { notFound } from "next/navigation"

export async function generateStaticParams() {
  const posts = getAllPosts()
  return posts.map((post) => ({
    slug: post.slug,
  }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const post = getPostBySlug(slug)

  if (!post) {
    return {
      title: "Post Not Found",
    }
  }

  return {
    title: `${post.title} - Modern Blog`,
    description: post.excerpt,
  }
}

export default async function PostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const post = getPostBySlug(slug)

  if (!post) {
    notFound()
  }

  const relatedPosts = getRelatedPosts(slug)
  const comments = getCommentsByPostSlug(slug)

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        <article>
          {/* Post Header */}
          <section className="py-12 bg-muted/30">
            <div className="container mx-auto px-4">
              <div className="max-w-4xl mx-auto">
                <Button variant="ghost" size="sm" asChild className="mb-6">
                  <Link href="/">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to Home
                  </Link>
                </Button>

                <div className="flex items-center gap-2 mb-4">
                  <Badge>{post.category}</Badge>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3.5 w-3.5" />
                      {new Date(post.date).toLocaleDateString("en-US", {
                        month: "long",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-3.5 w-3.5" />
                      {post.readingTime}
                    </span>
                  </div>
                </div>

                <h1 className="text-4xl md:text-5xl font-bold mb-6 text-balance">{post.title}</h1>

                <div className="flex items-center gap-3 mb-8">
                  <Image
                    src={post.author.avatar || "/placeholder.svg"}
                    alt={post.author.name}
                    width={48}
                    height={48}
                    className="rounded-full"
                  />
                  <div>
                    <div className="font-semibold">{post.author.name}</div>
                    <div className="text-sm text-muted-foreground">Author</div>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  {post.tags.map((tag) => (
                    <Badge key={tag} variant="outline">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* Cover Image */}
          <section className="py-8">
            <div className="container mx-auto px-4">
              <div className="max-w-5xl mx-auto">
                <div className="relative aspect-video rounded-xl overflow-hidden">
                  <Image
                    src={post.coverImage || "/placeholder.svg"}
                    alt={post.title}
                    fill
                    className="object-cover"
                    priority
                  />
                </div>
              </div>
            </div>
          </section>

          {/* Post Content */}
          <section className="py-8">
            <div className="container mx-auto px-4">
              <div className="max-w-3xl mx-auto">
                <div className="prose prose-lg max-w-none">
                  {post.content.split("\n\n").map((paragraph, index) => {
                    if (paragraph.startsWith("## ")) {
                      return (
                        <h2 key={index} className="text-3xl font-bold mt-12 mb-4">
                          {paragraph.replace("## ", "")}
                        </h2>
                      )
                    }
                    if (paragraph.startsWith("### ")) {
                      return (
                        <h3 key={index} className="text-2xl font-bold mt-8 mb-3">
                          {paragraph.replace("### ", "")}
                        </h3>
                      )
                    }
                    if (paragraph.startsWith("```")) {
                      const code = paragraph.replace(/```\w*\n?/g, "").trim()
                      return (
                        <pre key={index} className="bg-muted p-4 rounded-lg overflow-x-auto my-6">
                          <code className="text-sm">{code}</code>
                        </pre>
                      )
                    }
                    if (paragraph.startsWith("- ")) {
                      const items = paragraph.split("\n")
                      return (
                        <ul key={index} className="list-disc list-inside space-y-2 my-4">
                          {items.map((item, i) => (
                            <li key={i} className="text-foreground">
                              {item.replace("- ", "")}
                            </li>
                          ))}
                        </ul>
                      )
                    }
                    return (
                      <p key={index} className="text-foreground leading-relaxed mb-4">
                        {paragraph}
                      </p>
                    )
                  })}
                </div>
              </div>
            </div>
          </section>

          {/* Author Bio */}
          <section className="py-12">
            <div className="container mx-auto px-4">
              <div className="max-w-3xl mx-auto">
                <Separator className="mb-8" />
                <div className="flex items-start gap-4 p-6 bg-muted/30 rounded-lg">
                  <Image
                    src={post.author.avatar || "/placeholder.svg"}
                    alt={post.author.name}
                    width={80}
                    height={80}
                    className="rounded-full"
                  />
                  <div>
                    <h3 className="text-xl font-bold mb-2">About {post.author.name}</h3>
                    <p className="text-muted-foreground">
                      A passionate writer and developer sharing insights about web development, programming, and design.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </article>

        <CommentsSection postSlug={slug} initialComments={comments} />

        {/* Related Posts */}
        {relatedPosts.length > 0 && (
          <section className="py-12 bg-muted/30">
            <div className="container mx-auto px-4">
              <div className="max-w-6xl mx-auto">
                <h2 className="text-3xl font-bold mb-8">Related Posts</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {relatedPosts.map((relatedPost) => (
                    <PostCard key={relatedPost.slug} post={relatedPost} />
                  ))}
                </div>
              </div>
            </div>
          </section>
        )}
      </main>

      <Footer />
    </div>
  )
}

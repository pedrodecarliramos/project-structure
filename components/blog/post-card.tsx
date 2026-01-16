import Link from "next/link"
import Image from "next/image"
import type { Post } from "@/lib/blog"
import { Badge } from "@/components/ui/badge"
import { Calendar, Clock, MessageSquare } from "lucide-react"
import { Card } from "@/components/ui/card"
import { getCommentCount } from "@/lib/comments"

interface PostCardProps {
  post: Post
  featured?: boolean
}

export function PostCard({ post, featured = false }: PostCardProps) {
  const commentCount = getCommentCount(post.slug)

  if (featured) {
    return (
      <Link href={`/posts/${post.slug}`}>
        <Card className="group overflow-hidden border-0 shadow-lg hover:shadow-xl transition-shadow">
          <div className="grid md:grid-cols-2 gap-0">
            <div className="relative aspect-video md:aspect-auto">
              <Image
                src={post.coverImage || "/placeholder.svg"}
                alt={post.title}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-300"
              />
            </div>
            <div className="p-8 flex flex-col justify-center">
              <div className="flex items-center gap-2 mb-4">
                <Badge variant="secondary">{post.category}</Badge>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Calendar className="h-3.5 w-3.5" />
                    {new Date(post.date).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="h-3.5 w-3.5" />
                    {post.readingTime}
                  </span>
                  {commentCount > 0 && (
                    <span className="flex items-center gap-1">
                      <MessageSquare className="h-3.5 w-3.5" />
                      {commentCount}
                    </span>
                  )}
                </div>
              </div>
              <h2 className="text-3xl font-bold mb-4 group-hover:text-primary transition-colors text-balance">
                {post.title}
              </h2>
              <p className="text-muted-foreground text-lg mb-6 text-pretty">{post.excerpt}</p>
              <div className="flex items-center gap-3">
                <Image
                  src={post.author.avatar || "/placeholder.svg"}
                  alt={post.author.name}
                  width={40}
                  height={40}
                  className="rounded-full"
                />
                <span className="font-medium">{post.author.name}</span>
              </div>
            </div>
          </div>
        </Card>
      </Link>
    )
  }

  return (
    <Link href={`/posts/${post.slug}`}>
      <Card className="group overflow-hidden border-0 shadow-md hover:shadow-lg transition-shadow h-full flex flex-col">
        <div className="relative aspect-video overflow-hidden">
          <Image
            src={post.coverImage || "/placeholder.svg"}
            alt={post.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </div>
        <div className="p-6 flex flex-col flex-1">
          <div className="flex items-center gap-2 mb-3">
            <Badge variant="secondary">{post.category}</Badge>
            <span className="text-sm text-muted-foreground flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {post.readingTime}
            </span>
            {commentCount > 0 && (
              <span className="text-sm text-muted-foreground flex items-center gap-1">
                <MessageSquare className="h-3 w-3" />
                {commentCount}
              </span>
            )}
          </div>
          <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors text-balance line-clamp-2">
            {post.title}
          </h3>
          <p className="text-muted-foreground mb-4 flex-1 text-pretty line-clamp-3">{post.excerpt}</p>
          <div className="flex items-center justify-between pt-4 border-t">
            <div className="flex items-center gap-2">
              <Image
                src={post.author.avatar || "/placeholder.svg"}
                alt={post.author.name}
                width={32}
                height={32}
                className="rounded-full"
              />
              <span className="text-sm font-medium">{post.author.name}</span>
            </div>
            <span className="text-sm text-muted-foreground flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              {new Date(post.date).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
            </span>
          </div>
        </div>
      </Card>
    </Link>
  )
}

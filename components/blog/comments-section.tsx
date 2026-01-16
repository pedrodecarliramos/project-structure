"use client"

import type React from "react"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { MessageSquare, Send } from "lucide-react"
import type { Comment } from "@/lib/comments"

interface CommentsSectionProps {
  postSlug: string
  initialComments: Comment[]
}

export function CommentsSection({ postSlug, initialComments }: CommentsSectionProps) {
  const [comments, setComments] = useState<Comment[]>(initialComments)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    author: "",
    email: "",
    content: "",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500))

      const newComment: Comment = {
        id: Math.random().toString(36).substring(7),
        postSlug,
        author: formData.author,
        email: formData.email,
        content: formData.content,
        date: new Date().toISOString(),
      }

      setComments([newComment, ...comments])
      setFormData({ author: "", email: "", content: "" })
    } catch (error) {
      console.error("[v0] Error submitting comment:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleReply = (commentId: string, replyContent: string) => {
    const newReply: Comment = {
      id: Math.random().toString(36).substring(7),
      postSlug,
      author: "Anonymous",
      email: "",
      content: replyContent,
      date: new Date().toISOString(),
    }

    setComments(
      comments.map((comment) => {
        if (comment.id === commentId) {
          return {
            ...comment,
            replies: [...(comment.replies || []), newReply],
          }
        }
        return comment
      }),
    )
  }

  return (
    <section className="py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center gap-2 mb-8">
            <MessageSquare className="h-6 w-6" />
            <h2 className="text-2xl font-bold">
              Comments ({comments.length + comments.reduce((acc, c) => acc + (c.replies?.length || 0), 0)})
            </h2>
          </div>

          {/* Comment Form */}
          <Card className="p-6 mb-8">
            <h3 className="text-lg font-semibold mb-4">Leave a Comment</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="author">Name *</Label>
                  <Input
                    id="author"
                    value={formData.author}
                    onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                    placeholder="Your name"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="your@email.com"
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="content">Comment *</Label>
                <Textarea
                  id="content"
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  placeholder="Share your thoughts..."
                  rows={4}
                  required
                />
              </div>
              <Button type="submit" disabled={isSubmitting}>
                <Send className="mr-2 h-4 w-4" />
                {isSubmitting ? "Posting..." : "Post Comment"}
              </Button>
            </form>
          </Card>

          {/* Comments List */}
          <div className="space-y-6">
            {comments.length === 0 ? (
              <Card className="p-8 text-center">
                <MessageSquare className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">No comments yet. Be the first to share your thoughts!</p>
              </Card>
            ) : (
              comments.map((comment) => <CommentCard key={comment.id} comment={comment} onReply={handleReply} />)
            )}
          </div>
        </div>
      </div>
    </section>
  )
}

interface CommentCardProps {
  comment: Comment
  onReply: (commentId: string, content: string) => void
  isReply?: boolean
}

function CommentCard({ comment, onReply, isReply = false }: CommentCardProps) {
  const [showReplyForm, setShowReplyForm] = useState(false)
  const [replyContent, setReplyContent] = useState("")

  const handleReplySubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (replyContent.trim()) {
      onReply(comment.id, replyContent)
      setReplyContent("")
      setShowReplyForm(false)
    }
  }

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2)
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))

    if (diffInHours < 1) return "Just now"
    if (diffInHours < 24) return `${diffInHours} hour${diffInHours > 1 ? "s" : ""} ago`
    if (diffInHours < 168) return `${Math.floor(diffInHours / 24)} day${diffInHours >= 48 ? "s" : ""} ago`
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
  }

  return (
    <div className={isReply ? "ml-12" : ""}>
      <Card className="p-6">
        <div className="flex items-start gap-4">
          <Avatar>
            <AvatarFallback className="bg-primary text-primary-foreground">
              {getInitials(comment.author)}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <span className="font-semibold">{comment.author}</span>
              <span className="text-sm text-muted-foreground">•</span>
              <span className="text-sm text-muted-foreground">{formatDate(comment.date)}</span>
            </div>
            <p className="text-foreground mb-4 leading-relaxed">{comment.content}</p>
            {!isReply && (
              <Button variant="ghost" size="sm" onClick={() => setShowReplyForm(!showReplyForm)}>
                Reply
              </Button>
            )}

            {showReplyForm && (
              <form onSubmit={handleReplySubmit} className="mt-4 space-y-3">
                <Textarea
                  value={replyContent}
                  onChange={(e) => setReplyContent(e.target.value)}
                  placeholder="Write your reply..."
                  rows={3}
                />
                <div className="flex gap-2">
                  <Button type="submit" size="sm">
                    Post Reply
                  </Button>
                  <Button type="button" variant="ghost" size="sm" onClick={() => setShowReplyForm(false)}>
                    Cancel
                  </Button>
                </div>
              </form>
            )}
          </div>
        </div>

        {comment.replies && comment.replies.length > 0 && (
          <div className="mt-6 space-y-4">
            <Separator />
            {comment.replies.map((reply) => (
              <CommentCard key={reply.id} comment={reply} onReply={onReply} isReply />
            ))}
          </div>
        )}
      </Card>
    </div>
  )
}

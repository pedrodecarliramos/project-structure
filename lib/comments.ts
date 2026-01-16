export interface Comment {
  id: string
  postSlug: string
  author: string
  email: string
  content: string
  date: string
  replies?: Comment[]
}

// Mock comments data
const commentsData: Comment[] = [
  {
    id: "1",
    postSlug: "getting-started-with-nextjs",
    author: "John Doe",
    email: "john@example.com",
    content:
      "Great article! This really helped me understand the new features in Next.js 16. The explanation of Turbopack was particularly useful.",
    date: "2025-01-12T10:30:00Z",
    replies: [
      {
        id: "2",
        postSlug: "getting-started-with-nextjs",
        author: "Sarah Johnson",
        email: "sarah@example.com",
        content: "Thanks John! Glad it was helpful. Let me know if you have any questions.",
        date: "2025-01-12T14:20:00Z",
      },
    ],
  },
  {
    id: "3",
    postSlug: "getting-started-with-nextjs",
    author: "Alice Smith",
    email: "alice@example.com",
    content: "Would love to see a follow-up article on deploying Next.js apps with Docker. Any plans for that?",
    date: "2025-01-13T09:15:00Z",
  },
  {
    id: "4",
    postSlug: "typescript-best-practices-2025",
    author: "Bob Wilson",
    email: "bob@example.com",
    content:
      "The section on utility types was eye-opening. I've been using TypeScript for years but didn't know about some of these patterns!",
    date: "2025-01-09T16:45:00Z",
  },
  {
    id: "5",
    postSlug: "react-server-components-explained",
    author: "Emma Davis",
    email: "emma@example.com",
    content:
      "This is the clearest explanation of Server Components I've seen. The comparison with Client Components really helped clarify when to use each.",
    date: "2025-01-04T11:20:00Z",
    replies: [
      {
        id: "6",
        postSlug: "react-server-components-explained",
        author: "David Park",
        email: "david@example.com",
        content: "Thank you Emma! I tried to make it as practical as possible. Glad it resonated with you!",
        date: "2025-01-04T13:30:00Z",
      },
    ],
  },
]

export function getCommentsByPostSlug(postSlug: string): Comment[] {
  return commentsData
    .filter((comment) => comment.postSlug === postSlug && !comment.replies)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
}

export function getCommentCount(postSlug: string): number {
  const comments = commentsData.filter((comment) => comment.postSlug === postSlug)
  return comments.length
}

export function addComment(comment: Omit<Comment, "id" | "date">): Comment {
  const newComment: Comment = {
    ...comment,
    id: Math.random().toString(36).substring(7),
    date: new Date().toISOString(),
  }
  commentsData.push(newComment)
  return newComment
}

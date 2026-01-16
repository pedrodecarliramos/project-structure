import { type NextRequest, NextResponse } from "next/server"
import { addComment } from "@/lib/comments"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { postSlug, author, email, content } = body

    // Validate required fields
    if (!postSlug || !author || !email || !content) {
      return NextResponse.json({ message: "Missing required fields" }, { status: 400 })
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json({ message: "Invalid email format" }, { status: 400 })
    }

    // Add comment
    const newComment = addComment({
      postSlug,
      author,
      email,
      content,
    })

    return NextResponse.json({ comment: newComment }, { status: 201 })
  } catch (error) {
    return NextResponse.json({ message: "Error creating comment", error: String(error) }, { status: 500 })
  }
}

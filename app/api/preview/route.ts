import { type NextRequest, NextResponse } from "next/server"
import { draftMode } from "next/headers"

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const slug = searchParams.get("slug")
  const secret = searchParams.get("secret")

  // Validate secret (in production, use environment variable)
  if (secret !== "your-preview-secret") {
    return NextResponse.json({ message: "Invalid token" }, { status: 401 })
  }

  // Validate slug
  if (!slug) {
    return NextResponse.json({ message: "Slug is required" }, { status: 400 })
  }

  // Enable Draft Mode
  const draft = await draftMode()
  draft.enable()

  // Redirect to the preview page
  return NextResponse.redirect(new URL(`/admin/preview/${slug}`, request.url))
}

export async function POST() {
  const draft = await draftMode()
  draft.disable()

  return NextResponse.json({ message: "Draft mode disabled" })
}

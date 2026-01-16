import { revalidatePath } from "next/cache"
import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { path, secret } = body

    // Validate secret token (in production, use environment variable)
    if (secret !== "your-revalidation-secret") {
      return NextResponse.json({ message: "Invalid token" }, { status: 401 })
    }

    // Validate path
    if (!path) {
      return NextResponse.json({ message: "Path is required" }, { status: 400 })
    }

    // Revalidate the path
    revalidatePath(path)

    return NextResponse.json({ revalidated: true, path, now: Date.now() })
  } catch (error) {
    return NextResponse.json({ message: "Error revalidating", error: String(error) }, { status: 500 })
  }
}

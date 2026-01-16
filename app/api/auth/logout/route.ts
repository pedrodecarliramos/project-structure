import { type NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"
import { verifyToken } from "@/lib/auth"

export async function POST(request: NextRequest) {
  try {
    // Get refresh token from cookie
    const refreshToken = request.cookies.get("refreshToken")?.value

    if (refreshToken) {
      // Revoke refresh token
      db.revokeRefreshToken(refreshToken)

      // Log activity
      const payload = verifyToken(refreshToken)
      if (payload) {
        db.createAuditLog({
          userId: payload.userId,
          action: "logout",
          resource: "auth",
          resourceId: payload.userId,
          ip: request.headers.get("x-forwarded-for") || "unknown",
          userAgent: request.headers.get("user-agent") || "unknown",
        })
      }
    }

    // Clear refresh token cookie
    const response = NextResponse.json({
      message: "Logout realizado com sucesso",
    })

    response.cookies.delete("refreshToken")

    return response
  } catch (error) {
    console.error("[v0] Logout error:", error)
    return NextResponse.json({ error: "Erro ao fazer logout" }, { status: 500 })
  }
}

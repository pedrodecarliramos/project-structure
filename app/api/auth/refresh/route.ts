import { type NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"
import { verifyToken, generateToken, generateRefreshToken } from "@/lib/auth"

export async function POST(request: NextRequest) {
  try {
    // Get refresh token from cookie
    const refreshToken = request.cookies.get("refreshToken")?.value

    if (!refreshToken) {
      return NextResponse.json({ error: "Refresh token não encontrado" }, { status: 401 })
    }

    // Verify refresh token
    const payload = verifyToken(refreshToken)
    if (!payload) {
      return NextResponse.json({ error: "Refresh token inválido" }, { status: 401 })
    }

    // Check if refresh token exists and is not revoked
    const storedToken = db.getRefreshToken(refreshToken)
    if (!storedToken || storedToken.revoked) {
      return NextResponse.json({ error: "Refresh token revogado" }, { status: 401 })
    }

    // Get user
    const user = db.getUserById(payload.userId)
    if (!user || !user.isActive) {
      return NextResponse.json({ error: "Usuário não encontrado ou inativo" }, { status: 401 })
    }

    // Generate new tokens
    const newAccessToken = generateToken(user)
    const newRefreshToken = generateRefreshToken(user)

    // Revoke old refresh token
    db.revokeRefreshToken(refreshToken)

    // Store new refresh token
    db.createRefreshToken(user.id, newRefreshToken)

    // Set new refresh token as httpOnly cookie
    const response = NextResponse.json({
      message: "Token renovado com sucesso",
      accessToken: newAccessToken,
    })

    response.cookies.set("refreshToken", newRefreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60, // 7 days
      path: "/",
    })

    return response
  } catch (error) {
    console.error("[v0] Refresh token error:", error)
    return NextResponse.json({ error: "Erro ao renovar token" }, { status: 500 })
  }
}

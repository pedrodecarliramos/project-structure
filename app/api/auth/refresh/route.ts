import { type NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"
import { verifyToken, generateToken } from "@/lib/auth"

export async function POST(request: NextRequest) {
  try {
    
    const refreshToken = request.cookies.get("refreshToken")?.value

    if (!refreshToken) {
      return NextResponse.json({ error: "Refresh token não encontrado" }, { status: 401 })
    }

   
    const payload = verifyToken(refreshToken)
    if (!payload) {
      return NextResponse.json({ error: "Refresh token inválido" }, { status: 401 })
    }

   
    const storedToken = await db.getRefreshToken(refreshToken)
    if (!storedToken || storedToken.revoked) {
      return NextResponse.json({ error: "Refresh token revogado ou inexistente" }, { status: 401 })
    }

    const userId = (payload as any).sub || (payload as any).id
    const user = await db.getUserById(userId)
    
    if (!user || !user.isActive) {
      return NextResponse.json({ error: "Usuário não encontrado ou inativo" }, { status: 401 })
    }

    const newAccessToken = generateToken(user, "access")
    const newRefreshToken = generateToken(user, "refresh")

    await db.revokeRefreshToken(refreshToken)

    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 dias
    await db.storeRefreshToken(user.id, newRefreshToken, expiresAt)

    const response = NextResponse.json({
      message: "Token renovado com sucesso",
      accessToken: newAccessToken,
    })

    response.cookies.set("refreshToken", newRefreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60, // 7 dias
      path: "/",
    })

    return response

  } catch (error) {
    console.error("[REFRESH_ERROR]:", error)
    return NextResponse.json({ error: "Erro interno ao renovar token" }, { status: 500 })
  }
}
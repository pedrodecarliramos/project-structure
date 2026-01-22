import { type NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"
import { verifyToken, generateToken } from "@/lib/auth"

export async function POST(request: NextRequest) {
  try {
    // 1. Busca o refresh token nos cookies
    const refreshToken = request.cookies.get("refreshToken")?.value

    if (!refreshToken) {
      return NextResponse.json({ error: "Refresh token não encontrado" }, { status: 401 })
    }

    // 2. Verifica a integridade do token (JWT)
    const payload = verifyToken(refreshToken)
    if (!payload) {
      return NextResponse.json({ error: "Refresh token inválido" }, { status: 401 })
    }

    // 3. Verifica se o token existe no banco e não foi revogado
    // Note o uso de await aqui
    const storedToken = await db.getRefreshToken(refreshToken)
    if (!storedToken || storedToken.revoked) {
      return NextResponse.json({ error: "Refresh token revogado ou inexistente" }, { status: 401 })
    }

    // 4. Busca o usuário e garante que ele tenha poder de acesso
    // O payload.sub é o ID do usuário no JWT padrão
    const userId = (payload as any).sub || (payload as any).id
    const user = await db.getUserById(userId)
    
    if (!user || !user.isActive) {
      return NextResponse.json({ error: "Usuário não encontrado ou inativo" }, { status: 401 })
    }

    // 5. Gera novos selos (tokens) para o súdito
    const newAccessToken = generateToken(user)
    const newRefreshToken = generateToken(user)

    // 6. Rotação de Segurança: Revoga o antigo e armazena o novo
    // ESSENCIAL: Adicionado await para garantir que o banco grave as mudanças
    await db.revokeRefreshToken(refreshToken)

    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 dias
    await db.storeRefreshToken(user.id, newRefreshToken, expiresAt)

    // 7. Prepara a resposta e sela o novo cookie
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
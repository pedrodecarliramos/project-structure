import { type NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"
// Certifique-se de que essas funções estejam com "export" no lib/auth.ts
import { verifyPassword, generateToken } from "@/lib/auth" 
import { z } from "zod"

const loginSchema = z.object({
  email: z.string().email("Email inválido"),
  password: z.string().min(1, "Senha é obrigatória"),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validatedData = loginSchema.parse(body)

    // CORREÇÃO: Adicionado 'await' aqui
    const user = await db.getUserByEmail(validatedData.email)
    
    if (!user) {
      return NextResponse.json({ error: "Email ou senha inválidos" }, { status: 401 })
    }

    if (!user.isActive) {
      return NextResponse.json({ error: "Conta desativada. Entre em contato com o suporte." }, { status: 403 })
    }

    const isValidPassword = await verifyPassword(validatedData.password, user.password)
    if (!isValidPassword) {
      return NextResponse.json({ error: "Email ou senha inválidos" }, { status: 401 })
    }

    // Gerando tokens (usando a função que corrigimos antes)
    const accessToken = generateToken(user)
    // Se não tiver generateRefreshToken separada, use a generateToken com um parâmetro tipo
    const refreshToken = generateToken(user, "refresh")

    // CORREÇÃO: createSession ou similar (conforme seu erro no db.ts indicou)
    // O erro disse que 'createRefreshToken' não existe no db.ts
    await db.createSession({
        userId: user.id,
        token: accessToken,
        refreshToken: refreshToken,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
    })

    await db.updateUser(user.id, { lastLogin: new Date() })

    await db.createAuditLog({
      userId: user.id,
      action: "login",
      resource: "auth",
      // CORREÇÃO: Removido resourceId (não existe no tipo) e adicionado await
      details: `Login via portal`, 
      ipAddress: request.headers.get("x-forwarded-for") || "unknown", // Ajustado para ipAddress se for o tipo correto
      userAgent: request.headers.get("user-agent") || "unknown",
    })

    const response = NextResponse.json({
      message: "Login realizado com sucesso",
      accessToken,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: (user as any).roleId, // Ajuste para roleId conforme erro anterior
        emailVerified: user.emailVerified,
      },
    })

    response.cookies.set("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60,
      path: "/",
    })

    return response
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors[0].message }, { status: 400 })
    }
    console.error("[v0] Login error:", error)
    return NextResponse.json({ error: "Erro ao fazer login" }, { status: 500 })
  }
}
import { type NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"
import { verifyPassword, generateToken, generateRefreshToken } from "@/lib/auth"
import { z } from "zod"

const loginSchema = z.object({
  email: z.string().email("Email inválido"),
  password: z.string().min(1, "Senha é obrigatória"),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validatedData = loginSchema.parse(body)

    // Find user
    const user = db.getUserByEmail(validatedData.email)
    if (!user) {
      return NextResponse.json({ error: "Email ou senha inválidos" }, { status: 401 })
    }

    // Check if user is active
    if (!user.isActive) {
      return NextResponse.json({ error: "Conta desativada. Entre em contato com o suporte." }, { status: 403 })
    }

    // Verify password
    const isValidPassword = await verifyPassword(validatedData.password, user.password)
    if (!isValidPassword) {
      return NextResponse.json({ error: "Email ou senha inválidos" }, { status: 401 })
    }

    // Generate tokens
    const accessToken = generateToken(user)
    const refreshToken = generateRefreshToken(user)

    // Store refresh token
    db.createRefreshToken(user.id, refreshToken)

    // Update last login
    db.updateUser(user.id, { lastLogin: new Date() })

    // Log activity
    db.createAuditLog({
      userId: user.id,
      action: "login",
      resource: "auth",
      resourceId: user.id,
      ip: request.headers.get("x-forwarded-for") || "unknown",
      userAgent: request.headers.get("user-agent") || "unknown",
    })

    // Set refresh token as httpOnly cookie
    const response = NextResponse.json({
      message: "Login realizado com sucesso",
      accessToken,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        emailVerified: user.emailVerified,
      },
    })

    response.cookies.set("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60, // 7 days
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

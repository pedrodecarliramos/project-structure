import { type NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"
import { hashPassword } from "@/lib/auth"
import { z } from "zod"

const resetPasswordSchema = z.object({
  token: z.string().min(1, "Token é obrigatório"),
  password: z.string().min(8, "Senha deve ter no mínimo 8 caracteres"),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { token, password } = resetPasswordSchema.parse(body)

    // Find reset token
    const resetToken = db.getPasswordResetToken(token)
    if (!resetToken) {
      return NextResponse.json({ error: "Token inválido ou expirado" }, { status: 400 })
    }

    // Check if token is expired (1 hour)
    const tokenAge = Date.now() - resetToken.createdAt.getTime()
    if (tokenAge > 60 * 60 * 1000) {
      db.deletePasswordResetToken(token)
      return NextResponse.json({ error: "Token expirado. Solicite um novo link de redefinição." }, { status: 400 })
    }

    // Hash new password
    const passwordHash = await hashPassword(password)

    // Update user password
    db.updateUser(resetToken.userId, { password: passwordHash })

    // Delete reset token
    db.deletePasswordResetToken(token)

    // Revoke all refresh tokens for security
    db.revokeAllUserRefreshTokens(resetToken.userId)

    // Log activity
    db.createAuditLog({
      userId: resetToken.userId,
      action: "reset_password",
      resource: "auth",
      resourceId: resetToken.userId,
      ip: request.headers.get("x-forwarded-for") || "unknown",
      userAgent: request.headers.get("user-agent") || "unknown",
    })

    return NextResponse.json({
      message: "Senha redefinida com sucesso!",
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors[0].message }, { status: 400 })
    }
    console.error("[v0] Reset password error:", error)
    return NextResponse.json({ error: "Erro ao redefinir senha" }, { status: 500 })
  }
}

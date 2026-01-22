import { type NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"
import { hashPassword } from "@/lib/auth"
import { z } from "zod"

const resetSchema = z.object({
  token: z.string().min(1, "Token é obrigatório"),
  password: z.string().min(6, "A nova senha deve ter pelo menos 6 caracteres"),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { token, password } = resetSchema.parse(body)

    // 1. Busca o usuário pelo token (IMPORTANTE: use await)
    const user = await db.getPasswordResetToken(token, token)

    // CORREÇÃO ERRO 1345: Agora 'user' não é void, pode ser testado
    if (!user) {
      return NextResponse.json({ error: "Token inválido" }, { status: 400 })
    }

    // 2. Verifica expiração (resetPasswordExpires deve estar no seu tipo User)
    const isExpired = user.resetPasswordExpires && new Date() > new Date(user.resetPasswordExpires)
    if (isExpired) {
      await db.deletePasswordResetToken(user.id)
      return NextResponse.json({ error: "Token expirado" }, { status: 400 })
    }

    const hashedPassword = await hashPassword(password)

    // 3. Atualiza senha e limpa tokens
    await db.updateUser(user.id, {
      password: hashedPassword,
      resetPasswordToken: undefined,
      resetPasswordExpires: undefined
    })

    // 4. Invalida sessões antigas
    await db.revokeAllUserRefreshTokens(user.id)

    // 5. Auditoria (CORREÇÃO ERRO 2561: resourceId -> resource)
    await db.createAuditLog({
      userId: user.id,
      action: "PASSWORD_RESET",
      resource: "auth",
      details: "Senha redefinida com sucesso",
      ipAddress: request.headers.get("x-forwarded-for") || "0.0.0.0",
      userAgent: request.headers.get("user-agent") || "unknown",
    })

    return NextResponse.json({ message: "Senha redefinida com sucesso!" })

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors[0].message }, { status: 400 })
    }
    console.error(error)
    return NextResponse.json({ error: "Erro interno no servidor" }, { status: 500 })
  }
}
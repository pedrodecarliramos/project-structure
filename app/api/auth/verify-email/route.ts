import { type NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"
import { z } from "zod"

const verifySchema = z.object({
  token: z.string().min(1, "Token é obrigatório"),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { token } = verifySchema.parse(body)

    // Find verification token
    const verification = db.getVerificationToken(token)
    if (!verification) {
      return NextResponse.json({ error: "Token inválido ou expirado" }, { status: 400 })
    }

    // Check if token is expired (24 hours)
    const tokenAge = Date.now() - verification.createdAt.getTime()
    if (tokenAge > 24 * 60 * 60 * 1000) {
      db.deleteVerificationToken(token)
      return NextResponse.json({ error: "Token expirado. Solicite um novo email de verificação." }, { status: 400 })
    }

    // Update user
    db.updateUser(verification.userId, { emailVerified: true })

    // Delete verification token
    db.deleteVerificationToken(token)

    // Log activity
    db.createAuditLog({
      userId: verification.userId,
      action: "verify_email",
      resource: "user",
      resourceId: verification.userId,
      ip: request.headers.get("x-forwarded-for") || "unknown",
      userAgent: request.headers.get("user-agent") || "unknown",
    })

    return NextResponse.json({
      message: "Email verificado com sucesso!",
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors[0].message }, { status: 400 })
    }
    console.error("[v0] Verify email error:", error)
    return NextResponse.json({ error: "Erro ao verificar email" }, { status: 500 })
  }
}

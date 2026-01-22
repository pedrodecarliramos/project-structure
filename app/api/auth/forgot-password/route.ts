import { type NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"
import { z } from "zod"
import { nanoid } from "nanoid"

const forgotPasswordSchema = z.object({
  email: z.string().email("Email inválido"),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email } = forgotPasswordSchema.parse(body)

    // Find user
    const user = await db.getUserByEmail(email)

    // Always return success to prevent email enumeration
    if (!user) {
      return NextResponse.json({
        message: "Se o email existir, você receberá instruções para redefinir sua senha.",
      })
    }

    // Generate reset token
    const resetToken = nanoid(32)

    // Store reset token
    db.getPasswordResetToken(user.id, resetToken)

    // Log activity
    db.createAuditLog({
      userId: user.id,
      action: "forgot_password",
      resource: "auth",
      userAgent: request.headers.get("user-agent") || "unknown",
      details: "",
      ipAddress: ""
    })

    // In production, send email with reset link
    console.log(`[v0] Password reset link: ${process.env.NEXT_PUBLIC_APP_URL}/reset-password?token=${resetToken}`)

    return NextResponse.json({
      message: "Se o email existir, você receberá instruções para redefinir sua senha.",
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors[0].message }, { status: 400 })
    }
    console.error("[v0] Forgot password error:", error)
    return NextResponse.json({ error: "Erro ao processar solicitação" }, { status: 500 })
  }
}

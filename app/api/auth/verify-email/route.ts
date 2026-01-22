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

    // No seu db.ts atualizado, buscamos o usuário que possui este token
    const users = await db.getUsers()
    const user = users.find((u) => u.verificationToken === token)

    if (!user) {
      return NextResponse.json({ error: "Token inválido ou expirado" }, { status: 400 })
    }

    const tokenAge = Date.now() - new Date(user.createdAt).getTime()
    if (tokenAge > 24 * 60 * 60 * 1000) {
      await db.updateUser(user.id, { verificationToken: undefined })
      return NextResponse.json({ error: "Token expirado. Solicite um novo e-mail." }, { status: 400 })
    }

    await db.updateUser(user.id, { 
      emailVerified: true, 
      verificationToken: undefined 
    })

    await db.createAuditLog({
      userId: user.id,
      action: "EMAIL_VERIFIED",
      resource: "auth",
      details: `E-mail ${user.email} verificado com sucesso`,
      ipAddress: request.headers.get("x-forwarded-for") || "0.0.0.0",
      userAgent: request.headers.get("user-agent") || "browser",
    })

    return NextResponse.json({
      message: "Email verificado com sucesso!",
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors[0].message }, { status: 400 })
    }
    console.error("[Auth API] Erro ao verificar e-mail:", error)
    return NextResponse.json({ error: "Erro interno ao verificar e-mail" }, { status: 500 })
  }
}
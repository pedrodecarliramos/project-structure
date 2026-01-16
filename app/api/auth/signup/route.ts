import { type NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"
import { hashPassword } from "@/lib/auth"
import { z } from "zod"
import { nanoid } from "nanoid"

const signupSchema = z.object({
  name: z.string().min(2, "Nome deve ter no mínimo 2 caracteres"),
  email: z.string().email("Email inválido"),
  password: z.string().min(8, "Senha deve ter no mínimo 8 caracteres"),
  cpf: z.string().optional(),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validatedData = signupSchema.parse(body)

    // Check if user already exists
    const existingUser = db.getUserByEmail(validatedData.email)
    if (existingUser) {
      return NextResponse.json({ error: "Email já cadastrado" }, { status: 400 })
    }

    // Hash password
    const passwordHash = await hashPassword(validatedData.password)

    // Create verification token
    const verificationToken = nanoid(32)

    // Create user
    const user = db.createUser({
      name: validatedData.name,
      email: validatedData.email,
      password: passwordHash,
      cpf: validatedData.cpf,
      emailVerified: false,
      role: "user",
      isActive: true,
    })

    // Store verification token
    db.createVerificationToken(user.id, verificationToken)

    // Log activity
    db.createAuditLog({
      userId: user.id,
      action: "signup",
      resource: "user",
      resourceId: user.id,
      ip: request.headers.get("x-forwarded-for") || "unknown",
      userAgent: request.headers.get("user-agent") || "unknown",
    })

    // In production, send email with verification link
    console.log(`[v0] Verification link: ${process.env.NEXT_PUBLIC_APP_URL}/verify-email?token=${verificationToken}`)

    return NextResponse.json({
      message: "Usuário criado com sucesso. Verifique seu email.",
      userId: user.id,
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors[0].message }, { status: 400 })
    }
    console.error("[v0] Signup error:", error)
    return NextResponse.json({ error: "Erro ao criar usuário" }, { status: 500 })
  }
}

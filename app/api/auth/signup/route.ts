import { type NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"
import { z } from "zod"
import { hashPassword } from "@/lib/auth"
import { v4 as uuidv4 } from "uuid"

const signupSchema = z.object({
  name: z.string().min(2, "Nome deve ter pelo menos 2 caracteres"),
  email: z.string().email("E-mail inválido"),
  password: z.string().min(6, "A senha deve ter pelo menos 6 caracteres"),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, email, password } = signupSchema.parse(body)

    const existingUser = await db.getUserByEmail(email)
    if (existingUser) {
      return NextResponse.json({ error: "Este e-mail já está em uso" }, { status: 400 })
    }

    const hashedPassword = await hashPassword(password)
    const verificationToken = uuidv4()

    const newUser = await db.createUser({
      name,
      email,
      password: hashedPassword,
      roleId: "user",
      isActive: true,
      emailVerified: false,
      verificationToken,
      sub: "",
      role: function (role: any, arg1: string, arg2: string): unknown {
        throw new Error("Function not implemented.")
      },
      userId: function (userId: any): unknown {
        throw new Error("Function not implemented.")
      }
    })

    await db.updateUser(newUser.id, { verificationToken })

    await db.createAuditLog({
      userId: newUser.id,
      action: "USER_SIGNUP",
      resource: "auth", 
      details: `Novo usuário registrado: ${newUser.email}`,
      ipAddress: request.headers.get("x-forwarded-for") || "0.0.0.0",
      userAgent: request.headers.get("user-agent") || "unknown",
    })

    return NextResponse.json({
      message: "Usuário registrado com sucesso! Verifique seu e-mail.",
      userId: newUser.id,
    }, { status: 201 })

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors[0].message }, { status: 400 })
    }
    console.error("[SIGNUP_ERROR]:", error)
    return NextResponse.json({ error: "Erro ao processar o registro no reino" }, { status: 500 })
  }
}
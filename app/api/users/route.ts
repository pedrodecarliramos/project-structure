import { type NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"
import { verifyToken, hashPassword } from "@/lib/auth"
import { hasPermission } from "@/lib/permissions"
import { z } from "zod"
import { User } from "@/lib/types"

const createUserSchema = z.object({
  name: z.string().min(2, "Nome deve ter no mínimo 2 caracteres"),
  email: z.string().email("Email inválido"),
  password: z.string().min(8, "Senha deve ter no mínimo 8 caracteres"),
  role: z.enum(["user", "admin", "manager"]),
  cpf: z.string().optional(),
})

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get("authorization")
    const token = authHeader?.replace("Bearer ", "")

    if (!token) return NextResponse.json({ error: "Token não fornecido" }, { status: 401 })

    const payload = verifyToken(token) as any;
    if (!payload || !payload.userId) {
      return NextResponse.json({ error: "Token inválido" }, { status: 401 })
    }

    const currentUser = await db.getUserById(payload.userId)
    if (!currentUser) return NextResponse.json({ error: "Usuário não encontrado" }, { status: 401 })

    if (!hasPermission(currentUser.role as any, "users", "read")) {
      return NextResponse.json({ error: "Sem permissão" }, { status: 403 })
    }

    const searchParams = request.nextUrl.searchParams
    const page = Number.parseInt(searchParams.get("page") || "1")
    const limit = Number.parseInt(searchParams.get("limit") || "10")
    const search = searchParams.get("search") || ""
    const role = searchParams.get("role") || ""
    const status = searchParams.get("status") || ""

    let users = await db.getUsers()

    if (search) {
      users = users.filter((u: User) =>
          u.name.toLowerCase().includes(search.toLowerCase()) || 
          u.email.toLowerCase().includes(search.toLowerCase()),
      )
    }

    if (role) {
      users = users.filter((u: User) => (u.role as any) === role)
    }

    if (status === "active") {
      users = users.filter((u: User) => u.isActive)
    } else if (status === "inactive") {
      users = users.filter((u: User) => !u.isActive)
    }

    const total = users.length
    const startIndex = (page - 1) * limit
    const paginatedUsers = users.slice(startIndex, startIndex + limit)

    const sanitizedUsers = paginatedUsers.map(({ password, ...user }: any) => user)

    return NextResponse.json({
      users: sanitizedUsers,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    })
  } catch (error) {
    console.error("[API GET] Error:", error)
    return NextResponse.json({ error: "Erro ao buscar usuários" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get("authorization")
    const token = authHeader?.replace("Bearer ", "")

    if (!token) return NextResponse.json({ error: "Token não fornecido" }, { status: 401 })

    const payload = verifyToken(token) as any
    if (!payload || !payload.userId) return NextResponse.json({ error: "Token inválido" }, { status: 401 })

    const currentUser = await db.getUserById(payload.userId)
    if (!currentUser) return NextResponse.json({ error: "Usuário não encontrado" }, { status: 401 })

    if (!hasPermission(currentUser.role as any, "users", "create")) {
      return NextResponse.json({ error: "Sem permissão" }, { status: 403 })
    }

    const body = await request.json()
    const validatedData = createUserSchema.parse(body)

    const existingUser = await db.getUserByEmail(validatedData.email)
    if (existingUser) return NextResponse.json({ error: "Email já cadastrado" }, { status: 400 })

    const passwordHash = await hashPassword(validatedData.password)

    const user = await db.createUser({
      name: validatedData.name,
      email: validatedData.email,
      password: passwordHash,
      role: validatedData.role as any,
      cpf: validatedData.cpf,
      emailVerified: true,
      isActive: true,
      sub: `local|${crypto.randomUUID()}`,
      roleId: validatedData.role,
      userId: crypto.randomUUID() as any, 
    })

    await db.createAuditLog({
      userId: currentUser.id,
      action: "create_user",
      resource: "user",
      userAgent: request.headers.get("user-agent") || "unknown",
      details: `User created: ${user.email}`,
      ipAddress: request.headers.get("x-forwarded-for") || "127.0.0.1",
    })

    const { password, ...sanitizedUser } = user as any

    return NextResponse.json({
      message: "Usuário criado com sucesso",
      user: sanitizedUser,
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors[0].message }, { status: 400 })
    }
    console.error("[API POST] Error:", error)
    return NextResponse.json({ error: "Erro ao criar usuário" }, { status: 500 })
  }
}
import { type NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"
import { verifyToken, hashPassword } from "@/lib/auth"
import { checkPermission } from "@/lib/permissions"
import { z } from "zod"

const createUserSchema = z.object({
  name: z.string().min(2, "Nome deve ter no mínimo 2 caracteres"),
  email: z.string().email("Email inválido"),
  password: z.string().min(8, "Senha deve ter no mínimo 8 caracteres"),
  role: z.enum(["user", "admin", "manager"]),
  cpf: z.string().optional(),
})

// GET /api/users - List users with pagination and filters
export async function GET(request: NextRequest) {
  try {
    // Get access token from header
    const authHeader = request.headers.get("authorization")
    const token = authHeader?.replace("Bearer ", "")

    if (!token) {
      return NextResponse.json({ error: "Token não fornecido" }, { status: 401 })
    }

    // Verify token
    const payload = verifyToken(token)
    if (!payload) {
      return NextResponse.json({ error: "Token inválido" }, { status: 401 })
    }

    // Get current user
    const currentUser = db.getUserById(payload.userId)
    if (!currentUser) {
      return NextResponse.json({ error: "Usuário não encontrado" }, { status: 401 })
    }

    // Check permission
    if (!checkPermission(currentUser.role, "users", "read")) {
      return NextResponse.json({ error: "Sem permissão para listar usuários" }, { status: 403 })
    }

    // Get query parameters
    const searchParams = request.nextUrl.searchParams
    const page = Number.parseInt(searchParams.get("page") || "1")
    const limit = Number.parseInt(searchParams.get("limit") || "10")
    const search = searchParams.get("search") || ""
    const role = searchParams.get("role") || ""
    const status = searchParams.get("status") || ""

    // Get users with filters
    let users = db.getAllUsers()

    // Apply filters
    if (search) {
      users = users.filter(
        (u) =>
          u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase()),
      )
    }

    if (role) {
      users = users.filter((u) => u.role === role)
    }

    if (status === "active") {
      users = users.filter((u) => u.isActive)
    } else if (status === "inactive") {
      users = users.filter((u) => !u.isActive)
    }

    // Pagination
    const total = users.length
    const startIndex = (page - 1) * limit
    const endIndex = startIndex + limit
    const paginatedUsers = users.slice(startIndex, endIndex)

    // Remove password from response
    const sanitizedUsers = paginatedUsers.map(({ password, ...user }) => user)

    return NextResponse.json({
      users: sanitizedUsers,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error("[v0] Get users error:", error)
    return NextResponse.json({ error: "Erro ao buscar usuários" }, { status: 500 })
  }
}

// POST /api/users - Create new user (admin only)
export async function POST(request: NextRequest) {
  try {
    // Get access token from header
    const authHeader = request.headers.get("authorization")
    const token = authHeader?.replace("Bearer ", "")

    if (!token) {
      return NextResponse.json({ error: "Token não fornecido" }, { status: 401 })
    }

    // Verify token
    const payload = verifyToken(token)
    if (!payload) {
      return NextResponse.json({ error: "Token inválido" }, { status: 401 })
    }

    // Get current user
    const currentUser = db.getUserById(payload.userId)
    if (!currentUser) {
      return NextResponse.json({ error: "Usuário não encontrado" }, { status: 401 })
    }

    // Check permission
    if (!checkPermission(currentUser.role, "users", "create")) {
      return NextResponse.json({ error: "Sem permissão para criar usuários" }, { status: 403 })
    }

    // Validate request body
    const body = await request.json()
    const validatedData = createUserSchema.parse(body)

    // Check if user already exists
    const existingUser = db.getUserByEmail(validatedData.email)
    if (existingUser) {
      return NextResponse.json({ error: "Email já cadastrado" }, { status: 400 })
    }

    // Hash password
    const passwordHash = await hashPassword(validatedData.password)

    // Create user
    const user = db.createUser({
      name: validatedData.name,
      email: validatedData.email,
      password: passwordHash,
      role: validatedData.role,
      cpf: validatedData.cpf,
      emailVerified: true, // Admin-created users are auto-verified
      isActive: true,
    })

    // Log activity
    db.createAuditLog({
      userId: currentUser.id,
      action: "create_user",
      resource: "user",
      resourceId: user.id,
      ip: request.headers.get("x-forwarded-for") || "unknown",
      userAgent: request.headers.get("user-agent") || "unknown",
    })

    // Remove password from response
    const { password, ...sanitizedUser } = user

    return NextResponse.json({
      message: "Usuário criado com sucesso",
      user: sanitizedUser,
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors[0].message }, { status: 400 })
    }
    console.error("[v0] Create user error:", error)
    return NextResponse.json({ error: "Erro ao criar usuário" }, { status: 500 })
  }
}

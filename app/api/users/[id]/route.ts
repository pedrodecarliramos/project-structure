import { type NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"
import { verifyToken, hashPassword } from "@/lib/auth"
import { hasPermission } from "@/lib/permissions" // Corrigido
import { z } from "zod"

const updateUserSchema = z.object({
  name: z.string().min(2).optional(),
  email: z.string().email().optional(),
  password: z.string().min(8).optional(),
  role: z.enum(["user", "admin", "manager"]).optional(),
  cpf: z.string().optional(),
  isActive: z.boolean().optional(),
})

// GET /api/users/[id] - Get user by ID
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const authHeader = request.headers.get("authorization")
    const token = authHeader?.replace("Bearer ", "")

    if (!token) return NextResponse.json({ error: "Token não fornecido" }, { status: 401 })

    const payload = verifyToken(token) as any
    if (!payload) return NextResponse.json({ error: "Token inválido" }, { status: 401 })

    // Corrigido: Adicionado await
    const currentUser = await db.getUserById(payload.userId)
    if (!currentUser) return NextResponse.json({ error: "Usuário não encontrado" }, { status: 401 })

    // Corrigido: Acesso após await e hasPermission
    const isOwnProfile = currentUser.id === params.id
    if (!isOwnProfile && !hasPermission(currentUser.role as any, "users", "read")) {
      return NextResponse.json({ error: "Sem permissão" }, { status: 403 })
    }

    // Corrigido: Adicionado await
    const user = await db.getUserById(params.id)
    if (!user) return NextResponse.json({ error: "Usuário não encontrado" }, { status: 404 })

    const { password, ...sanitizedUser } = user as any
    return NextResponse.json({ user: sanitizedUser })
  } catch (error) {
    console.error("[API GET ID] Error:", error)
    return NextResponse.json({ error: "Erro ao buscar usuário" }, { status: 500 })
  }
}

// PUT /api/users/[id] - Update user
export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const authHeader = request.headers.get("authorization")
    const token = authHeader?.replace("Bearer ", "")

    if (!token) return NextResponse.json({ error: "Token não fornecido" }, { status: 401 })

    const payload = verifyToken(token) as any
    if (!payload) return NextResponse.json({ error: "Token inválido" }, { status: 401 })

    // Corrigido: Adicionado await
    const currentUser = await db.getUserById(payload.userId)
    if (!currentUser) return NextResponse.json({ error: "Usuário não encontrado" }, { status: 401 })

    const isOwnProfile = currentUser.id === params.id
    if (!isOwnProfile && !hasPermission(currentUser.role as any, "users", "update")) {
      return NextResponse.json({ error: "Sem permissão" }, { status: 403 })
    }

    const body = await request.json()
    const validatedData = updateUserSchema.parse(body)

    const targetUser = await db.getUserById(params.id)
    if (!targetUser) return NextResponse.json({ error: "Usuário não encontrado" }, { status: 404 })

    const updateData: any = {}
    if (validatedData.name) updateData.name = validatedData.name
    if (validatedData.email) {
      const existingUser = await db.getUserByEmail(validatedData.email)
      if (existingUser && existingUser.id !== params.id) {
        return NextResponse.json({ error: "Email em uso" }, { status: 400 })
      }
      updateData.email = validatedData.email
    }
    if (validatedData.password) updateData.password = await hashPassword(validatedData.password)
    if (validatedData.cpf !== undefined) updateData.cpf = validatedData.cpf

    if (await hasPermission(currentUser.role as any, "users", "update")) {
      if (validatedData.role) updateData.role = validatedData.role
      if (validatedData.isActive !== undefined) updateData.isActive = validatedData.isActive
    }

    // Corrigido: Adicionado await
    const updatedUser = await db.updateUser(params.id, updateData)

    // Corrigido: Adicionado await e campos obrigatórios (details/ipAddress/resource)
    await db.createAuditLog({
      userId: currentUser.id,
      action: "update_user",
      resource: "user",
      userAgent: request.headers.get("user-agent") || "unknown",
      details: `Updated user ${params.id}`,
      ipAddress: request.headers.get("x-forwarded-for") || "127.0.0.1"
    })

    const { password, ...sanitizedUser } = updatedUser as any
    return NextResponse.json({ message: "Sucesso", user: sanitizedUser })
  } catch (error) {
    if (error instanceof z.ZodError) return NextResponse.json({ error: error.errors[0].message }, { status: 400 })
    return NextResponse.json({ error: "Erro ao atualizar" }, { status: 500 })
  }
}

// DELETE /api/users/[id] - Delete/deactivate user
export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const authHeader = request.headers.get("authorization")
    const token = authHeader?.replace("Bearer ", "")

    if (!token) return NextResponse.json({ error: "Token não fornecido" }, { status: 401 })

    const payload = verifyToken(token) as any
    if (!payload) return NextResponse.json({ error: "Token inválido" }, { status: 401 })

    const currentUser = await db.getUserById(payload.userId)
    if (!currentUser || !hasPermission(currentUser.role as any, "users", "delete")) {
      return NextResponse.json({ error: "Sem permissão" }, { status: 403 })
    }

    if (currentUser.id === params.id) {
      return NextResponse.json({ error: "Não pode deletar a própria conta" }, { status: 400 })
    }

    const targetUser = await db.getUserById(params.id)
    if (!targetUser) return NextResponse.json({ error: "Usuário não encontrado" }, { status: 404 })

    // Corrigido: Adicionado await
    await db.updateUser(params.id, { isActive: false })
    await db.revokeAllUserRefreshTokens(params.id)

    await db.createAuditLog({
      userId: currentUser.id,
      action: "delete_user",
      resource: "user",
      userAgent: request.headers.get("user-agent") || "unknown",
      details: `Deactivated user ${params.id}`,
      ipAddress: request.headers.get("x-forwarded-for") || "127.0.0.1"
    })

    return NextResponse.json({ message: "Usuário desativado" })
  } catch (error) {
    return NextResponse.json({ error: "Erro ao deletar" }, { status: 500 })
  }
}
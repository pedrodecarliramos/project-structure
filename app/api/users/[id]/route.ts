import { type NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"
import { verifyToken, hashPassword } from "@/lib/auth"
import { checkPermission } from "@/lib/permissions"
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

    // Check permission (can view own profile or has admin permission)
    const isOwnProfile = currentUser.id === params.id
    if (!isOwnProfile && !checkPermission(currentUser.role, "users", "read")) {
      return NextResponse.json({ error: "Sem permissão para visualizar este usuário" }, { status: 403 })
    }

    // Get user
    const user = db.getUserById(params.id)
    if (!user) {
      return NextResponse.json({ error: "Usuário não encontrado" }, { status: 404 })
    }

    // Remove password from response
    const { password, ...sanitizedUser } = user

    return NextResponse.json({ user: sanitizedUser })
  } catch (error) {
    console.error("[v0] Get user error:", error)
    return NextResponse.json({ error: "Erro ao buscar usuário" }, { status: 500 })
  }
}

// PUT /api/users/[id] - Update user
export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
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

    // Check permission (can edit own profile or has admin permission)
    const isOwnProfile = currentUser.id === params.id
    if (!isOwnProfile && !checkPermission(currentUser.role, "users", "update")) {
      return NextResponse.json({ error: "Sem permissão para editar este usuário" }, { status: 403 })
    }

    // Validate request body
    const body = await request.json()
    const validatedData = updateUserSchema.parse(body)

    // Get target user
    const targetUser = db.getUserById(params.id)
    if (!targetUser) {
      return NextResponse.json({ error: "Usuário não encontrado" }, { status: 404 })
    }

    // Prepare update data
    const updateData: any = {}

    if (validatedData.name) updateData.name = validatedData.name
    if (validatedData.email) {
      // Check if email is already taken
      const existingUser = db.getUserByEmail(validatedData.email)
      if (existingUser && existingUser.id !== params.id) {
        return NextResponse.json({ error: "Email já está em uso" }, { status: 400 })
      }
      updateData.email = validatedData.email
    }
    if (validatedData.password) {
      updateData.password = await hashPassword(validatedData.password)
    }
    if (validatedData.cpf !== undefined) updateData.cpf = validatedData.cpf

    // Only admins can change role and active status
    if (checkPermission(currentUser.role, "users", "update")) {
      if (validatedData.role) updateData.role = validatedData.role
      if (validatedData.isActive !== undefined) updateData.isActive = validatedData.isActive
    }

    // Update user
    const updatedUser = db.updateUser(params.id, updateData)

    // Log activity
    db.createAuditLog({
      userId: currentUser.id,
      action: "update_user",
      resource: "user",
      resourceId: params.id,
      ip: request.headers.get("x-forwarded-for") || "unknown",
      userAgent: request.headers.get("user-agent") || "unknown",
    })

    // Remove password from response
    const { password, ...sanitizedUser } = updatedUser

    return NextResponse.json({
      message: "Usuário atualizado com sucesso",
      user: sanitizedUser,
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors[0].message }, { status: 400 })
    }
    console.error("[v0] Update user error:", error)
    return NextResponse.json({ error: "Erro ao atualizar usuário" }, { status: 500 })
  }
}

// DELETE /api/users/[id] - Delete/deactivate user
export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
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
    if (!checkPermission(currentUser.role, "users", "delete")) {
      return NextResponse.json({ error: "Sem permissão para deletar usuários" }, { status: 403 })
    }

    // Prevent self-deletion
    if (currentUser.id === params.id) {
      return NextResponse.json({ error: "Você não pode deletar sua própria conta" }, { status: 400 })
    }

    // Get target user
    const targetUser = db.getUserById(params.id)
    if (!targetUser) {
      return NextResponse.json({ error: "Usuário não encontrado" }, { status: 404 })
    }

    // Soft delete (deactivate)
    db.updateUser(params.id, { isActive: false })

    // Revoke all refresh tokens
    db.revokeAllUserRefreshTokens(params.id)

    // Log activity
    db.createAuditLog({
      userId: currentUser.id,
      action: "delete_user",
      resource: "user",
      resourceId: params.id,
      ip: request.headers.get("x-forwarded-for") || "unknown",
      userAgent: request.headers.get("user-agent") || "unknown",
    })

    return NextResponse.json({
      message: "Usuário desativado com sucesso",
    })
  } catch (error) {
    console.error("[v0] Delete user error:", error)
    return NextResponse.json({ error: "Erro ao deletar usuário" }, { status: 500 })
  }
}

import { type NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"
import { verifyToken } from "@/lib/auth"
import { checkPermission } from "@/lib/permissions"

// GET /api/logs - Get audit logs with pagination and filters
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
    if (!checkPermission(currentUser.role, "logs", "read")) {
      return NextResponse.json({ error: "Sem permissão para visualizar logs" }, { status: 403 })
    }

    // Get query parameters
    const searchParams = request.nextUrl.searchParams
    const page = Number.parseInt(searchParams.get("page") || "1")
    const limit = Number.parseInt(searchParams.get("limit") || "20")
    const action = searchParams.get("action") || ""
    const userId = searchParams.get("userId") || ""
    const resource = searchParams.get("resource") || ""

    // Get logs with filters
    let logs = db.getAllAuditLogs()

    // Apply filters
    if (action) {
      logs = logs.filter((log) => log.action === action)
    }

    if (userId) {
      logs = logs.filter((log) => log.userId === userId)
    }

    if (resource) {
      logs = logs.filter((log) => log.resource === resource)
    }

    // Sort by date (newest first)
    logs.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())

    // Pagination
    const total = logs.length
    const startIndex = (page - 1) * limit
    const endIndex = startIndex + limit
    const paginatedLogs = logs.slice(startIndex, endIndex)

    // Enrich logs with user information
    const enrichedLogs = paginatedLogs.map((log) => {
      const user = db.getUserById(log.userId)
      return {
        ...log,
        userName: user?.name || "Usuário Desconhecido",
        userEmail: user?.email || "",
      }
    })

    return NextResponse.json({
      logs: enrichedLogs,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error("[v0] Get logs error:", error)
    return NextResponse.json({ error: "Erro ao buscar logs" }, { status: 500 })
  }
}

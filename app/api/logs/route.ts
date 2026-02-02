import { type NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"
import { verifyToken } from "@/lib/auth"
import { hasPermission } from "@/lib/permissions"

interface AuditLog {
  id: string;
  userId: string;
  action: string;
  resource: string;
  createdAt: Date;
}

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get("authorization")
    const token = authHeader?.replace("Bearer ", "")

    if (!token) {
      return NextResponse.json({ error: "Token não fornecido" }, { status: 401 })
    }

    const payload = await verifyToken(token)
    if (!payload) {
      return NextResponse.json({ error: "Token inválido" }, { status: 401 })
    }

    // O TS reclamava aqui porque achava que getUserById retornava 'void'
    const currentUser = await db.getUserById(payload.userId as unknown as string)
    
    if (!currentUser) {
      return NextResponse.json({ error: "Usuário não encontrado" }, { status: 401 })
    }

    if (!hasPermission(currentUser.role as any, "logs", "read")) {
      return NextResponse.json({ error: "Sem permissão" }, { status: 403 })
    }

    const searchParams = request.nextUrl.searchParams
    const page = Number.parseInt(searchParams.get("page") || "1")
    const limit = Number.parseInt(searchParams.get("limit") || "20")
    const action = searchParams.get("action") || ""
    const userId = searchParams.get("userId") || ""
    const resource = searchParams.get("resource") || ""

    // Aqui garantimos que logs seja um array, mesmo que o DB falhe
    const rawLogs = await db.getAuditLogs()
    let logs: AuditLog[] = Array.isArray(rawLogs) ? rawLogs : []

    if (action) {
      logs = logs.filter((log) => log.action === action)
    }

    if (userId) {
      logs = logs.filter((log) => log.userId === userId)
    }

    if (resource) {
      logs = logs.filter((log) => log.resource === resource)
    }

    logs.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())

    const total = logs.length
    const startIndex = (page - 1) * limit
    const paginatedLogs = logs.slice(startIndex, startIndex + limit)

    const enrichedLogs = await Promise.all(
      paginatedLogs.map(async (log) => {
        const user = await db.getUserById(log.userId)
        return {
          ...log,
          userName: user?.name || "Usuário Desconhecido",
          userEmail: user?.email || "",
        }
      })
    )

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
    console.error("Get logs error:", error)
    return NextResponse.json({ error: "Erro ao buscar logs" }, { status: 500 })
  }
}
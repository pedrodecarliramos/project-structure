import { type NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"
import { verifyToken } from "@/lib/auth"
import { hasPermission } from "@/lib/permissions" // 1. Fixed import name

// If you don't have a global Log type, define it here or import it
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

    const currentUser = await db.getUserById(payload.userId as unknown as string)
    if (!currentUser) {
      return NextResponse.json({ error: "Usuário não encontrado" }, { status: 401 })
    }

    // 2. Changed 'checkPermission' to 'hasPermission'
    if (!hasPermission(currentUser.role as any, "logs", "read")) {
  return NextResponse.json({ error: "Sem permissão para visualizar logs" }, { status: 403 })
}

    const searchParams = request.nextUrl.searchParams
    const page = Number.parseInt(searchParams.get("page") || "1")
    const limit = Number.parseInt(searchParams.get("limit") || "20")
    const action = searchParams.get("action") || ""
    const userId = searchParams.get("userId") || ""
    const resource = searchParams.get("resource") || ""

    // 3. Ensure this method exists in your db.ts. 
    // If db.getAuditLogs() is the correct name, use that.
    let logs: AuditLog[] = await db.getAuditLogs() 

    // 4. Added explicit types to callback parameters
    if (action) {
      logs = logs.filter((log: AuditLog) => log.action === action)
    }

    if (userId) {
      logs = logs.filter((log: AuditLog) => log.userId === userId)
    }

    if (resource) {
      logs = logs.filter((log: AuditLog) => log.resource === resource)
    }

    // 5. Added types to sort parameters
    logs.sort((a: AuditLog, b: AuditLog) => b.createdAt.getTime() - a.createdAt.getTime())

    const total = logs.length
    const startIndex = (page - 1) * limit
    const endIndex = startIndex + limit
    const paginatedLogs = logs.slice(startIndex, endIndex)

    const enrichedLogs = await Promise.all(
      paginatedLogs.map(async (log: AuditLog) => {
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
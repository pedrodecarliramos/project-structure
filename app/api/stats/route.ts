import { type NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"
import { verifyToken } from "@/lib/auth"
import { hasPermission } from "@/lib/permissions"
import type { User, AuditLog } from "@/lib/types"

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get("authorization")
    const token = authHeader?.replace("Bearer ", "")

    if (!token) {
      return NextResponse.json({ error: "Token não fornecido" }, { status: 401 })
    }

    const payload = (await verifyToken(token)) as any
    if (!payload || !payload.userId) {
      return NextResponse.json({ error: "Token inválido" }, { status: 401 })
    }

    const currentUser = await db.getUserById(payload.userId)
    if (!currentUser) {
      return NextResponse.json({ error: "Usuário não encontrado" }, { status: 401 })
    }

    const roleId = String(currentUser.roleId)
    const canRead = (hasPermission as any)(roleId, "stats", "read")

    if (!canRead) {
      return NextResponse.json({ error: "Sem permissão para visualizar estatísticas" }, { status: 403 })
    }

    const users = await db.getUsers()
    const logs = await db.getAuditLogs()

    const totalUsers = users.length
    const activeUsers = users.filter((u: User) => u.isActive).length
    const verifiedUsers = users.filter((u: User) => u.emailVerified).length

    const usersByRole = users.reduce(
      (acc: Record<string, number>, user: User) => {
        const roleName = user.roleId || "user"
        acc[roleName] = (acc[roleName] || 0) + 1
        return acc
      },
      {} as Record<string, number>,
    )

    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
    const recentSignups = users.filter((u: User) => new Date(u.createdAt) >= thirtyDaysAgo).length

    const sevenDaysAgo = new Date()
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)
    const recentLogs = logs.filter((log: AuditLog) => new Date(log.createdAt) >= sevenDaysAgo)

    const activityByDay = recentLogs.reduce(
      (acc: Record<string, number>, log: AuditLog) => {
        const date = new Date(log.createdAt).toISOString().split("T")[0]
        acc[date] = (acc[date] || 0) + 1
        return acc
      },
      {} as Record<string, number>,
    )

    const actionCounts = logs.reduce(
      (acc: Record<string, number>, log: AuditLog) => {
        acc[log.action] = (acc[log.action] || 0) + 1
        return acc
      },
      {} as Record<string, number>,
    )

    return NextResponse.json({
      overview: {
        totalUsers,
        activeUsers,
        verifiedUsers,
        recentSignups,
      },
      usersByRole,
      activityByDay,
      actionCounts,
    })
  } catch (error) {
    console.error("[v0] Get stats error:", error)
    return NextResponse.json({ error: "Erro ao buscar estatísticas" }, { status: 500 })
  }
}
import { type NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"
import { verifyToken } from "@/lib/auth"
import { checkPermission } from "@/lib/permissions"

// GET /api/stats - Get statistics for admin dashboard
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
    if (!checkPermission(currentUser.role, "stats", "read")) {
      return NextResponse.json({ error: "Sem permissão para visualizar estatísticas" }, { status: 403 })
    }

    // Get all users
    const users = db.getAllUsers()
    const logs = db.getAllAuditLogs()

    // Calculate statistics
    const totalUsers = users.length
    const activeUsers = users.filter((u) => u.isActive).length
    const verifiedUsers = users.filter((u) => u.emailVerified).length

    // Users by role
    const usersByRole = users.reduce(
      (acc, user) => {
        acc[user.role] = (acc[user.role] || 0) + 1
        return acc
      },
      {} as Record<string, number>,
    )

    // Recent signups (last 30 days)
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
    const recentSignups = users.filter((u) => u.createdAt >= thirtyDaysAgo).length

    // Activity by day (last 7 days)
    const sevenDaysAgo = new Date()
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)
    const recentLogs = logs.filter((log) => log.createdAt >= sevenDaysAgo)

    const activityByDay = recentLogs.reduce(
      (acc, log) => {
        const date = log.createdAt.toISOString().split("T")[0]
        acc[date] = (acc[date] || 0) + 1
        return acc
      },
      {} as Record<string, number>,
    )

    // Most common actions
    const actionCounts = logs.reduce(
      (acc, log) => {
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

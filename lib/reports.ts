// Report generation utilities
import type { User, AuditLog } from "./types"

export interface UserReport {
  totalUsers: number
  activeUsers: number
  inactiveUsers: number
  verifiedUsers: number
  usersByRole: Record<string, number>
  recentSignups: number
}

export interface ActivityReport {
  totalLogs: number
  loginCount: number
  actionsByType: Record<string, number>
  activeUsersToday: number
  mostActiveUsers: { userId: string; count: number }[]
}

export function generateUserReport(users: User[]): UserReport {
  const now = new Date()
  const last30Days = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)

  return {
    totalUsers: users.length,
    activeUsers: users.filter((u) => u.isActive).length,
    inactiveUsers: users.filter((u) => !u.isActive).length,
    verifiedUsers: users.filter((u) => u.emailVerified).length,
    usersByRole: users.reduce(
      (acc, user) => {
        acc[user.roleId] = (acc[user.roleId] || 0) + 1
        return acc
      },
      {} as Record<string, number>,
    ),
    recentSignups: users.filter((u) => new Date(u.createdAt) > last30Days).length,
  }
}

export function generateActivityReport(logs: AuditLog[]): ActivityReport {
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const todayLogs = logs.filter((l) => new Date(l.createdAt) >= today)

  return {
    totalLogs: logs.length,
    loginCount: logs.filter((l) => l.action === "USER_LOGIN").length,
    actionsByType: logs.reduce(
      (acc, log) => {
        acc[log.action] = (acc[log.action] || 0) + 1
        return acc
      },
      {} as Record<string, number>,
    ),
    activeUsersToday: new Set(todayLogs.map((l) => l.userId)).size,
    mostActiveUsers: Object.entries(
      logs.reduce(
        (acc, log) => {
          acc[log.userId] = (acc[log.userId] || 0) + 1
          return acc
        },
        {} as Record<string, number>,
      ),
    )
      .map(([userId, count]) => ({ userId, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5),
  }
}

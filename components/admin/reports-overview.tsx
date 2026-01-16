"use client"

import { useState, useEffect } from "react"
import { db } from "@/lib/db"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, UserCheck, UserX, Activity } from "lucide-react"

export function ReportsOverview() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeUsers: 0,
    inactiveUsers: 0,
    totalLogs: 0,
  })

  useEffect(() => {
    loadStats()
  }, [])

  const loadStats = async () => {
    const users = await db.getUsers()
    const logs = await db.getAuditLogs()

    setStats({
      totalUsers: users.length,
      activeUsers: users.filter((u) => u.isActive).length,
      inactiveUsers: users.filter((u) => !u.isActive).length,
      totalLogs: logs.length,
    })
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
      <Card className="glass-strong">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Total de Usuários</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.totalUsers}</div>
          <p className="text-xs text-muted-foreground">Todos os usuários cadastrados</p>
        </CardContent>
      </Card>

      <Card className="glass-strong">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Usuários Ativos</CardTitle>
          <UserCheck className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.activeUsers}</div>
          <p className="text-xs text-muted-foreground">
            {stats.totalUsers > 0 ? Math.round((stats.activeUsers / stats.totalUsers) * 100) : 0}% do total
          </p>
        </CardContent>
      </Card>

      <Card className="glass-strong">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Usuários Inativos</CardTitle>
          <UserX className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.inactiveUsers}</div>
          <p className="text-xs text-muted-foreground">
            {stats.totalUsers > 0 ? Math.round((stats.inactiveUsers / stats.totalUsers) * 100) : 0}% do total
          </p>
        </CardContent>
      </Card>

      <Card className="glass-strong">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Total de Logs</CardTitle>
          <Activity className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.totalLogs}</div>
          <p className="text-xs text-muted-foreground">Eventos registrados</p>
        </CardContent>
      </Card>
    </div>
  )
}

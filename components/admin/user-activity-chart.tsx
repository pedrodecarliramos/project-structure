"use client"

import { useState, useEffect } from "react"
import { db } from "@/lib/db"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, ResponsiveContainer } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

export function UserActivityChart() {
  const [data, setData] = useState<{ date: string; logins: number; actions: number }[]>([])

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    const logs = await db.getAuditLogs()

    // Group by date
    const grouped = logs.reduce(
      (acc, log) => {
        const date = new Date(log.createdAt).toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit" })
        if (!acc[date]) {
          acc[date] = { logins: 0, actions: 0 }
        }
        if (log.action === "USER_LOGIN") {
          acc[date].logins++
        } else {
          acc[date].actions++
        }
        return acc
      },
      {} as Record<string, { logins: number; actions: number }>,
    )

    const chartData = Object.entries(grouped)
      .map(([date, counts]) => ({
        date,
        logins: counts.logins,
        actions: counts.actions,
      }))
      .slice(-7) // Last 7 days

    setData(chartData)
  }

  return (
    <Card className="glass-strong">
      <CardHeader>
        <CardTitle>Atividade de Usuários</CardTitle>
        <CardDescription>Logins e ações dos últimos 7 dias</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={{
            logins: {
              label: "Logins",
              color: "hsl(var(--chart-1))",
            },
            actions: {
              label: "Ações",
              color: "hsl(var(--chart-2))",
            },
          }}
          className="h-[300px]"
        >
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis dataKey="date" className="text-xs" />
              <YAxis className="text-xs" />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Bar dataKey="logins" fill="var(--color-logins)" radius={[4, 4, 0, 0]} />
              <Bar dataKey="actions" fill="var(--color-actions)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}

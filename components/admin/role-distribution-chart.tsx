"use client"

import { useState, useEffect } from "react"
import { db } from "@/lib/db"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Pie, PieChart, Cell, ResponsiveContainer, Legend } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

const COLORS = ["hsl(var(--chart-1))", "hsl(var(--chart-2))", "hsl(var(--chart-3))"]

export function RoleDistributionChart() {
  const [data, setData] = useState<{ name: string; value: number }[]>([])

  useEffect(() => {
    loadData()
  }, [])

  async function loadData() {
  const users = (await db.getUsers()) ?? []
  const roles = (await db.getRoles()) ?? []

  const distribution = roles.map((role) => ({
    name: role.name,
    value: users.filter((u) => u.roleId === role.id).length,
  }))

  setData(distribution)
}

  return (
    <Card className="glass-strong">
      <CardHeader>
        <CardTitle>Distribuição de Funções</CardTitle>
        <CardDescription>Usuários por função no sistema</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={{
            users: {
              label: "Usuários",
            },
          }}
          className="h-300px"
        >
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={data} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <ChartTooltip content={<ChartTooltipContent />} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}

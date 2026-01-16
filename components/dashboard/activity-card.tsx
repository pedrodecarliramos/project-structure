"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Clock } from "lucide-react"

const activities = [
  { action: "Login realizado", time: "Há 5 minutos" },
  { action: "Perfil atualizado", time: "Há 2 horas" },
  { action: "Senha alterada", time: "Há 1 dia" },
]

export function ActivityCard() {
  return (
    <Card className="glass-strong">
      <CardHeader>
        <CardTitle>Atividade Recente</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.map((activity, index) => (
            <div key={index} className="flex items-start gap-3">
              <div className="rounded-full bg-primary/10 p-2">
                <Clock className="h-4 w-4 text-primary" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium">{activity.action}</p>
                <p className="text-xs text-muted-foreground">{activity.time}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

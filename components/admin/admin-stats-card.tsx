import { Card, CardContent } from "@/components/ui/card"
import type { LucideIcon } from "lucide-react"
import { TrendingUp, TrendingDown } from "lucide-react"

interface AdminStatsCardProps {
  title: string
  value: string
  icon: LucideIcon
  trend: string
}

export function AdminStatsCard({ title, value, icon: Icon, trend }: AdminStatsCardProps) {
  const isPositive = trend.startsWith("+")
  const TrendIcon = isPositive ? TrendingUp : TrendingDown

  return (
    <Card className="glass-strong">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="rounded-full bg-primary/10 p-3">
            <Icon className="h-6 w-6 text-primary" />
          </div>
          <div className={cn("flex items-center gap-1 text-sm", isPositive ? "text-primary" : "text-muted-foreground")}>
            <TrendIcon className="h-4 w-4" />
            <span>{trend}</span>
          </div>
        </div>
        <div className="space-y-1">
          <p className="text-sm text-muted-foreground">{title}</p>
          <p className="text-3xl font-bold">{value}</p>
        </div>
      </CardContent>
    </Card>
  )
}

function cn(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(" ")
}

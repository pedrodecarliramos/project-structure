import { DashboardLayout } from "@/components/dashboard/dashboard-layout"
import { ProfileCard } from "@/components/dashboard/profile-card"
import { ActivityCard } from "@/components/dashboard/activity-card"
import { StatsCard } from "@/components/dashboard/stats-card"
import { User, Clock, Shield } from "lucide-react"

export default function DashboardPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Painel do Usuário</h1>
          <p className="text-muted-foreground">Bem-vindo ao seu painel de controle</p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          <StatsCard title="Perfil Completo" value="100%" icon={User} description="Todas as informações preenchidas" />
          <StatsCard title="Último Acesso" value="Hoje" icon={Clock} description="Você está ativo no sistema" />
          <StatsCard title="Segurança" value="Alta" icon={Shield} description="Conta protegida e verificada" />
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <ProfileCard />
          <ActivityCard />
        </div>
      </div>
    </DashboardLayout>
  )
}

import { AdminLayout } from "@/components/admin/layout"
import { AdminStatsCard } from "@/components/admin/admin-stats-card"
import { SecuritySettings } from "@/components/admin/security-settings"
import { Users, UserCheck, Shield, Activity } from "lucide-react"

export default function AdminPage() {
  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Painel Administrativo</h1>
          <p className="text-muted-foreground">Visão geral do sistema</p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <AdminStatsCard title="Total de Usuários" value="0" icon={Users} trend="+0%" />
          <AdminStatsCard title="Usuários Ativos" value="0" icon={UserCheck} trend="+0%" />
          <AdminStatsCard title="Administradores" value="0" icon={Shield} trend="0%" />
          <AdminStatsCard title="Atividades Hoje" value="0" icon={Activity} trend="+0%" />
        </div>

        <div>
          <h2 className="text-2xl font-bold mb-4">Configurações de Segurança</h2>
          <SecuritySettings />
        </div>
      </div>
    </AdminLayout>
  )
}

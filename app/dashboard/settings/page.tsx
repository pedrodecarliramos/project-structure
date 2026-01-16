import { DashboardLayout } from "@/components/dashboard/dashboard-layout"
import { SettingsForm } from "@/components/dashboard/settings-form"

export default function SettingsPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Configurações</h1>
          <p className="text-muted-foreground">Gerencie suas preferências e segurança</p>
        </div>

        <div className="glass-strong rounded-2xl p-6 md:p-8">
          <SettingsForm />
        </div>
      </div>
    </DashboardLayout>
  )
}

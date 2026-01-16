import { DashboardLayout } from "@/components/dashboard/dashboard-layout"
import { ProfileForm } from "@/components/dashboard/profile-form"

export default function ProfilePage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Meu Perfil</h1>
          <p className="text-muted-foreground">Gerencie suas informações pessoais</p>
        </div>

        <div className="glass-strong rounded-2xl p-6 md:p-8">
          <ProfileForm />
        </div>
      </div>
    </DashboardLayout>
  )
}

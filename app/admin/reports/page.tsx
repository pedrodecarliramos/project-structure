import { AdminLayout } from "@/components/admin/admin-layout"
import { ReportsOverview } from "@/components/admin/reports-overview"
import { UserActivityChart } from "@/components/admin/user-activity-chart"
import { RoleDistributionChart } from "@/components/admin/role-distribution-chart"
import { ExportData } from "@/components/admin/export-data"

export default function AdminReportsPage() {
  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Relatórios e Análises</h1>
            <p className="text-muted-foreground">Visualize métricas e exporte dados</p>
          </div>
          <ExportData />
        </div>

        <ReportsOverview />

        <div className="grid gap-6 lg:grid-cols-2">
          <UserActivityChart />
          <RoleDistributionChart />
        </div>
      </div>
    </AdminLayout>
  )
}

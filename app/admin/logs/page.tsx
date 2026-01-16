import { AdminLayout } from "@/components/admin/admin-layout"
import { AuditLogsTable } from "@/components/admin/audit-logs-table"

export default function AdminLogsPage() {
  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Logs de Auditoria</h1>
          <p className="text-muted-foreground">Visualize todas as atividades do sistema</p>
        </div>

        <AuditLogsTable />
      </div>
    </AdminLayout>
  )
}

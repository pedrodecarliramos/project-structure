import { AdminLayout } from "@/components/admin/admin-layout"
import { RolesTable } from "@/components/admin/roles-table"

export default function AdminRolesPage() {
  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Gerenciar Funções</h1>
          <p className="text-muted-foreground">Configure funções e permissões do sistema</p>
        </div>

        <RolesTable />
      </div>
    </AdminLayout>
  )
}

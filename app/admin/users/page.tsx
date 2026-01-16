import { AdminLayout } from "@/components/admin/admin-layout"
import { UsersTable } from "@/components/admin/users-table"

export default function AdminUsersPage() {
  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Gerenciar Usuários</h1>
          <p className="text-muted-foreground">Visualize e gerencie todos os usuários do sistema</p>
        </div>

        <UsersTable />
      </div>
    </AdminLayout>
  )
}

"use client"

import { useState, useEffect } from "react"
import { db } from "@/lib/db"
import type { User, Role } from "@/lib/types"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Edit, Trash2, Search, UserPlus } from "lucide-react"
import { EditUserDialog } from "./edit-user-dialog"
import { CreateUserDialog } from "./create-user-dialog"

export function UsersTable() {
  const [users, setUsers] = useState<User[]>([])
  const [roles, setRoles] = useState<Role[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [showEditDialog, setShowEditDialog] = useState(false)
  const [showCreateDialog, setShowCreateDialog] = useState(false)

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    const usersData = await db.getUsers()
    const rolesData = await db.getRoles()
    setUsers(usersData)
    setRoles(rolesData)
  }

  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const getRoleName = (roleId: string) => {
    const role = roles.find((r) => r.id === roleId)
    return role?.name || roleId
  }

  const handleEdit = (user: User) => {
    setSelectedUser(user)
    setShowEditDialog(true)
  }

  const handleDelete = async (userId: string) => {
    if (confirm("Tem certeza que deseja excluir este usuário?")) {
      await db.deleteUser(userId)
      loadData()
    }
  }

  const handleSave = () => {
    loadData()
    setShowEditDialog(false)
    setShowCreateDialog(false)
  }

  return (
    <div className="space-y-4">
      <div className="glass-strong rounded-2xl p-6">
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar usuários..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Button onClick={() => setShowCreateDialog(true)}>
            <UserPlus className="mr-2 h-4 w-4" />
            Novo Usuário
          </Button>
        </div>

        <div className="rounded-lg border border-border/50 overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead>Nome</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Função</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center text-muted-foreground py-8">
                    Nenhum usuário encontrado
                  </TableCell>
                </TableRow>
              ) : (
                filteredUsers.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell className="font-medium">{user.name}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>
                      <Badge variant="secondary">{getRoleName(user.roleId)}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={user.isActive ? "default" : "destructive"}>
                        {user.isActive ? "Ativo" : "Inativo"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="sm" onClick={() => handleEdit(user)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => handleDelete(user.id)}>
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {selectedUser && (
        <EditUserDialog
          user={selectedUser}
          roles={roles}
          open={showEditDialog}
          onOpenChange={setShowEditDialog}
          onSave={handleSave}
        />
      )}

      <CreateUserDialog roles={roles} open={showCreateDialog} onOpenChange={setShowCreateDialog} onSave={handleSave} />
    </div>
  )
}

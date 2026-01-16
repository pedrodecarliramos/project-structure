"use client"

import { useState, useEffect } from "react"
import { db } from "@/lib/db"
import type { Role } from "@/lib/types"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"

export function RolesTable() {
  const [roles, setRoles] = useState<Role[]>([])

  useEffect(() => {
    loadRoles()
  }, [])

  const loadRoles = async () => {
    const rolesData = await db.getRoles()
    setRoles(rolesData)
  }

  return (
    <div className="glass-strong rounded-2xl p-6">
      <div className="rounded-lg border border-border/50 overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead>Nome</TableHead>
              <TableHead>Descrição</TableHead>
              <TableHead>Permissões</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {roles.map((role) => (
              <TableRow key={role.id}>
                <TableCell className="font-medium">{role.name}</TableCell>
                <TableCell>{role.description}</TableCell>
                <TableCell>
                  <div className="flex flex-wrap gap-2">
                    {role.permissions.map((permission, index) => (
                      <Badge key={index} variant="secondary">
                        {permission}
                      </Badge>
                    ))}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}

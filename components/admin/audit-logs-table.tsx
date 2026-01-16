"use client"

import { useState, useEffect } from "react"
import { db } from "@/lib/db"
import type { AuditLog, User } from "@/lib/types"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Filter } from "lucide-react"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"

export function AuditLogsTable() {
  const [logs, setLogs] = useState<AuditLog[]>([])
  const [users, setUsers] = useState<User[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [actionFilter, setActionFilter] = useState("all")

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    const logsData = await db.getAuditLogs()
    const usersData = await db.getUsers()
    setLogs(logsData.reverse()) // Most recent first
    setUsers(usersData)
  }

  const getUserName = (userId: string) => {
    const user = users.find((u) => u.id === userId)
    return user?.name || "Usuário desconhecido"
  }

  const filteredLogs = logs.filter((log) => {
    const matchesSearch =
      getUserName(log.userId).toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.resource.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesAction = actionFilter === "all" || log.action === actionFilter

    return matchesSearch && matchesAction
  })

  const uniqueActions = Array.from(new Set(logs.map((log) => log.action)))

  const getActionBadgeVariant = (action: string) => {
    if (action.includes("CREATE")) return "default"
    if (action.includes("UPDATE")) return "secondary"
    if (action.includes("DELETE")) return "destructive"
    if (action.includes("LOGIN")) return "outline"
    return "secondary"
  }

  return (
    <div className="space-y-4">
      <div className="glass-strong rounded-2xl p-6">
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar logs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <Select value={actionFilter} onValueChange={setActionFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filtrar ação" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas as ações</SelectItem>
                {uniqueActions.map((action) => (
                  <SelectItem key={action} value={action}>
                    {action}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="rounded-lg border border-border/50 overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead>Data/Hora</TableHead>
                <TableHead>Usuário</TableHead>
                <TableHead>Ação</TableHead>
                <TableHead>Recurso</TableHead>
                <TableHead>Detalhes</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredLogs.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center text-muted-foreground py-8">
                    Nenhum log encontrado
                  </TableCell>
                </TableRow>
              ) : (
                filteredLogs.map((log) => (
                  <TableRow key={log.id}>
                    <TableCell className="font-mono text-sm">
                      {format(new Date(log.createdAt), "dd/MM/yyyy HH:mm:ss", { locale: ptBR })}
                    </TableCell>
                    <TableCell>{getUserName(log.userId)}</TableCell>
                    <TableCell>
                      <Badge variant={getActionBadgeVariant(log.action)}>{log.action}</Badge>
                    </TableCell>
                    <TableCell className="font-medium">{log.resource}</TableCell>
                    <TableCell className="text-muted-foreground text-sm">{log.details}</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        <div className="mt-4 text-sm text-muted-foreground">
          Mostrando {filteredLogs.length} de {logs.length} logs
        </div>
      </div>
    </div>
  )
}

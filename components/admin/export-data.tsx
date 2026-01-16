"use client"

import { useState } from "react"
import { db } from "@/lib/db"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Download, FileJson, FileSpreadsheet } from "lucide-react"

export function ExportData() {
  const [loading, setLoading] = useState(false)

  const exportToJSON = async (type: "users" | "logs") => {
    setLoading(true)
    try {
      let data
      let filename

      if (type === "users") {
        data = await db.getUsers()
        filename = "usuarios.json"
      } else {
        data = await db.getAuditLogs()
        filename = "logs.json"
      }

      const json = JSON.stringify(data, null, 2)
      const blob = new Blob([json], { type: "application/json" })
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = filename
      a.click()
      URL.revokeObjectURL(url)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const exportToCSV = async (type: "users" | "logs") => {
    setLoading(true)
    try {
      let csv
      let filename

      if (type === "users") {
        const users = await db.getUsers()
        const headers = ["ID", "Nome", "Email", "Função", "Status", "Data de Criação"]
        const rows = users.map((u) => [
          u.id,
          u.name,
          u.email,
          u.roleId,
          u.isActive ? "Ativo" : "Inativo",
          new Date(u.createdAt).toLocaleString("pt-BR"),
        ])
        csv = [headers, ...rows].map((row) => row.join(",")).join("\n")
        filename = "usuarios.csv"
      } else {
        const logs = await db.getAuditLogs()
        const headers = ["ID", "Usuário ID", "Ação", "Recurso", "Detalhes", "Data/Hora"]
        const rows = logs.map((l) => [
          l.id,
          l.userId,
          l.action,
          l.resource,
          l.details,
          new Date(l.createdAt).toLocaleString("pt-BR"),
        ])
        csv = [headers, ...rows].map((row) => row.join(",")).join("\n")
        filename = "logs.csv"
      }

      const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" })
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = filename
      a.click()
      URL.revokeObjectURL(url)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button disabled={loading}>
          <Download className="mr-2 h-4 w-4" />
          Exportar Dados
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="glass-strong">
        <DropdownMenuItem onClick={() => exportToJSON("users")}>
          <FileJson className="mr-2 h-4 w-4" />
          Usuários (JSON)
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => exportToCSV("users")}>
          <FileSpreadsheet className="mr-2 h-4 w-4" />
          Usuários (CSV)
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => exportToJSON("logs")}>
          <FileJson className="mr-2 h-4 w-4" />
          Logs (JSON)
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => exportToCSV("logs")}>
          <FileSpreadsheet className="mr-2 h-4 w-4" />
          Logs (CSV)
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

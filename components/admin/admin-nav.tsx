"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { LayoutDashboard, Users, Shield, FileText, BarChart3, Home } from "lucide-react"

const navItems = [
  { href: "/admin", label: "Visão Geral", icon: LayoutDashboard },
  { href: "/admin/users", label: "Usuários", icon: Users },
  { href: "/admin/roles", label: "Funções", icon: Shield },
  { href: "/admin/logs", label: "Logs de Auditoria", icon: FileText },
  { href: "/admin/reports", label: "Relatórios", icon: BarChart3 },
]

export function AdminNav() {
  const pathname = usePathname()

  return (
    <nav className="hidden lg:flex lg:flex-col lg:fixed lg:inset-y-0 lg:w-64 lg:pt-16">
      <div className="glass-strong border-r border-border/50 h-full p-6">
        <div className="space-y-1">
          <Link
            href="/dashboard"
            className="flex items-center gap-3 px-4 py-3 rounded-lg text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors mb-4"
          >
            <Home className="h-5 w-5" />
            <span className="font-medium">Voltar ao Dashboard</span>
          </Link>

          <div className="border-t border-border/50 my-4" />

          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-lg transition-colors",
                  isActive
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
                )}
              >
                <Icon className="h-5 w-5" />
                <span className="font-medium">{item.label}</span>
              </Link>
            )
          })}
        </div>
      </div>
    </nav>
  )
}

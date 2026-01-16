"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Home, User, Settings, Shield } from "lucide-react"
import { useAuth } from "@/hooks/use-auth"

const navItems = [
  { href: "/dashboard", label: "Início", icon: Home },
  { href: "/dashboard/profile", label: "Perfil", icon: User },
  { href: "/dashboard/settings", label: "Configurações", icon: Settings },
]

const adminNavItems = [{ href: "/admin", label: "Admin", icon: Shield }]

export function DashboardNav() {
  const pathname = usePathname()
  const { user } = useAuth()

  const isAdmin = user?.roleId === "admin"

  return (
    <nav className="hidden lg:flex lg:flex-col lg:fixed lg:inset-y-0 lg:w-64 lg:pt-16">
      <div className="glass-strong border-r border-border/50 h-full p-6">
        <div className="space-y-1">
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

          {isAdmin && (
            <>
              <div className="my-4 border-t border-border/50" />
              {adminNavItems.map((item) => {
                const Icon = item.icon
                const isActive = pathname.startsWith(item.href)

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
            </>
          )}
        </div>
      </div>
    </nav>
  )
}

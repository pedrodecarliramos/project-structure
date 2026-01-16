"use client"

import type React from "react"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/hooks/use-auth"
import { DashboardNav } from "./dashboard-nav"
import { DashboardHeader } from "./dashboard-header"

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const { isAuthenticated, user } = useAuth()

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login")
    }
  }, [isAuthenticated, router])

  if (!isAuthenticated) {
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 via-background to-secondary/10">
      <DashboardHeader />
      <div className="flex">
        <DashboardNav />
        <main className="flex-1 p-6 md:p-8 lg:ml-64">{children}</main>
      </div>
    </div>
  )
}

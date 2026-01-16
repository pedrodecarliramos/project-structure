"use client"

import type React from "react"

import { useEffect } from "react"
import { db } from "@/lib/db"

export function AuthProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    db.initializeRoles()
  }, [])

  return <>{children}</>
}

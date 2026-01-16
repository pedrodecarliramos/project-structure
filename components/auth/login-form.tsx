"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useAuth } from "@/hooks/use-auth"
import { signIn } from "@/lib/auth"
import Link from "next/link"
import { Loader2 } from "lucide-react"

export function LoginForm() {
  const router = useRouter()
  const { setAuth } = useAuth()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      const result = await signIn(email, password)

      if (result.success && result.token && result.user) {
        setAuth(result.user, result.token)

        // Redirect based on role
        if (result.user.roleId === "admin") {
          router.push("/admin")
        } else {
          router.push("/dashboard")
        }
      } else {
        setError(result.error || "Erro ao fazer login")
      }
    } catch (err) {
      setError("Erro ao fazer login")
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          placeholder="seu@email.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          disabled={loading}
        />
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label htmlFor="password">Senha</Label>
          <Link href="/forgot-password" className="text-sm text-primary hover:underline">
            Esqueceu?
          </Link>
        </div>
        <Input
          id="password"
          type="password"
          placeholder="••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          disabled={loading}
        />
      </div>

      {error && <div className="text-sm text-destructive bg-destructive/10 p-3 rounded-lg">{error}</div>}

      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Entrando...
          </>
        ) : (
          "Entrar"
        )}
      </Button>
    </form>
  )
}

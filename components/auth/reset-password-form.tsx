"use client"

import type React from "react"

import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { resetPassword } from "@/lib/auth"
import { Loader2, CheckCircle2 } from "lucide-react"

export function ResetPasswordForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const token = searchParams.get("token") || ""

  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    if (password !== confirmPassword) {
      setError("As senhas não coincidem")
      setLoading(false)
      return
    }

    if (password.length < 6) {
      setError("A senha deve ter pelo menos 6 caracteres")
      setLoading(false)
      return
    }

    try {
      const result = await resetPassword(token, password)

      if (result.success) {
        setSuccess(true)
        setTimeout(() => {
          router.push("/login")
        }, 2000)
      } else {
        setError(result.error || "Erro ao redefinir senha")
      }
    } catch (err) {
      setError("Erro ao redefinir senha")
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="text-center space-y-4">
        <CheckCircle2 className="h-16 w-16 text-primary mx-auto" />
        <div className="space-y-2">
          <h3 className="text-xl font-semibold">Senha alterada!</h3>
          <p className="text-muted-foreground">Redirecionando para o login...</p>
        </div>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="password">Nova senha</Label>
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

      <div className="space-y-2">
        <Label htmlFor="confirmPassword">Confirmar nova senha</Label>
        <Input
          id="confirmPassword"
          type="password"
          placeholder="••••••••"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
          disabled={loading}
        />
      </div>

      {error && <div className="text-sm text-destructive bg-destructive/10 p-3 rounded-lg">{error}</div>}

      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Redefinindo...
          </>
        ) : (
          "Redefinir senha"
        )}
      </Button>
    </form>
  )
}

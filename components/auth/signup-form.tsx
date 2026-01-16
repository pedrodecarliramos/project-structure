"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { signUp } from "@/lib/auth"
import { Loader2, CheckCircle2 } from "lucide-react"

export function SignupForm() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  })
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    if (!formData.name.trim() || !formData.email.trim() || !formData.password) {
      setError("Preencha todos os campos")
      setLoading(false)
      return
    }

    // Validate passwords match
    if (formData.password !== formData.confirmPassword) {
      setError("As senhas não coincidem")
      setLoading(false)
      return
    }

    // Validate password strength
    if (formData.password.length < 6) {
      setError("A senha deve ter pelo menos 6 caracteres")
      setLoading(false)
      return
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(formData.email)) {
      setError("Email inválido")
      setLoading(false)
      return
    }

    try {
      const result = await signUp(formData.email.trim(), formData.password, formData.name.trim())

      if (result.success) {
        setSuccess(true)
        setTimeout(() => {
          router.push("/login")
        }, 2000)
      } else {
        setError(result.error || "Erro ao criar conta")
      }
    } catch (err) {
      console.error("[v0] Signup error:", err)
      setError("Erro ao criar conta. Tente novamente.")
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="text-center space-y-4">
        <CheckCircle2 className="h-16 w-16 text-primary mx-auto" />
        <div className="space-y-2">
          <h3 className="text-xl font-semibold">Conta criada com sucesso!</h3>
          <p className="text-muted-foreground">Redirecionando para o login...</p>
        </div>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Nome completo</Label>
        <Input
          id="name"
          type="text"
          placeholder="João Silva"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          required
          disabled={loading}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          placeholder="seu@email.com"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          required
          disabled={loading}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="password">Senha</Label>
        <Input
          id="password"
          type="password"
          placeholder="••••••••"
          value={formData.password}
          onChange={(e) => setFormData({ ...formData, password: e.target.value })}
          required
          disabled={loading}
        />
        <p className="text-xs text-muted-foreground">Mínimo de 6 caracteres</p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="confirmPassword">Confirmar senha</Label>
        <Input
          id="confirmPassword"
          type="password"
          placeholder="••••••••"
          value={formData.confirmPassword}
          onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
          required
          disabled={loading}
        />
      </div>

      {error && <div className="text-sm text-destructive bg-destructive/10 p-3 rounded-lg">{error}</div>}

      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Criando conta...
          </>
        ) : (
          "Criar conta"
        )}
      </Button>
    </form>
  )
}

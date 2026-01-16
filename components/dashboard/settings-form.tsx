"use client"

import type React from "react"

import { useState } from "react"
import { useAuth } from "@/hooks/use-auth"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { db } from "@/lib/db"
import { Loader2, CheckCircle2 } from "lucide-react"

export function SettingsForm() {
  const { user } = useAuth()
  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)
    setSuccess(false)

    if (newPassword !== confirmPassword) {
      setError("As senhas não coincidem")
      setLoading(false)
      return
    }

    if (newPassword.length < 6) {
      setError("A senha deve ter pelo menos 6 caracteres")
      setLoading(false)
      return
    }

    try {
      // In a real app, verify current password first
      if (user) {
        // Hash and update password
        const encoder = new TextEncoder()
        const data = encoder.encode(newPassword)
        const hash = await crypto.subtle.digest("SHA-256", data)
        const hashedPassword = Array.from(new Uint8Array(hash))
          .map((b) => b.toString(16).padStart(2, "0"))
          .join("")

        await db.updateUser(user.id, { password: hashedPassword })

        setSuccess(true)
        setCurrentPassword("")
        setNewPassword("")
        setConfirmPassword("")
        setTimeout(() => setSuccess(false), 3000)
      }
    } catch (err) {
      setError("Erro ao alterar senha")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-8">
      <div>
        <h3 className="text-lg font-semibold mb-4">Alterar Senha</h3>
        <form onSubmit={handlePasswordChange} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="currentPassword">Senha atual</Label>
            <Input
              id="currentPassword"
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              required
              disabled={loading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="newPassword">Nova senha</Label>
            <Input
              id="newPassword"
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              disabled={loading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirmar nova senha</Label>
            <Input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              disabled={loading}
            />
          </div>

          {error && <div className="text-sm text-destructive bg-destructive/10 p-3 rounded-lg">{error}</div>}

          {success && (
            <div className="flex items-center gap-2 text-sm text-primary bg-primary/10 p-3 rounded-lg">
              <CheckCircle2 className="h-4 w-4" />
              Senha alterada com sucesso!
            </div>
          )}

          <Button type="submit" disabled={loading}>
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Alterando...
              </>
            ) : (
              "Alterar senha"
            )}
          </Button>
        </form>
      </div>

      <Separator />

      <div>
        <h3 className="text-lg font-semibold mb-2">Zona de Perigo</h3>
        <p className="text-sm text-muted-foreground mb-4">Ações irreversíveis que afetam permanentemente sua conta</p>
        <Button variant="destructive" disabled>
          Excluir conta
        </Button>
      </div>
    </div>
  )
}

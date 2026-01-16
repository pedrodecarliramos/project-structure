"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useAuth } from "@/hooks/use-auth"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { db } from "@/lib/db"
import { Loader2, CheckCircle2 } from "lucide-react"

export function ProfileForm() {
  const { user, setAuth, token } = useAuth()
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    cpf: "",
    phone: "",
  })
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  useEffect(() => {
    if (user) {
      const loadUserData = async () => {
        const userData = await db.getUserById(user.id)
        if (userData) {
          setFormData({
            name: userData.name,
            email: userData.email,
            cpf: userData.cpf || "",
            phone: userData.phone || "",
          })
        }
      }
      loadUserData()
    }
  }, [user])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setSuccess(false)

    try {
      if (user) {
        await db.updateUser(user.id, {
          name: formData.name,
          cpf: formData.cpf,
          phone: formData.phone,
        })

        // Update auth state
        if (token) {
          setAuth({ ...user, name: formData.name }, token)
        }

        setSuccess(true)
        setTimeout(() => setSuccess(false), 3000)
      }
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="name">Nome completo</Label>
          <Input
            id="name"
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
            disabled={loading}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" value={formData.email} disabled className="bg-muted" />
          <p className="text-xs text-muted-foreground">O email não pode ser alterado</p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="cpf">CPF</Label>
          <Input
            id="cpf"
            type="text"
            placeholder="000.000.000-00"
            value={formData.cpf}
            onChange={(e) => setFormData({ ...formData, cpf: e.target.value })}
            disabled={loading}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="phone">Telefone</Label>
          <Input
            id="phone"
            type="tel"
            placeholder="(00) 00000-0000"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            disabled={loading}
          />
        </div>
      </div>

      {success && (
        <div className="flex items-center gap-2 text-sm text-primary bg-primary/10 p-3 rounded-lg">
          <CheckCircle2 className="h-4 w-4" />
          Perfil atualizado com sucesso!
        </div>
      )}

      <Button type="submit" disabled={loading}>
        {loading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Salvando...
          </>
        ) : (
          "Salvar alterações"
        )}
      </Button>
    </form>
  )
}

"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme-toggle"

export default function HomePage() {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [status, setStatus] = useState("")

  const handleCreateUser = async () => {
    setStatus("")

    try {
      const res = await fetch("http://localhost:4000/api/v1/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user: {
            name,
            email,
          },
        }),
      })

      if (!res.ok) {
        throw new Error("Erro ao criar usuário")
      }

      setStatus("Usuário criado com sucesso ✅")
      setName("")
      setEmail("")
    } catch (err) {
      setStatus("Erro ao criar usuário ❌")
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-primary/20 via-background to-secondary/20 p-4 relative">
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>

      <div className="glass-strong rounded-2xl p-8 md:p-12 max-w-2xl w-full text-center space-y-6">
        <h1 className="text-4xl md:text-5xl font-bold">
          Sistema de Autenticação
        </h1>

        <p className="text-lg text-muted-foreground">
          Criação de usuários integrada com Rails API + PostgreSQL
        </p>

        {/* FORM */}
        <div className="space-y-4">
          <input
            className="w-full p-3 rounded-lg border"
            placeholder="Nome"
            value={name}
            onChange={e => setName(e.target.value)}
          />

          <input
            className="w-full p-3 rounded-lg border"
            placeholder="Email"
            value={email}
            onChange={e => setEmail(e.target.value)}
          />

          <Button size="lg" className="w-full" onClick={handleCreateUser}>
            Criar Usuário
          </Button>

          {status && <p className="text-sm">{status}</p>}
        </div>

        {/* LINKS */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
          <Button asChild size="lg" variant="outline">
            <Link href="/login">Entrar</Link>
          </Button>

          <Button asChild size="lg" variant="outline">
            <Link href="/signup">Criar Conta</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}

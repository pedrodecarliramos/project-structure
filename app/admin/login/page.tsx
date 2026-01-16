"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/hooks/use-auth"
import { adminSignIn } from "@/lib/auth"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Loader2, ShieldAlert } from "lucide-react"

export default function AdminLoginPage() {
  const router = useRouter()
  const setAuth = useAuth((state) => state.setAuth)
  const [email, setEmail] = useState("admin@admin.com")
  const [password, setPassword] = useState("admin123")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      const result = await adminSignIn(email, password)

      if (result.success && "user" in result && result.token) {
        setAuth(result.user, result.token)
        router.push("/admin/dashboard")
      } else {
        setError(result.error || "Credenciais de administrador inválidas")
      }
    } catch (err) {
      setError("Erro ao tentar acessar o trono.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-950">
      <div className="w-full max-w-md space-y-8 rounded-lg border border-slate-800 bg-slate-900 p-8 shadow-2xl">
        <div className="text-center">
          <ShieldAlert className="mx-auto h-12 w-12 text-amber-500" />
          <h2 className="mt-4 text-3xl font-bold tracking-tight text-white">Portal do Soberano</h2>
          <p className="mt-2 text-sm text-slate-400">Apenas generais de alto escalão podem prosseguir</p>
        </div>

        <form onSubmit={handleLogin} className="mt-8 space-y-6">
          <div className="space-y-4">
            <div>
              <Label className="text-slate-200">Email Administrativo</Label>
              <Input 
                type="email" 
                className="bg-slate-800 border-slate-700 text-white"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <Label className="text-slate-200">Senha de Comando</Label>
              <Input 
                type="password" 
                className="bg-slate-800 border-slate-700 text-white"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          {error && (
            <div className="rounded bg-red-500/10 p-3 text-sm text-red-500 border border-red-500/20">
              {error}
            </div>
          )}

          <Button type="submit" className="w-full bg-amber-600 hover:bg-amber-700 text-white" disabled={loading}>
            {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Reivindicar Trono"}
          </Button>
        </form>
      </div>
    </div>
  )
}
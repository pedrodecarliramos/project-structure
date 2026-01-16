"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { verifyEmail } from "@/lib/auth"
import { Loader2, CheckCircle2, XCircle } from "lucide-react"

export function VerifyEmailForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const token = searchParams.get("token") || ""

  const [loading, setLoading] = useState(true)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => {
    if (token) {
      handleVerify()
    } else {
      setError("Token inválido")
      setLoading(false)
    }
  }, [token])

  const handleVerify = async () => {
    try {
      const result = await verifyEmail(token)

      if (result.success) {
        setSuccess(true)
        setTimeout(() => {
          router.push("/login")
        }, 3000)
      } else {
        setError(result.error || "Erro ao verificar email")
      }
    } catch (err) {
      setError("Erro ao verificar email")
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="text-center space-y-4">
        <Loader2 className="h-16 w-16 text-primary mx-auto animate-spin" />
        <p className="text-muted-foreground">Verificando seu email...</p>
      </div>
    )
  }

  if (success) {
    return (
      <div className="text-center space-y-4">
        <CheckCircle2 className="h-16 w-16 text-primary mx-auto" />
        <div className="space-y-2">
          <h3 className="text-xl font-semibold">Email verificado!</h3>
          <p className="text-muted-foreground">Sua conta foi ativada com sucesso. Redirecionando para o login...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="text-center space-y-4">
      <XCircle className="h-16 w-16 text-destructive mx-auto" />
      <div className="space-y-2">
        <h3 className="text-xl font-semibold">Erro na verificação</h3>
        <p className="text-muted-foreground">{error}</p>
      </div>
      <Button onClick={() => router.push("/login")} className="w-full">
        Voltar para o login
      </Button>
    </div>
  )
}

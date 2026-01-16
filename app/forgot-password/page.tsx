import { ForgotPasswordForm } from "@/components/auth/forgot-password-form"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { ThemeToggle } from "@/components/theme-toggle"

export default function ForgotPasswordPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/20 via-background to-secondary/20 p-4 relative">
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>

      <div className="w-full max-w-md space-y-6">
        <Link
          href="/login"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Voltar para login
        </Link>

        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold">Esqueceu sua senha?</h1>
          <p className="text-muted-foreground">Digite seu email para receber instruções</p>
        </div>

        <div className="glass-strong rounded-2xl p-8">
          <ForgotPasswordForm />
        </div>
      </div>
    </div>
  )
}

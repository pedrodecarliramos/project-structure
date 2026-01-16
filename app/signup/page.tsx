import { SignupForm } from "@/components/auth/signup-form"
import Link from "next/link"
import { ThemeToggle } from "@/components/theme-toggle"

export default function SignupPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/20 via-background to-secondary/20 p-4 relative">
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>

      <div className="w-full max-w-md space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold">Criar sua conta</h1>
          <p className="text-muted-foreground">Preencha os dados abaixo</p>
        </div>

        <div className="glass-strong rounded-2xl p-8">
          <SignupForm />
        </div>

        <div className="text-center text-sm">
          <span className="text-muted-foreground">Já tem uma conta? </span>
          <Link href="/login" className="text-primary hover:underline font-medium">
            Entrar
          </Link>
        </div>
      </div>
    </div>
  )
}

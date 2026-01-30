import { VerifyEmailForm } from "@/components/auth/verify-email-form"
import { ThemeToggle } from "@/components/theme-toggle"

export default function VerifyEmailPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-primary/20 via-background to-secondary/20 p-4 relative">
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>

      <div className="w-full max-w-md space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold">Verificar email</h1>
          <p className="text-muted-foreground">Confirme seu endereço de email</p>
        </div>

        <div className="glass-strong rounded-2xl p-8">
          <VerifyEmailForm />
        </div>
      </div>
    </div>
  )
}

import { LoginForm } from "@/components/auth/login-form"
import Link from "next/link"
import { ThemeToggle } from "@/components/theme-toggle"
import { apiFetch } from "@/lib/api";



const handleLogin = async (credentials: any) => {
  await apiFetch("/login", { 
    method: "POST", 
    body: JSON.stringify(credentials) 
  });
};

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-primary/20 via-background to-secondary/20 p-4 relative">
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>

      <div className="w-full max-w-md space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold">Bem-vindo de volta</h1>
          <p className="text-muted-foreground">Entre com suas credenciais</p>
        </div>

        <div className="glass-strong rounded-2xl p-8">
          <LoginForm />
        </div>

        <div className="text-center text-sm">
          <span className="text-muted-foreground">Não tem uma conta? </span>
          <Link href="/signup" className="text-primary hover:underline font-medium">
            Criar conta
          </Link>
        </div>
      </div>
    </div>
  )
}

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme-toggle"

export default function HomePage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/20 via-background to-secondary/20 p-4 relative">
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>

      <div className="glass-strong rounded-2xl p-8 md:p-12 max-w-2xl w-full text-center space-y-6">
        <h1 className="text-4xl md:text-5xl font-bold text-balance">Sistema de Autenticação</h1>
        <p className="text-lg text-muted-foreground text-pretty">
          Sistema completo de autenticação e administração com controle de acesso, logs de auditoria e relatórios.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
          <Button asChild size="lg" className="text-lg">
            <Link href="/login">Entrar</Link>
          </Button>
          <Button asChild size="lg" variant="outline" className="text-lg glass bg-transparent">
            <Link href="/signup">Criar Conta</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}

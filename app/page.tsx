"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme-toggle"

export default function HomePage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-primary/20 via-background to-secondary/20 p-4 relative">
      {/* Botão de Tema no canto superior */}
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>

      <div className="glass-strong rounded-2xl p-8 md:p-12 max-w-2xl w-full text-center space-y-6">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
          Sistema de Autenticação
        </h1>
        
        <p className="text-muted-foreground text-lg">
          Bem-vindo! Escolha uma das opções abaixo para acessar a plataforma.
        </p>

        {/* Links de Navegação */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
          <Button asChild size="lg" variant="default" className="min-w-35">
            <Link href="/login">Entrar</Link>
          </Button>

          <Button asChild size="lg" variant="outline" className="min-w-35">
            <Link href="/signup">Criar Conta</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
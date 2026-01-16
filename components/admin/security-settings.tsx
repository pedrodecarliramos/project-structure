"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Shield, Lock, Eye, AlertTriangle } from "lucide-react"

export function SecuritySettings() {
  return (
    <div className="grid gap-6 md:grid-cols-2">
      <Card className="glass-strong">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-primary" />
            <CardTitle>Proteção de Conta</CardTitle>
          </div>
          <CardDescription>Recursos de segurança ativos</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm">Autenticação de dois fatores</span>
            <Badge variant="secondary">Em breve</Badge>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm">Verificação de email</span>
            <Badge variant="default">Ativo</Badge>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm">Rate limiting</span>
            <Badge variant="default">Ativo</Badge>
          </div>
        </CardContent>
      </Card>

      <Card className="glass-strong">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Lock className="h-5 w-5 text-primary" />
            <CardTitle>Criptografia</CardTitle>
          </div>
          <CardDescription>Proteção de dados</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm">Senhas criptografadas</span>
            <Badge variant="default">SHA-256</Badge>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm">Tokens seguros</span>
            <Badge variant="default">UUID</Badge>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm">HTTPS</span>
            <Badge variant="default">Ativo</Badge>
          </div>
        </CardContent>
      </Card>

      <Card className="glass-strong">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Eye className="h-5 w-5 text-primary" />
            <CardTitle>Monitoramento</CardTitle>
          </div>
          <CardDescription>Auditoria e logs</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm">Logs de auditoria</span>
            <Badge variant="default">Ativo</Badge>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm">Rastreamento de IP</span>
            <Badge variant="default">Ativo</Badge>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm">Alertas de segurança</span>
            <Badge variant="secondary">Em breve</Badge>
          </div>
        </CardContent>
      </Card>

      <Card className="glass-strong">
        <CardHeader>
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-primary" />
            <CardTitle>Validações</CardTitle>
          </div>
          <CardDescription>Verificações de entrada</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm">Validação de CPF</span>
            <Badge variant="default">Ativo</Badge>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm">Sanitização de inputs</span>
            <Badge variant="default">Ativo</Badge>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm">CSRF Protection</span>
            <Badge variant="default">Ativo</Badge>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

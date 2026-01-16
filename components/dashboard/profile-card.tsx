"use client"

import { useAuth } from "@/hooks/use-auth"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Edit } from "lucide-react"
import Link from "next/link"

export function ProfileCard() {
  const { user } = useAuth()

  const initials = user?.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2)

  return (
    <Card className="glass-strong">
      <CardHeader>
        <CardTitle>Informações do Perfil</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center gap-4">
          <Avatar className="h-20 w-20">
            <AvatarFallback className="bg-primary text-primary-foreground text-2xl">{initials}</AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <h3 className="text-xl font-semibold">{user?.name}</h3>
            <p className="text-muted-foreground">{user?.email}</p>
            <Badge variant="secondary" className="mt-2">
              {user?.roleId === "admin" ? "Administrador" : "Usuário"}
            </Badge>
          </div>
        </div>

        <Button asChild className="w-full">
          <Link href="/dashboard/profile">
            <Edit className="mr-2 h-4 w-4" />
            Editar Perfil
          </Link>
        </Button>
      </CardContent>
    </Card>
  )
}

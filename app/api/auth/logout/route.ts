import { type NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"
import { verifyToken } from "@/lib/auth"

export async function POST(request: NextRequest) {
  try {
    const refreshToken = request.cookies.get("refreshToken")?.value

    if (refreshToken) {
      const payload = await verifyToken(refreshToken)
      
      if (payload) {
        const userId = payload.sub || payload.id
        
        await db.getRefreshToken(refreshToken)

        const user = await db.getUserById(userId)

        if (user) {
          await db.createAuditLog({
            userId: user.id, // Erro 2339 resolvido pelo await anterior
            action: "LOGOUT",
            resource: "auth",
            details: `Usuário ${user.email} encerrou a sessão.`,
            ipAddress: request.headers.get("x-forwarded-for") || "127.0.0.1",
            userAgent: request.headers.get("user-agent") || "unknown",
          })
        }
      }
    }

    const response = NextResponse.json({ message: "Sessão encerrada com sucesso" })
    
    response.cookies.set("refreshToken", "", {
      httpOnly: true,
      expires: new Date(0), // Expira o cookie imediatamente
      path: "/",
    })

    return response
  } catch (error) {
    console.error("[LOGOUT_ERROR]:", error)
    return NextResponse.json({ error: "Erro ao processar logout" }, { status: 500 })
  }
}
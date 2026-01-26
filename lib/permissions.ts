// Permission checking utilities
import { db } from "./db"

/**
 * Verifica se um usuário possui uma permissão específica.
 * Ajustamos a assinatura para aceitar o que suas rotas enviam: (role, resource, action)
 */
export function hasPermission(role: string, resource: string, action: string): boolean {
  // Se o seu sistema for baseado em roles fixas (como sugerido nas rotas):
  const adminPermissions = ["*"]
  const managerPermissions = ["users.read", "users.create", "users.update"]
  const userPermissions = ["users.read"]

  let userPermissionsList: string[] = []

  if (role === "admin") userPermissionsList = adminPermissions
  else if (role === "manager") userPermissionsList = managerPermissions
  else userPermissionsList = userPermissions

  // Admin tem poder total
  if (userPermissionsList.includes("*")) return true

  // Verifica se a combinação recurso.ação está na lista
  const requiredPermission = `${resource}.${action}`
  return userPermissionsList.includes(requiredPermission)
}

/**
 * Versão assíncrona que busca o usuário no banco se necessário
 */
export async function checkUserPermission(userId: string, resource: string, action: string): Promise<boolean> {
  const user = await db.getUserById(userId)
  if (!user) return false

  // Usamos a lógica acima passando o role do usuário (cast como any para evitar o erro de função se persistir)
  return hasPermission(user.role as any, resource, action)
}

export async function requirePermission(userId: string, resource: string, action: string): Promise<void> {
  const allowed = await checkUserPermission(userId, resource, action)
  if (!allowed) {
    throw new Error("Permissão negada")
  }
}
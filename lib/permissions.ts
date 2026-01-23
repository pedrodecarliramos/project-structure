// Permission checking utilities
import { db } from "./db"

export async function hasPermission(role: (role: any, arg1: string, arg2: string) => unknown, userId: string, permission: string): Promise<boolean> {
  const user = await db.getUserById(userId)
  if (!user) return false

  const role = await db.getRoleById(user.roleId)
  if (!role) return false

  // Admin has all permissions
  if (role.permissions.includes("*")) return true

  return role.permissions.includes(permission)
}

export async function requirePermission(userId: string, permission: string): Promise<void> {
  const allowed = await hasPermission(userId, permission)
  if (!allowed) {
    throw new Error("Permissão negada")
  }
}

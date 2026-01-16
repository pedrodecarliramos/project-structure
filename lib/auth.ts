// Authentication utilities
import { db } from "./db"
import type { User } from "./types"
import crypto from 'crypto'
import { v4 as uuidv4 } from 'uuid' 

/**
 * Forja o hash da senha usando SHA-256.
 */
export async function hashPassword(password: string): Promise<string> {
  return crypto.createHash("sha256").update(password).digest("hex")
}

async function verifyPassword(password: string, hash: string): Promise<boolean> {
  const passwordHash = await hashPassword(password)
  return passwordHash === hash
}

/**
 * Gera tokens únicos para sessões e verificações.
 */
function generateToken(): string {
  return uuidv4() + "-" + Date.now()
}

/**
 * AUTENTICAÇÃO DE ELITE (ADMIN)
 * Verifica as credenciais e garante que o usuário tem poderes de administrador.
 */
export async function adminSignIn(email: string, password: string) {
  const result = await signIn(email, password)

  if (result.success) {
    // Se o login foi bem sucedido, verificamos o papel (role)
    if (result.user?.roleId !== "admin") {
      // Se não for admin, invalidamos a sessão criada por segurança
      if (result.token) await signOut(result.token)
      
      return { 
        success: false, 
        error: "Acesso negado: Este portal é restrito aos administradores do reino." 
      }
    }
  }

  return result
}

export async function signUp(email: string, password: string, name: string) {
  try {
    const existingUser = await db.getUserByEmail(email)
    if (existingUser) {
      return { success: false, error: "Email já cadastrado" }
    }

    const hashedPassword = await hashPassword(password)

    const user = await db.createUser({
      email,
      password: hashedPassword,
      name,
      roleId: "user", // Súditos novos começam como usuários comuns
      isActive: true,
      emailVerified: false,
      verificationToken: generateToken(),
    } as any)

    await db.createAuditLog({
      userId: user.id,
      action: "USER_CREATED",
      resource: "users",
      details: `Usuário ${email} criado`,
      ipAddress: "0.0.0.0",
      userAgent: "browser",
    })

    return { success: true, user: { id: user.id, email: user.email, name: user.name } }
  } catch (error) {
    console.error("[Auth] Erro no signUp:", error)
    return { success: false, error: "Erro interno ao processar cadastro" }
  }
}

export async function signIn(email: string, password: string) {
  try {
    const user = await db.getUserByEmail(email)

    if (!user) {
      return { success: false, error: "Email ou senha inválidos" }
    }

    if (!user.isActive) {
      return { success: false, error: "Conta desativada" }
    }

    const isValid = await verifyPassword(password, user.password)
    if (!isValid) {
      return { success: false, error: "Email ou senha inválidos" }
    }

    const token = generateToken()
    const refreshToken = generateToken()

    await db.createSession({
      userId: user.id,
      token,
      refreshToken,
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), 
    })

    await db.updateUser(user.id, { lastLogin: new Date() })

    await db.createAuditLog({
      userId: user.id,
      action: "USER_LOGIN",
      resource: "auth",
      details: `Usuário ${email} fez login`,
      ipAddress: "0.0.0.0",
      userAgent: "browser",
    })

    return {
      success: true,
      token,
      refreshToken,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        roleId: user.roleId,
      },
    }
  } catch (error) {
    console.error("[Auth] Erro no signIn:", error)
    return { success: false, error: "Erro interno no servidor" }
  }
}

export async function verifyToken(token: string): Promise<User | null> {
  const session = await db.getSessionByToken(token)
  if (!session || !session.expiresAt) return null

  if (new Date(session.expiresAt) < new Date()) {
    await db.deleteSession(token)
    return null
  }

  return await db.getUserById(session.userId)
}

export async function signOut(token: string) {
  await db.deleteSession(token)
  return { success: true }
}

export async function requestPasswordReset(email: string) {
  const user = await db.getUserByEmail(email)
  if (!user) {
    return { success: true, message: "Se o email existir, você receberá instruções" }
  }

  const resetToken = generateToken()
  await db.updateUser(user.id, {
    resetPasswordToken: resetToken,
    resetPasswordExpires: new Date(Date.now() + 60 * 60 * 1000),
  })

  return { success: true, message: "Instruções enviadas para seu email" }
}

export async function resetPassword(token: string, newPassword: string) {
  const users = await db.getUsers()
  const user = users.find((u) => u.resetPasswordToken === token)

  if (!user || !user.resetPasswordExpires || new Date(user.resetPasswordExpires) < new Date()) {
    return { success: false, error: "Token inválido ou expirado" }
  }

  const hashedPassword = await hashPassword(newPassword)
  await db.updateUser(user.id, {
    password: hashedPassword,
    resetPasswordToken: undefined,
    resetPasswordExpires: undefined,
  })

  return { success: true, message: "Senha alterada com sucesso" }
}

export async function verifyEmail(token: string) {
  const users = await db.getUsers()
  const user = users.find((u) => u.verificationToken === token)

  if (!user) {
    return { success: false, error: "Token inválido" }
  }

  await db.updateUser(user.id, {
    emailVerified: true,
    verificationToken: undefined,
  })

  return { success: true, message: "Email verificado com sucesso" }
}
// lib/db.ts
import type { User, Role, AuditLog, Session, CreateUserInput, UpdateUserInput, RefreshToken } from "./types"
import { v4 as uuidv4 } from 'uuid' 

class MockDatabase {
  getAuditLogs(): AuditLog[] | PromiseLike<AuditLog[]> {
    throw new Error("Method not implemented.");
  }
  private initialized = false

 async getPasswordResetToken(token: string, resetToken: string): Promise<User | null> {
    await this.ensureInitialized();
    const users = await this.getUsers();
    return users.find(u => u.resetPasswordToken === token) || null;
  }

  // CORREÇÃO: Método que a rota está pedindo
  async deletePasswordResetToken(userId: string): Promise<void> {
    await this.updateUser(userId, {
      resetPasswordToken: undefined,
      resetPasswordExpires: undefined
    });
  }

  // CORREÇÃO: Método para revogar todas as sessões do usuário
  async revokeAllUserRefreshTokens(userId: string): Promise<void> {
    await this.ensureInitialized();
    const tokens = this.getItem<RefreshToken>("refresh_tokens");
    const updatedTokens = tokens.map(t => 
      t.userId === userId ? { ...t, revoked: true } : t
    );
    this.setItem("refresh_tokens", updatedTokens);
  }

  async getRefreshToken(token: string): Promise<RefreshToken | null> {
    await this.ensureInitialized()
    const tokens = this.getItem<RefreshToken>("refresh_tokens")
    // Converte datas de string para Date caso venham do localStorage
    const found = tokens.find((t) => t.id === token)
    if (found) {
      found.expiresAt = new Date(found.expiresAt)
    }
    return found || null
  }

  async storeRefreshToken(userId: string, token: string, expiresAt: Date): Promise<void> {
    await this.ensureInitialized()
    const tokens = this.getItem<RefreshToken>("refresh_tokens")
    
    const newToken: RefreshToken = {
      id: token,
      userId,
      expiresAt,
      revoked: false,
      createdAt: new Date()
    }
    
    tokens.push(newToken)
    this.setItem("refresh_tokens", tokens)
  }

  async revokeRefreshToken(token: string): Promise<void> {
    await this.ensureInitialized()
    const tokens = this.getItem<RefreshToken>("refresh_tokens")
    const index = tokens.findIndex((t) => t.id === token)
    
    if (index !== -1) {
      tokens[index].revoked = true
      this.setItem("refresh_tokens", tokens)
    }
  }

  async getVerificationToken(token: string): Promise<User | null> {
    await this.ensureInitialized()
    const users = await this.getUsers()
    return users.find((u) => u.verificationToken === token) || null
  }

  // --- INFRAESTRUTURA LOCALSTORAGE ---

  private getItem<T>(key: string): T[] {
    if (typeof window === "undefined") return []
    try {
      const data = localStorage.getItem(key)
      return data ? JSON.parse(data) : []
    } catch {
      return []
    }
  }

  private setItem<T>(key: string, data: T[]): void {
    if (typeof window === "undefined") return
    try {
      localStorage.setItem(key, JSON.stringify(data))
    } catch (e) {
      console.error("[DB] Erro ao salvar no localStorage:", e)
    }
  }

  private async ensureInitialized(): Promise<void> {
    if (typeof window === "undefined") return
    if (!this.initialized) {
      this.initializeRoles()
      await this.initializeDefaultAdmin() 
      this.initialized = true
    }
  }

  // --- GERENCIAMENTO DE ROLES E ADMIN ---

  initializeRoles(): void {
    if (typeof window === "undefined") return
    const roles = this.getItem<Role>("roles")
    if (roles.length === 0) {
      const defaultRoles: Role[] = [
        {
          id: "admin",
          name: "Administrador",
          description: "Acesso total ao sistema",
          permissions: ["*"],
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: "user",
          name: "Usuário",
          description: "Acesso básico ao sistema",
          permissions: ["read:profile", "update:profile"],
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ]
      this.setItem("roles", defaultRoles)
    }
  }

  async initializeDefaultAdmin(): Promise<void> {
    const users = this.getItem<User>("users")
    const adminExists = users.some((u) => u.email.toLowerCase() === "admin@admin.com")

    if (!adminExists) {
      const { hashPassword } = await import("./auth")
      const hashedPassword = await hashPassword("admin123")
      
      const adminUser: User = {
        id: uuidv4(),
        name: "Administrador Supremo",
        email: "admin@admin.com",
        password: hashedPassword,
        roleId: "admin",
        isActive: true,
        emailVerified: true,
        createdAt: new Date(),
        updatedAt: new Date(),
        sub: ""
      }

      users.push(adminUser)
      this.setItem("users", users)
      console.log("%c[REINO] Trono Administrativo Restaurado!", "color: #f59e0b; font-weight: bold;")
    }
  }

  // --- MÉTODOS DE USUÁRIO ---

  async getUsers(): Promise<User[]> {
    await this.ensureInitialized()
    return this.getItem<User>("users")
  }

  async getUserById(id: string): Promise<User | null> {
    await this.ensureInitialized()
    const users = this.getItem<User>("users")
    return users.find((u) => u.id === id) || null
  }

  async getUserByEmail(email: string): Promise<User | null> {
    await this.ensureInitialized()
    const users = this.getItem<User>("users")
    return users.find((u) => u.email.toLowerCase() === email.toLowerCase()) || null
  }

  async createUser(data: CreateUserInput): Promise<User> {
    await this.ensureInitialized()
    const users = this.getItem<User>("users")
    const newUser: User = {
      ...data,
      id: uuidv4(), 
      createdAt: new Date(),
      updatedAt: new Date(),
    }
    users.push(newUser)
    this.setItem("users", users)
    return newUser
  }

  async updateUser(id: string, data: UpdateUserInput): Promise<User | null> {
    await this.ensureInitialized()
    const users = this.getItem<User>("users")
    const index = users.findIndex((u) => u.id === id)
    if (index === -1) return null

    users[index] = {
      ...users[index],
      ...data,
      updatedAt: new Date(),
    }
    this.setItem("users", users)
    return users[index]
  }

  async deleteUser(id: string): Promise<boolean> {
    await this.ensureInitialized()
    const users = this.getItem<User>("users")
    const filtered = users.filter((u) => u.id !== id)
    if (filtered.length === users.length) return false
    this.setItem("users", filtered)
    return true
  }

  // --- AUDITORIA E SESSÕES ---

  async createAuditLog(log: Omit<AuditLog, "id" | "createdAt">): Promise<AuditLog> {
    await this.ensureInitialized()
    const logs = this.getItem<AuditLog>("auditLogs")
    const newLog: AuditLog = {
      ...log,
      id: uuidv4(),
      createdAt: new Date(),
    }
    logs.push(newLog)
    this.setItem("auditLogs", logs)
    return newLog
  }

  async createSession(session: Omit<Session, "createdAt">): Promise<Session> {
    await this.ensureInitialized()
    const sessions = this.getItem<Session>("sessions")
    const newSession: Session = {
      ...session,
      createdAt: new Date(),
    }
    sessions.push(newSession)
    this.setItem("sessions", sessions)
    return newSession
  }

  async getSessionByToken(token: string): Promise<Session | null> {
    await this.ensureInitialized()
    const sessions = this.getItem<Session>("sessions")
    return sessions.find((s) => s.token === token) || null
  }

  async deleteSession(token: string): Promise<boolean> {
    await this.ensureInitialized()
    const sessions = this.getItem<Session>("sessions")
    const filtered = sessions.filter((s) => s.token !== token)
    if (filtered.length === sessions.length) return false
    this.setItem("sessions", filtered)
    return true
  }
}

export const db = new MockDatabase()
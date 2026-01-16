// Mock database service using localStorage
import type { User, Role, AuditLog, Session, CreateUserInput, UpdateUserInput } from "./types"
import { v4 as uuidv4 } from 'uuid' 

class MockDatabase {
  private initialized = false

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
      console.error("[v0] Error saving to localStorage:", e)
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

  /**
   * O Gênesis: Cria o administrador padrão.
   * Credenciais: admin@admin.com / admin123
   */
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
      }

      users.push(adminUser)
      this.setItem("users", users)
      console.log("%c[REINO] Trono Administrativo Restaurado!", "color: #f59e0b; font-weight: bold;")
    }
  }

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
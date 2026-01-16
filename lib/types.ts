// Database types and interfaces
export interface User {
  id: string
  email: string
  password: string
  name: string
  cpf?: string
  phone?: string
  avatar?: string
  roleId: string
  isActive: boolean
  emailVerified: boolean
  verificationToken?: string
  resetPasswordToken?: string
  resetPasswordExpires?: Date
  createdAt: Date
  updatedAt: Date
  lastLogin?: Date
}

export interface Role {
  id: string
  name: string
  description: string
  permissions: string[]
  createdAt: Date
  updatedAt: Date
}

export interface AuditLog {
  id: string
  userId: string
  action: string
  resource: string
  details: string
  ipAddress: string
  userAgent: string
  createdAt: Date
}

export interface Session {
  userId: string
  token: string
  refreshToken: string
  expiresAt: Date
  createdAt: Date
}

export type UserWithRole = User & {
  role: Role
}

export type CreateUserInput = Omit<User, "id" | "createdAt" | "updatedAt" | "lastLogin">
export type UpdateUserInput = Partial<Omit<User, "id" | "email" | "createdAt" | "updatedAt">>

// Security utilities
export function sanitizeInput(input: string): string {
  // Remove potentially dangerous characters
  return input.replace(/[<>"']/g, "")
}

export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

export function validatePassword(password: string): {
  valid: boolean
  errors: string[]
} {
  const errors: string[] = []

  if (password.length < 6) {
    errors.push("A senha deve ter pelo menos 6 caracteres")
  }

  if (!/[A-Z]/.test(password)) {
    errors.push("A senha deve conter pelo menos uma letra maiúscula")
  }

  if (!/[a-z]/.test(password)) {
    errors.push("A senha deve conter pelo menos uma letra minúscula")
  }

  if (!/[0-9]/.test(password)) {
    errors.push("A senha deve conter pelo menos um número")
  }

  return {
    valid: errors.length === 0,
    errors,
  }
}

export function generateCSRFToken(): string {
  return crypto.randomUUID()
}

export function validateCPF(cpf: string): boolean {
  // Remove non-digits
  cpf = cpf.replace(/\D/g, "")

  if (cpf.length !== 11) return false

  // Check if all digits are the same
  if (/^(\d)\1{10}$/.test(cpf)) return false

  // Validate first check digit
  let sum = 0
  for (let i = 0; i < 9; i++) {
    sum += Number.parseInt(cpf.charAt(i)) * (10 - i)
  }
  let checkDigit = 11 - (sum % 11)
  if (checkDigit >= 10) checkDigit = 0
  if (checkDigit !== Number.parseInt(cpf.charAt(9))) return false

  // Validate second check digit
  sum = 0
  for (let i = 0; i < 10; i++) {
    sum += Number.parseInt(cpf.charAt(i)) * (11 - i)
  }
  checkDigit = 11 - (sum % 11)
  if (checkDigit >= 10) checkDigit = 0
  if (checkDigit !== Number.parseInt(cpf.charAt(10))) return false

  return true
}

export function maskCPF(cpf: string): string {
  cpf = cpf.replace(/\D/g, "")
  return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4")
}

export function maskPhone(phone: string): string {
  phone = phone.replace(/\D/g, "")
  if (phone.length === 11) {
    return phone.replace(/(\d{2})(\d{5})(\d{4})/, "($1) $2-$3")
  }
  return phone.replace(/(\d{2})(\d{4})(\d{4})/, "($1) $2-$3")
}

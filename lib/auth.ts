import type { User } from "./types"

const API_URL = "http://127.0.0.1:4000/api"

export async function signUp(email: string, password: string, name: string) {
  try {
    const response = await fetch(`${API_URL}/users`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        user: { name, email, password },
      }),
    })
    const data = await response.json()
    return response.ok 
      ? { success: true, user: data } 
      : { success: false, error: data.errors?.join(", ") || "Erro ao criar conta" }
  } catch (error) {
    return { success: false, error: "Servidor Rails offline" }
  }
}

export async function signIn(email: string, password: string) {
  try {
    const response = await fetch(`${API_URL}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    })
    const data = await response.json()
    return response.ok 
      ? { success: true, token: data.token, user: data.user } 
      : { success: false, error: "Email ou senha inválidos" }
  } catch (error) {
    return { success: false, error: "Erro de conexão" }
  }
}

export async function requestPasswordReset(email: string) {
  try {
    const response = await fetch(`${API_URL}/password_resets`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    })
    const data = await response.json()
    return { success: response.ok, message: data.message }
  } catch (error) {
    return { success: false, error: "Erro ao conectar com o servidor" }
  }
}
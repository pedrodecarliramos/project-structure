"use client"

import { create } from "zustand"
import { persist } from "zustand/middleware"

interface AuthUser {
  id: string
  email: string
  name: string
  roleId: string // "admin", "user", etc.
}

interface AuthState {
  user: AuthUser | null
  token: string | null
  isAuthenticated: boolean
  // Novos campos para facilitar a vida do rei
  isAdmin: boolean 
  isLoading: boolean
  
  setAuth: (user: AuthUser, token: string) => void
  clearAuth: () => void
  updateUser: (user: Partial<AuthUser>) => void
}

export const useAuth = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isAdmin: false,
      isLoading: true, // Útil para evitar flash de conteúdo deslogado

      setAuth: (user, token) => 
        set({ 
          user, 
          token, 
          isAuthenticated: true, 
          isAdmin: user.roleId === "admin",
          isLoading: false 
        }),

      clearAuth: () => 
        set({ 
          user: null, 
          token: null, 
          isAuthenticated: false, 
          isAdmin: false,
          isLoading: false 
        }),

      updateUser: (updatedFields) => {
        const currentUser = get().user
        if (currentUser) {
          const newUser = { ...currentUser, ...updatedFields }
          set({ 
            user: newUser,
            isAdmin: newUser.roleId === "admin" 
          })
        }
      },
    }),
    {
      name: "auth-storage",
      // Garante que o estado de carregamento comece como falso após a hidratação
      onRehydrateStorage: () => (state) => {
        if (state) state.isLoading = false
      },
    },
  ),
)
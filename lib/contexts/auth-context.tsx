"use client"

import { createContext, useContext, useEffect, useState, type ReactNode } from "react"
import { apiClient } from "@/lib/api/client"
import { setAuthToken, removeAuthToken, getAuthToken } from "@/lib/api/config"

interface User {
  id: string
  email: string
  full_name: string
  phone?: string
  avatar_url?: string
}

interface AuthContextType {
  user: User | null
  loading: boolean
  login: (email: string, password: string) => Promise<void>
  logout: () => Promise<void>
  refreshUser: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  const refreshUser = async () => {
    const token = getAuthToken()
    if (!token) {
      setUser(null)
      setLoading(false)
      return
    }

    try {
      const { user: userData } = await apiClient.getUser()
      setUser(userData)
    } catch (error) {
      console.error("[v0] Failed to fetch user:", error)
      removeAuthToken()
      setUser(null)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    refreshUser()
  }, [])

  const login = async (email: string, password: string) => {
    try {
      const { token, user: userData } = await apiClient.login(email, password)
      setAuthToken(token)
      setUser(userData)
    } catch (error) {
      console.error("[v0] Login failed:", error)
      throw error
    }
  }

  const logout = async () => {
    try {
      await apiClient.logout()
    } catch (error) {
      console.error("[v0] Logout failed:", error)
    } finally {
      removeAuthToken()
      setUser(null)
    }
  }

  return <AuthContext.Provider value={{ user, loading, login, logout, refreshUser }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

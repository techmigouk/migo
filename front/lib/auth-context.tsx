"use client"

import { createContext, useContext, useEffect, useState } from "react"

interface User {
  id: string
  name: string
  email: string
  role: string
}

interface AuthContextType {
  user: User | null
  loading: boolean
  login: (credentials: { email: string; password: string }) => Promise<void>
  logout: () => void
  register: (data: { name: string; email: string; password: string }) => Promise<void>
  requestPasswordReset: (email: string) => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check for stored user data on component mount
    const storedUser = localStorage.getItem("user")
    const storedToken = localStorage.getItem("token")
    
    if (storedUser && storedToken) {
      setUser(JSON.parse(storedUser))
    }
    
    setLoading(false)
  }, [])

  const login = async (credentials: { email: string; password: string }) => {
    const response = await fetch("/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(credentials),
    })

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.error || "Failed to log in")
    }

    // Save the user data and token
    setUser(data.user)
    localStorage.setItem("token", data.token)
    localStorage.setItem("user", JSON.stringify(data.user))
    
    // Redirect to user portal with only the token (user will fetch data from API)
    // This prevents URL from being too long with avatar data
    const userDashboardUrl = process.env.NODE_ENV === 'production'
      ? `${process.env.NEXT_PUBLIC_USER_DASHBOARD_URL || 'https://app.techmigo.co.uk'}/?token=${data.token}`
      : `http://localhost:3004/?token=${data.token}`
    window.location.href = userDashboardUrl
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem("token")
    localStorage.removeItem("user")
    window.location.href = "/login"
  }

  const register = async (data: { name: string; email: string; password: string }) => {
    const response = await fetch("/api/auth/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })

    const result = await response.json()

    if (!response.ok) {
      throw new Error(result.error || "Failed to create account")
    }

    window.location.href = "/login?registered=true"
  }

  const requestPasswordReset = async (email: string) => {
    const response = await fetch("/api/auth/reset-password", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email }),
    })

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.error || "Failed to request password reset")
    }
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, register, requestPasswordReset }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
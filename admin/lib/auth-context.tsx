"use client"

import { createContext, useContext, useEffect, useState } from "react"
import { useRouter } from "next/navigation"

interface Admin {
  id: string
  name: string
  email: string
  role: string
  avatar?: string
}

interface AdminAuthContextType {
  admin: Admin | null
  adminToken: string | null
  loading: boolean
  login: (credentials: { email: string; password: string }) => Promise<void>
  logout: () => void
}

const AdminAuthContext = createContext<AdminAuthContextType | undefined>(undefined)

export function AdminAuthProvider({ children }: { children: React.ReactNode }) {
  const [admin, setAdmin] = useState<Admin | null>(null)
  const [adminToken, setAdminToken] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    // Check for stored admin data on component mount
    const storedAdmin = localStorage.getItem("admin")
    const storedToken = localStorage.getItem("adminToken")
    
    if (storedAdmin && storedToken) {
      setAdmin(JSON.parse(storedAdmin))
      setAdminToken(storedToken)
    }
    
    setLoading(false)
  }, [])

  const login = async (credentials: { email: string; password: string }) => {
    const response = await fetch("/api/admin/login", {
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

    // Save the admin data and token
    setAdmin(data.user)
    setAdminToken(data.token)
    localStorage.setItem("adminToken", data.token)
    localStorage.setItem("admin", JSON.stringify(data.user))
    
    // Redirect to admin dashboard
    router.push("/")
  }

  const logout = () => {
    setAdmin(null)
    setAdminToken(null)
    localStorage.removeItem("adminToken")
    localStorage.removeItem("admin")
    router.push("/login")
  }

  return (
    <AdminAuthContext.Provider value={{ admin, adminToken, loading, login, logout }}>
      {children}
    </AdminAuthContext.Provider>
  )
}

export function useAdminAuth() {
  const context = useContext(AdminAuthContext)
  if (context === undefined) {
    throw new Error("useAdminAuth must be used within an AdminAuthProvider")
  }
  return context
}

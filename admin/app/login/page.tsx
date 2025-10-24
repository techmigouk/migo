"use client"

import type React from "react"

import { useState } from "react"
import { Eye, EyeOff, Shield } from "lucide-react"
import { useAdminAuth } from "@/lib/auth-context"

export default function AdminLoginPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const { login } = useAdminAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      await login({
        email: formData.email,
        password: formData.password
      })
    } catch (err: any) {
      setError(err.message || "Failed to log in")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a1f44] via-[#121826] to-[#0a1f44] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="bg-[#121826] p-8 rounded-2xl border-2 border-[#f59e0b]/20 shadow-2xl">
          <div className="text-center mb-8">
            <div className="flex items-center justify-center mb-4">
              <Shield className="w-12 h-12 text-[#f59e0b]" />
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">Admin Login</h1>
            <p className="text-[#d1d5db]">Access the TechMigo Admin Dashboard</p>
          </div>

          {error && (
            <div className="bg-red-500/10 border border-red-500 text-red-500 px-4 py-2 rounded-lg mb-6">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-white mb-2 text-sm font-medium">Email Address</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-4 py-3 bg-[#0a1f44] text-white rounded-lg border-2 border-[#374151] focus:border-[#f59e0b] focus:outline-none transition-colors"
                required
                autoComplete="email"
              />
            </div>

            <div>
              <label className="block text-white mb-2 text-sm font-medium">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full px-4 py-3 bg-[#0a1f44] text-white rounded-lg border-2 border-[#374151] focus:border-[#f59e0b] focus:outline-none transition-colors"
                  required
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#d1d5db] hover:text-[#f59e0b]"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full px-6 py-3 bg-[#f59e0b] text-[#0a1f44] font-semibold rounded-lg transition-all duration-300 ${
                loading 
                  ? "opacity-50 cursor-not-allowed" 
                  : "hover:bg-[#fbbf24]"
              }`}
            >
              {loading ? "Logging in..." : "Log In"}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-[#9ca3af] text-sm">
              <Shield className="w-4 h-4 inline mr-1" />
              Admin access only
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

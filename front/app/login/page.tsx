"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Eye, EyeOff } from "lucide-react"
import { useAuth } from "@/lib/auth-context"

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [isAlreadyLoggedIn, setIsAlreadyLoggedIn] = useState(false)
  const { login, logout, user } = useAuth()

  // Check if user is already logged in
  useEffect(() => {
    const token = localStorage.getItem("token")
    const storedUser = localStorage.getItem("user")
    if (token && storedUser) {
      setIsAlreadyLoggedIn(true)
    }
  }, [user])

  const handleGoToDashboard = () => {
    const dashboardUrl = process.env.NODE_ENV === 'production'
      ? 'https://app.techmigo.co.uk'
      : 'http://localhost:3004'
    window.location.href = dashboardUrl
  }

  const handleLogout = () => {
    logout()
    setIsAlreadyLoggedIn(false)
  }

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

  // If already logged in, show different UI
  if (isAlreadyLoggedIn) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0a1f44] via-[#121826] to-[#0a1f44] flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          <div className="bg-[#121826] p-8 rounded-2xl border-2 border-[#f59e0b]/20 shadow-2xl">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-white mb-2">Already Logged In</h1>
              <p className="text-[#d1d5db]">You're already signed in. Ready to continue learning?</p>
            </div>

            <div className="space-y-4">
              <button
                onClick={handleGoToDashboard}
                className="w-full px-6 py-3 bg-[#f59e0b] text-[#0a1f44] font-semibold rounded-lg hover:bg-[#fbbf24] transition-all duration-300"
              >
                Get Back to Learning
              </button>
              
              <button
                onClick={handleLogout}
                className="w-full px-6 py-3 border-2 border-[#f59e0b] text-[#f59e0b] font-semibold rounded-lg hover:bg-[#f59e0b]/10 transition-all duration-300"
              >
                Logout
              </button>
            </div>

            <p className="text-center text-[#d1d5db] text-sm mt-6">
              <Link href="/" className="text-[#f59e0b] hover:underline font-semibold">
                ← Back to Home
              </Link>
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a1f44] via-[#121826] to-[#0a1f44] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="bg-[#121826] p-8 rounded-2xl border-2 border-[#f59e0b]/20 shadow-2xl">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">Welcome Back</h1>
            <p className="text-[#d1d5db]">Log in to continue learning and building your portfolio</p>
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

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <input type="checkbox" id="remember" className="rounded" />
                <label htmlFor="remember" className="text-[#d1d5db] text-sm">
                  Remember me
                </label>
              </div>
              <Link href="/forgot-password" className="text-[#f59e0b] hover:underline text-sm">
                Forgot Password?
              </Link>
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

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-[#374151]"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-[#121826] text-[#d1d5db]">Or continue with</span>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-3">
              <button className="px-4 py-2 border-2 border-[#374151] text-white rounded-lg hover:border-[#f59e0b] hover:bg-[#f59e0b]/10 transition-all duration-300">
                Google
              </button>
              <button className="px-4 py-2 border-2 border-[#374151] text-white rounded-lg hover:border-[#f59e0b] hover:bg-[#f59e0b]/10 transition-all duration-300">
                GitHub
              </button>
            </div>
          </div>

          <p className="text-center text-[#d1d5db] text-sm mt-6">
            New to Techmigo?{" "}
            <Link href="/signup" className="text-[#f59e0b] hover:underline font-semibold">
              Sign up here
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

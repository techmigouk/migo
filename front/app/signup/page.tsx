"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { Eye, EyeOff } from "lucide-react"
import { useAuth } from "@/lib/auth-context"

export default function SignUpPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    agreed: false,
  })
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const { register } = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    // Validate passwords match
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match")
      setLoading(false)
      return
    }

    try {
      await register({
        name: formData.name,
        email: formData.email,
        password: formData.password
      })
    } catch (err: any) {
      setError(err.message || "Failed to create account")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a1f44] via-[#121826] to-[#0a1f44] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="bg-[#121826] p-8 rounded-2xl border-2 border-[#f59e0b]/20 shadow-2xl">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">Join Techmigo</h1>
            <p className="text-[#d1d5db]">Access world-class tech courses, projects, and certificates</p>
          </div>

          {error && (
            <div className="bg-red-500/10 border border-red-500 text-red-500 px-4 py-2 rounded-lg mb-6">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-white mb-2 text-sm font-medium">Full Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-3 bg-[#0a1f44] text-white rounded-lg border-2 border-[#374151] focus:border-[#f59e0b] focus:outline-none transition-colors"
                required
              />
            </div>

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

            <div>
              <label className="block text-white mb-2 text-sm font-medium">Confirm Password</label>
              <input
                type="password"
                value={formData.confirmPassword}
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                className="w-full px-4 py-3 bg-[#0a1f44] text-white rounded-lg border-2 border-[#374151] focus:border-[#f59e0b] focus:outline-none transition-colors"
                required
              />
            </div>

            <div className="flex items-start gap-2">
              <input
                type="checkbox"
                id="terms"
                checked={formData.agreed}
                onChange={(e) => setFormData({ ...formData, agreed: e.target.checked })}
                className="mt-1"
                required
              />
              <label htmlFor="terms" className="text-[#d1d5db] text-sm">
                I agree to the{" "}
                <Link href="/terms" className="text-[#f59e0b] hover:underline">
                  Terms of Service
                </Link>{" "}
                and{" "}
                <Link href="/privacy" className="text-[#f59e0b] hover:underline">
                  Privacy Policy
                </Link>
              </label>
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
              {loading ? "Creating Account..." : "Create Account"}
            </button>
          </form>

          <p className="text-center text-[#d1d5db] text-sm mt-6">
            Already have an account?{" "}
            <Link href="/login" className="text-[#f59e0b] hover:underline font-semibold">
              Log in
            </Link>
          </p>

          <p className="text-center text-[#d1d5db] text-xs mt-4">No credit card required.</p>
        </div>

        {/* Trust Indicators */}
        <div className="flex justify-center gap-6 mt-8 text-[#d1d5db] text-xs">
          <div className="flex items-center gap-2">
            <span>🔒</span>
            <span>Secure Signup</span>
          </div>
          <div className="flex items-center gap-2">
            <span>✓</span>
            <span>SSL Protected</span>
          </div>
          <div className="flex items-center gap-2">
            <span>👥</span>
            <span>50,000+ Learners</span>
          </div>
        </div>
      </div>
    </div>
  )
}

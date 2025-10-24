"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { CheckCircle } from "lucide-react"
import { useAuth } from "@/lib/auth-context"

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("")
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const { requestPasswordReset } = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      await requestPasswordReset(email)
      setSubmitted(true)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a1f44] via-[#121826] to-[#0a1f44] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="bg-[#121826] p-8 rounded-2xl border-2 border-[#f59e0b]/20 shadow-2xl">
          {!submitted ? (
            <>
              <div className="text-center mb-8">
                <h1 className="text-3xl font-bold text-white mb-2">Reset Your Password</h1>
                <p className="text-[#d1d5db]">Enter your email address and we'll send you a reset link</p>
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
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-3 bg-[#0a1f44] text-white rounded-lg border-2 border-[#374151] focus:border-[#f59e0b] focus:outline-none transition-colors"
                    required
                  />
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
                  {loading ? "Sending..." : "Send Reset Link"}
                </button>
              </form>

              <p className="text-center text-[#d1d5db] text-sm mt-6">
                Remember your password?{" "}
                <Link href="/login" className="text-[#f59e0b] hover:underline font-semibold">
                  Log in
                </Link>
              </p>
            </>
          ) : (
            <div className="text-center">
              <CheckCircle className="text-green-500 mx-auto mb-4" size={64} />
              <h2 className="text-2xl font-bold text-white mb-4">Check Your Email</h2>
              <p className="text-[#d1d5db] mb-6">
                We've sent a reset link to <strong>{email}</strong>. Please check your inbox.
              </p>
              <p className="text-[#d1d5db] text-sm mb-6">
                If you don't see the email, check your spam folder or{" "}
                <Link href="/contact" className="text-[#f59e0b] hover:underline">
                  contact support
                </Link>
              </p>
              <Link
                href="/login"
                className="inline-block px-6 py-3 bg-[#f59e0b] text-[#0a1f44] font-semibold rounded-lg hover:bg-[#fbbf24] transition-all duration-300"
              >
                Back to Login
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

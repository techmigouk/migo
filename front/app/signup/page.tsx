"use client"

import { useEffect } from "react"

/**
 * SIGNUP PAGE REDIRECT
 * 
 * This page redirects to the User App (localhost:3004/signup in development).
 * All authentication is now centralized in the User App.
 */

export default function SignUpPage() {
  useEffect(() => {
    // Redirect to User App signup
    const signupUrl = process.env.NODE_ENV === 'production'
      ? 'https://app.techmigo.co.uk/signup'
      : 'http://localhost:3004/signup'
    
    window.location.href = signupUrl
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a1f44] via-[#121826] to-[#0a1f44] flex items-center justify-center px-4">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#f59e0b] mx-auto mb-4"></div>
        <p className="text-white text-lg">Redirecting to signup...</p>
      </div>
    </div>
  )
}

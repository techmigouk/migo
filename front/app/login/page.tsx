"use client"

import { useEffect } from "react"

/**
 * LOGIN PAGE REDIRECT
 * 
 * This page redirects to the User App (localhost:3004/login in development).
 * All authentication is now centralized in the User App.
 */

export default function LoginPage() {
  useEffect(() => {
    // Redirect to User App login
    const loginUrl = process.env.NODE_ENV === 'production'
      ? 'https://app.techmigo.co.uk/login'
      : 'http://localhost:3004/login'
    
    window.location.href = loginUrl
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a1f44] via-[#121826] to-[#0a1f44] flex items-center justify-center px-4">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#f59e0b] mx-auto mb-4"></div>
        <p className="text-white text-lg">Redirecting to login...</p>
      </div>
    </div>
  )
}

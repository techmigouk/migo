"use client"

import { useEffect } from "react"
import { useRouter, usePathname } from "next/navigation"
import { useAdminAuth } from "@/lib/auth-context"

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { admin, loading } = useAdminAuth()
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    // Don't redirect if we're already on the login page
    if (pathname === "/login") {
      return
    }

    // If not loading and no admin, redirect to login
    if (!loading && !admin) {
      router.push("/login")
    }
  }, [admin, loading, router, pathname])

  // Show loading state while checking auth
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-amber-500 mx-auto mb-4"></div>
          <h2 className="text-2xl font-bold text-white mb-2">Loading...</h2>
          <p className="text-gray-400">Please wait</p>
        </div>
      </div>
    )
  }

  // Don't show anything if not authenticated (will redirect)
  if (!admin && pathname !== "/login") {
    return null
  }

  return <>{children}</>
}

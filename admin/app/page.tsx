"use client"

import { AdminDashboard } from "@/components/admin-dashboard"
import { ProtectedRoute } from "@/components/protected-route"

export default function Page() {
  return (
    <ProtectedRoute>
      <AdminDashboard />
    </ProtectedRoute>
  )
}

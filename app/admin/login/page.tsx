"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/contexts/auth-context"

export default function AdminLoginPage() {
  const router = useRouter()
  const { user, loading } = useAuth()

  useEffect(() => {
    // If user is already logged in and is admin, redirect to admin dashboard
    if (user && user.is_admin) {
      router.push("/admin")
    } else if (!loading) {
      // Otherwise redirect to main login page
      router.push("/auth/login")
    }
  }, [user, loading, router])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
        <p className="mt-4 text-gray-600">جاري التحويل...</p>
      </div>
    </div>
  )
}

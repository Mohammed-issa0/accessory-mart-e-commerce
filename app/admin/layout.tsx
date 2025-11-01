"use client"

import type React from "react"
import AdminSidebar from "@/components/admin/admin-sidebar"
import AdminHeader from "@/components/admin/admin-header"
import { useAuth } from "@/lib/contexts/auth-context"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    console.log(" Admin layout - checking auth...")
    console.log(" Loading:", loading)
    console.log(" User:", user)
    console.log(" Is admin:", user?.is_admin)

    if (!loading) {
      if (!user) {
        console.log(" No user found, redirecting to login...")
        router.push("/auth/login")
      } else if (!user.is_admin) {
        console.log(" User is not admin, redirecting to home...")
        router.push("/")
      }
    }
  }, [user, loading, router])

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">جاري التحميل...</p>
        </div>
      </div>
    )
  }

  if (!user || !user.is_admin) {
    return null
  }

  return (
    <div className="flex min-h-screen bg-gray-50" dir="rtl">
      <AdminSidebar />
      <div className="flex-1 flex flex-col">
        <AdminHeader admin={user} />
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  )
}

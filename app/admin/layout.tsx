import type React from "react"
import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import AdminSidebar from "@/components/admin/admin-sidebar"
import AdminHeader from "@/components/admin/admin-header"

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/admin/login")
  }

  // Get admin info
  const { data: admin } = await supabase
    .from("admins")
    .select("*")
    .eq("user_id", user.id)
    .eq("is_active", true)
    .single()

  if (!admin) {
    redirect("/")
  }

  return (
    <div className="flex min-h-screen bg-gray-50" dir="rtl">
      <AdminSidebar />
      <div className="flex-1 flex flex-col">
        <AdminHeader admin={admin} />
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  )
}

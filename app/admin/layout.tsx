import type React from "react"
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

  // Get admin info for header if user is logged in
  let admin = null
  if (user) {
    const { data: adminData } = await supabase
      .from("admins")
      .select("*")
      .eq("user_id", user.id)
      .eq("is_active", true)
      .maybeSingle()
    admin = adminData
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

import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import AdminLoginForm from "@/components/admin/admin-login-form"

export default async function AdminLoginPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (user) {
    // Check if user is admin
    const { data: admin } = await supabase
      .from("admins")
      .select("*")
      .eq("user_id", user.id)
      .eq("is_active", true)
      .single()

    if (admin) {
      redirect("/admin")
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100" dir="rtl">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Accessory Admin</h1>
            <p className="text-gray-600">تسجيل الدخول إلى لوحة التحكم</p>
          </div>
          <AdminLoginForm />
        </div>
      </div>
    </div>
  )
}

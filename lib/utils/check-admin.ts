import { createClient } from "@/lib/supabase/server"

export async function checkIsAdmin(userId: string): Promise<boolean> {
  const supabase = await createClient()

  // Check if user has is_admin flag
  const { data: user } = await supabase.from("users").select("is_admin").eq("id", userId).single()

  if (user?.is_admin) {
    return true
  }

  // Fallback: check admins table
  const { data: admin } = await supabase
    .from("admins")
    .select("id")
    .eq("user_id", userId)
    .eq("is_active", true)
    .single()

  return !!admin
}

export async function getCurrentUserAdminStatus() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { isAdmin: false, user: null }
  }

  const isAdmin = await checkIsAdmin(user.id)

  return { isAdmin, user }
}

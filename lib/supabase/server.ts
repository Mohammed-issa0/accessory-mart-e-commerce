import { createServerClient as createSupabaseServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"

export async function createClient() {
  const cookieStore = await cookies()

   const supabaseUrl = "https://fgkclfhuaiiuuxvjkbty.supabase.co"
  const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZna2NsZmh1YWlpdXV4dmprYnR5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjEwMDY0ODQsImV4cCI6MjA3NjU4MjQ4NH0.yVg7NssHqn62fJO4cDDh692geYUcEae-Ef7D8xKpsi4"

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error("Missing Supabase environment variables")
  }

  return createSupabaseServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll()
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options))
        } catch {
          // Server Component - ignore
        }
      },
    },
  })
}

export { createClient as createServerClient }

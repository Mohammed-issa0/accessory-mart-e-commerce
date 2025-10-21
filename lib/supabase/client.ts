import { createBrowserClient as createSupabaseBrowserClient } from "@supabase/ssr"

export function createClient() {
  const supabaseUrl = "https://fgkclfhuaiiuuxvjkbty.supabase.co"
  const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZna2NsZmh1YWlpdXV4dmprYnR5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjEwMDY0ODQsImV4cCI6MjA3NjU4MjQ4NH0.yVg7NssHqn62fJO4cDDh692geYUcEae-Ef7D8xKpsi4"

  if (!supabaseUrl || !supabaseAnonKey) {
    console.warn(
      "[v0] Supabase credentials not found. Please add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY to your environment variables.",
    )
    return null
  }

  return createSupabaseBrowserClient(supabaseUrl, supabaseAnonKey)
}

export { createClient as createBrowserClient }

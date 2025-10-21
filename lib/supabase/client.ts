import { createBrowserClient as createSupabaseBrowserClient } from "@supabase/ssr"

const supabaseUrl = process.env.SUPABASE_SUPABASE_NEXT_PUBLIC_SUPABASE_URL || ""
const supabaseAnonKey = process.env.SUPABASE_NEXT_PUBLIC_SUPABASE_ANON_KEY_ANON_KEY || ""

export function createClient() {
  if (!supabaseUrl || !supabaseAnonKey) {
    console.warn("[v0] Supabase environment variables not configured. Auth features will be disabled.")
    return null
  }

  return createSupabaseBrowserClient(supabaseUrl, supabaseAnonKey)
}

export { createClient as createBrowserClient }

"use server"

import { createClient } from "@/lib/supabase/server"
import { headers } from "next/headers"

export async function signupAction(email: string, password: string, fullName: string, phone: string) {
  const supabase = await createClient()

  const headersList = await headers()
  const origin = headersList.get("origin") || process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"
  const emailRedirectTo = process.env.NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL || `${origin}/auth/callback`

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo,
      data: {
        full_name: fullName,
        phone,
      },
    },
  })

  if (error) {
    return { error: error.message }
  }

  if (data.user) {
    await supabase.from("users").insert({
      id: data.user.id,
      email: data.user.email,
      full_name: fullName,
      phone: phone || null,
    })
  }

  return { success: true, user: data.user }
}

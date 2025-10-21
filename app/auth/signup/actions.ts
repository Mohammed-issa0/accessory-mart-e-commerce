"use server"

import { createClient } from "@/lib/supabase/server"

export async function signupAction(email: string, password: string, fullName: string, phone: string) {
  const supabase = await createClient()

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName,
        phone,
      },
    },
  })

  if (error) {
    return { error: error.message }
  }

  return { success: true, user: data.user }
}

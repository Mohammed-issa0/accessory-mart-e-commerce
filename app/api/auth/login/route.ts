import { NextResponse } from "next/server"
import { apiClient } from "@/lib/api/client"

export async function POST(request: Request) {
  try {
    const formData = await request.formData()
    const email = formData.get("email") as string
    const password = formData.get("password") as string

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required" }, { status: 400 })
    }

    const data = await apiClient.login(email, password)
    return NextResponse.json(data)
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Login failed" }, { status: 401 })
  }
}

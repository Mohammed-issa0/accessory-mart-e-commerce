import { NextResponse } from "next/server"
import { apiClient } from "@/lib/api/client"

export async function POST() {
  try {
    await apiClient.logout()
    return NextResponse.json({ success: true })
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Logout failed" }, { status: 500 })
  }
}

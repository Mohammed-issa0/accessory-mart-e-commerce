import { NextResponse } from "next/server"
import { apiClient } from "@/lib/api/client"

export async function GET() {
  try {
    const data = await apiClient.getUser()
    return NextResponse.json(data)
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to fetch user" }, { status: 401 })
  }
}

import { apiClient } from "@/lib/api/client"
import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    console.log("[v0] Creating new product")

    const formData = await request.formData()

    const data = await apiClient.createProduct(formData)

    console.log("[v0] Product created successfully")

    return NextResponse.json(data)
  } catch (error: any) {
    console.error("[v0] Error creating product:", error)
    return NextResponse.json({ error: error.message || "Failed to create product" }, { status: 500 })
  }
}

import { apiClient } from "@/lib/api/client"
import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    console.log("[v0] Updating product with ID:", id)

    const formData = await request.formData()

    const data = await apiClient.updateProduct(id, formData)

    console.log("[v0] Product updated successfully")

    return NextResponse.json(data)
  } catch (error: any) {
    console.error("[v0] Error updating product:", error)
    return NextResponse.json({ error: error.message || "Failed to update product" }, { status: 500 })
  }
}

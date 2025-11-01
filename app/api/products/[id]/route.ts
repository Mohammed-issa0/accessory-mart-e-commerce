import { type NextRequest, NextResponse } from "next/server"
import { apiClient } from "@/lib/api/client"
import { mockProducts } from "@/lib/api/mock-data"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const data = await apiClient.getProduct(params.id)
    return NextResponse.json(data)
  } catch (error: any) {
    console.error("❌ Product API error:", error)
    console.log("📦 Using mock data as fallback")

    const product = mockProducts.find((p) => p.id.toString() === params.id)
    if (product) {
      return NextResponse.json({
        product,
        message: "Using mock data - external API not available",
      })
    }

    return NextResponse.json({ error: "Product not found" }, { status: 404 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    console.log("[v0] Deleting product with ID:", params.id)

    const data = await apiClient.deleteProduct(params.id)

    console.log("[v0] Product deleted successfully")

    return NextResponse.json(data)
  } catch (error: any) {
    console.error("[v0] Error deleting product:", error)
    return NextResponse.json({ error: error.message || "Failed to delete product" }, { status: 500 })
  }
}

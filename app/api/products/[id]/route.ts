import { type NextRequest, NextResponse } from "next/server"
import { apiClient } from "@/lib/api/client"
import { mockProducts } from "@/lib/api/mock-data"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const data = await apiClient.getProduct(params.id)
    return NextResponse.json(data)
  } catch (error: any) {
    console.error(" Product API error:", error)
    console.log(" Using mock data as fallback")

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

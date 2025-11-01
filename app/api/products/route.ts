import { NextResponse } from "next/server"
import { apiClient } from "@/lib/api/client"
import { isAPIConfigured } from "@/lib/api/config"
import { mockProducts } from "@/lib/api/mock-data"

export async function GET() {
  try {
    if (!isAPIConfigured()) {
      console.log(" Using mock data as fallback")
      return NextResponse.json({
        data: mockProducts,
        message: "Using mock data - external API not configured",
      })
    }

    const response = await apiClient.getProducts()

    // The external API might return { products: [...] } or just [...] or { data: [...] }
    let products = []
    if (Array.isArray(response)) {
      products = response
    } else if (response.products) {
      products = response.products
    } else if (response.data) {
      products = response.data
    }

    console.log(" Products fetched successfully:", products.length, "items")

    return NextResponse.json({
      data: products,
    })
  } catch (error: any) {
    console.error(" Products API error:", error)
    console.log(" Using mock data as fallback")

    return NextResponse.json({
      data: mockProducts,
      message: "Using mock data - external API not available",
    })
  }
}

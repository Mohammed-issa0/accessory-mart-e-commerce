import { NextResponse } from "next/server"
import { apiClient } from "@/lib/api/client"
import { isAPIConfigured } from "@/lib/api/config"
import { mockProducts } from "@/lib/api/mock-data"

export async function GET() {
  try {
    if (!isAPIConfigured()) {
      console.log("[v0] Using mock data as fallback")
      return NextResponse.json({
        data: mockProducts,
        message: "Using mock data - external API not configured",
      })
    }

    console.log("[v0] Calling apiClient.getProducts()...")
    const response = await apiClient.getProducts()

    console.log("[v0] Raw API response:", JSON.stringify(response).substring(0, 200))

    // The external API might return { products: [...] } or just [...] or { data: [...] }
    let products = []
    if (Array.isArray(response)) {
      products = response
      console.log("[v0] Response is array, length:", products.length)
    } else if (response.products) {
      products = response.products
      console.log("[v0] Response has products property, length:", products.length)
    } else if (response.data) {
      products = response.data
      console.log("[v0] Response has data property, length:", products.length)
    } else {
      console.log("[v0] Unknown response structure:", Object.keys(response))
    }

    console.log("[v0] Products fetched successfully:", products.length, "items")

    return NextResponse.json({
      data: products,
    })
  } catch (error: any) {
    console.error("[v0] Products API error:", error)
    console.log("[v0] Using mock data as fallback")

    return NextResponse.json({
      data: mockProducts,
      message: "Using mock data - external API not available",
    })
  }
}

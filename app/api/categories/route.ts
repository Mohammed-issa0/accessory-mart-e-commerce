import { NextResponse } from "next/server"
import { apiClient } from "@/lib/api/client"
import { isAPIConfigured } from "@/lib/api/config"
import { mockCategories } from "@/lib/api/mock-data"

export async function GET() {
  try {
    if (!isAPIConfigured()) {
      console.log("[v0] Using mock data as fallback")
      return NextResponse.json({
        data: mockCategories,
        message: "Using mock data - external API not configured",
      })
    }

    // [v0] Log before making the API call
    console.log("[v0] Calling apiClient.getCategories()...")
    const response = await apiClient.getCategories()

    // [v0] Log the raw response
    console.log("[v0] Raw API response:", JSON.stringify(response).substring(0, 200))

    // The external API might return { categories: [...] } or just [...]
    // We need to normalize it to { data: [...] }
    let categories = []
    if (Array.isArray(response)) {
      categories = response
      console.log("[v0] Response is array, length:", categories.length)
    } else if (response.categories) {
      categories = response.categories
      console.log("[v0] Response has categories property, length:", categories.length)
    } else if (response.data) {
      categories = response.data
      console.log("[v0] Response has data property, length:", categories.length)
    } else {
      console.log("[v0] Unknown response structure:", Object.keys(response))
    }

    console.log("[v0] Categories fetched successfully:", categories.length, "items")

    return NextResponse.json({
      data: categories,
    })
  } catch (error: any) {
    console.error("[v0] Categories API error:", error)
    console.log("[v0] Using mock data as fallback")

    return NextResponse.json({
      data: mockCategories,
      message: "Using mock data - external API not available",
    })
  }
}

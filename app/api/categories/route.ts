import { NextResponse } from "next/server"
import { apiClient } from "@/lib/api/client"
import { isAPIConfigured } from "@/lib/api/config"
import { mockCategories } from "@/lib/api/mock-data"

export async function GET() {
  try {
    if (!isAPIConfigured()) {
      console.log(" Using mock data as fallback")
      return NextResponse.json({
        data: mockCategories,
        message: "Using mock data - external API not configured",
      })
    }

    const response = await apiClient.getCategories()

    // The external API might return { categories: [...] } or just [...]
    // We need to normalize it to { data: [...] }
    let categories = []
    if (Array.isArray(response)) {
      categories = response
    } else if (response.categories) {
      categories = response.categories
    } else if (response.data) {
      categories = response.data
    }

    console.log(" Categories fetched successfully:", categories.length, "items")

    return NextResponse.json({
      data: categories,
    })
  } catch (error: any) {
    console.error(" Categories API error:", error)
    console.log(" Using mock data as fallback")

    return NextResponse.json({
      data: mockCategories,
      message: "Using mock data - external API not available",
    })
  }
}

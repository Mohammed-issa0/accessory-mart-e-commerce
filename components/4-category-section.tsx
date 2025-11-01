import CategorySectionClient from "./4-category-section-client"
import { getBaseUrl } from "@/lib/utils/get-base-url"

export default async function CategorySection() {
  const baseUrl = getBaseUrl()

  let categories: any[] = []

  try {
    const categoriesRes = await fetch(`${baseUrl}/api/categories`, {
      cache: "no-store",
    })
    const categoriesData = await categoriesRes.json()
    categories = categoriesData.data || []
  } catch (error) {
    console.error("[v0] Error fetching categories:", error)
    categories = []
  }

  const formattedCategories = categories.slice(0, 12).map((cat: any) => ({
    id: String(cat.id),
    name: cat.name || cat.name_ar || "فئة",
    slug: cat.slug,
    icon: cat.icon || cat.images?.[0]?.url || "/placeholder.svg?height=48&width=48",
  }))

  console.log("[v0] Formatted categories for client:", formattedCategories.length)

  return <CategorySectionClient categories={formattedCategories} />
}

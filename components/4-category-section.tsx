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
    id: cat.id,
    name: cat.name_ar,
    slug: cat.slug,
    icon: cat.icon || "/placeholder.svg?height=48&width=48",
  }))

  return <CategorySectionClient categories={formattedCategories} />
}

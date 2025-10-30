import CategorySectionClient from "./4-category-section-client"

export default async function CategorySection() {
  const baseUrl =
    process.env.NEXT_PUBLIC_APP_URL || process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : "http://localhost:3000"

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

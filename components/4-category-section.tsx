import { createClient } from "@/lib/supabase/server"
import CategorySectionClient from "./4-category-section-client"

export default async function CategorySection() {
  const supabase = await createClient()

  const { data: categories } = await supabase
    .from("categories")
    .select("id, name_ar, slug, icon")
    .eq("is_active", true)
    .order("name_ar")
    .limit(12)

  const formattedCategories =
    categories?.map((cat) => ({
      id: cat.id,
      name: cat.name_ar,
      slug: cat.slug,
      icon: cat.icon || "/placeholder.svg?height=48&width=48",
    })) || []

  return <CategorySectionClient categories={formattedCategories} />
}

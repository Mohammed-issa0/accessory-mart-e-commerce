import { createClient } from "@/lib/supabase/server"
import FeaturedProductsClient from "./5-featured-products-client"

export default async function FeaturedProducts() {
  const supabase = await createClient()

  const { data: products } = await supabase
    .from("products")
    .select(
      `
      id,
      name_ar,
      price,
      slug,
      product_images (image_url, is_primary),
      product_colors (color_hex)
    `,
    )
    .eq("is_featured", true)
    .eq("is_available", true)
    .order("created_at", { ascending: false })
    .limit(6)

  const formattedProducts =
    products?.map((product) => ({
      id: product.id,
      name: product.name_ar,
      price: product.price,
      slug: product.slug,
      image:
        product.product_images?.find((img: any) => img.is_primary)?.image_url ||
        product.product_images?.[0]?.image_url ||
        "/placeholder.svg?height=400&width=400",
      colors: product.product_colors?.map((c: any) => c.color_hex) || [],
    })) || []

  return <FeaturedProductsClient products={formattedProducts} />
}

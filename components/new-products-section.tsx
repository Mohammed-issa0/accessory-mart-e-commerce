import { createClient } from "@/lib/supabase/server"
import NewProductsClient from "./new-products-client"

export default async function NewProductsSection() {
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
    .eq("is_available", true)
    .order("created_at", { ascending: false })
    .limit(3)

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

  return <NewProductsClient products={formattedProducts} />
}

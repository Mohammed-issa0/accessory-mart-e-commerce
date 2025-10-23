import { createClient } from "@/lib/supabase/server"
import FeaturedProductsClient from "./5-featured-products-client"
import ProductSkeleton from "./product-skeleton"
import { Suspense } from "react"

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

  return (
    <Suspense
      fallback={
        <section className="py-12 md:py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl md:text-3xl font-bold text-center mb-10">أبرز المنتجات</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <ProductSkeleton key={i} />
              ))}
            </div>
          </div>
        </section>
      }
    >
      <FeaturedProductsClient products={formattedProducts} />
    </Suspense>
  )
}

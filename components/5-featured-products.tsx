import FeaturedProductsClient from "./5-featured-products-client"
import ProductSkeleton from "./product-skeleton"
import { Suspense } from "react"
import { getBaseUrl } from "@/lib/utils/get-base-url"

export default async function FeaturedProducts() {
  const baseUrl = getBaseUrl()

  let products: any[] = []

  try {
    const productsRes = await fetch(`${baseUrl}/api/products`, {
      cache: "no-store",
    })
    const productsData = await productsRes.json()
    products = productsData.data || []
  } catch (error) {
    console.error("[v0] Error fetching featured products:", error)
    products = []
  }

  const featuredProducts = products.slice(0, 6)

  const formattedProducts = featuredProducts.map((product: any) => ({
    id: String(product.id),
    name: product.name_ar || product.name || "منتج",
    price: Number(product.price) || 0,
    slug: product.slug,
    image: product.image_url || product.images?.[0]?.url || "/placeholder.svg?height=400&width=400",
    colors: Array.isArray(product.colors) ? product.colors : [],
  }))

  console.log("[v0] Formatted featured products for client:", formattedProducts.length)

  return (
    <Suspense
      fallback={
        <section className="py-12 md:py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl md:text-3xl font-bold text-center mb-10">أبرز المنتجات</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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

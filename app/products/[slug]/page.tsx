import { notFound } from "next/navigation"
import ProductDetailClient from "@/components/product-detail-client"
import Header from "@/components/1-header"
import Footer from "@/components/8-footer"
import { apiClient } from "@/lib/api/client"

export default async function ProductDetailPage({ params }: { params: { slug: string } }) {
  try {
    const response = await apiClient.getAllProducts()
    const products = response.data || []

    const decodedSlug = decodeURIComponent(params.slug)
    console.log("[v0] Looking for product with decoded slug:", decodedSlug)
    console.log("[v0] Total products available:", products.length)

    const product = products.find((p: any) => p.slug === decodedSlug)

    if (!product) {
      console.log("[v0] Product not found with slug:", decodedSlug)
      notFound()
    }

    console.log("[v0] Product found:", product.name_ar)

    // Fetch similar products from the same category
    const similarProducts = products
      .filter((p: any) => p.category?.id === product.category?.id && p.id !== product.id)
      .slice(0, 3)

    return (
      <>
        <Header />
        <main className="pt-32 pb-16">
          <ProductDetailClient product={product} similarProducts={similarProducts} />
        </main>
        <Footer />
      </>
    )
  } catch (error) {
    console.error("[v0] Error fetching product:", error)
    notFound()
  }
}

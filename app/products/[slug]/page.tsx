import { notFound } from "next/navigation"
import ProductDetailClient from "@/components/product-detail-client"
import Header from "@/components/1-header"
import Footer from "@/components/8-footer"
import { apiClient } from "@/lib/api/client"

export default async function ProductDetailPage({ params }: { params: { slug: string } }) {
  try {
    const response = await apiClient.getAllProducts()
    const products = response.data || []

    const product = products.find((p: any) => p.slug === params.slug)

    if (!product) {
      notFound()
    }

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

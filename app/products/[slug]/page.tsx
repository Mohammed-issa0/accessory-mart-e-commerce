import { notFound } from "next/navigation"
import ProductDetailClient from "@/components/product-detail-client"
import Header from "@/components/1-header"
import Footer from "@/components/8-footer"

export default async function ProductDetailPage({ params }: { params: { slug: string } }) {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"

  // Fetch all products to find by slug
  const productsRes = await fetch(`${baseUrl}/api/products`, {
    cache: "no-store",
  })
  const productsData = await productsRes.json()
  const products = productsData.data || []

  const product = products.find((p: any) => p.slug === params.slug)

  if (!product) {
    notFound()
  }

  // Fetch similar products from the same category
  const similarProducts = products
    .filter((p: any) => p.category_id === product.category_id && p.id !== product.id)
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
}

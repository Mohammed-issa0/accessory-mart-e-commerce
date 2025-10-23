import { createClient } from "@/lib/supabase/server"
import { notFound } from "next/navigation"
import ProductDetailClient from "@/components/product-detail-client"
import Header from "@/components/1-header"
import Footer from "@/components/8-footer"

export default async function ProductDetailPage({ params }: { params: { slug: string } }) {
  const supabase = await createClient()

  // Fetch product with all related data
  const { data: product, error } = await supabase
    .from("products")
    .select(
      `
      *,
      category:categories(name_ar, slug),
      product_images(image_url, alt_text, display_order, is_primary),
      product_colors(color_name_ar, color_hex, display_order)
    `,
    )
    .eq("slug", params.slug)
    .eq("is_available", true)
    .single()

  if (error || !product) {
    notFound()
  }

  // Fetch similar products from the same category
  const { data: similarProducts } = await supabase
    .from("products")
    .select(
      `
      id,
      name_ar,
      price,
      slug,
      product_images(image_url, is_primary),
      product_colors(color_hex)
    `,
    )
    .eq("category_id", product.category_id)
    .eq("is_available", true)
    .neq("id", product.id)
    .limit(3)

  // Sort images by display_order and is_primary
  const sortedImages = product.product_images?.sort((a: any, b: any) => {
    if (a.is_primary) return -1
    if (b.is_primary) return 1
    return a.display_order - b.display_order
  })

  // Sort colors by display_order
  const sortedColors = product.product_colors?.sort((a: any, b: any) => a.display_order - b.display_order)

  return (
    <>
      <Header />
      <main className="pt-32 pb-16">
        <ProductDetailClient
          product={{
            ...product,
            product_images: sortedImages || [],
            product_colors: sortedColors || [],
          }}
          similarProducts={similarProducts || []}
        />
      </main>
      <Footer />
    </>
  )
}

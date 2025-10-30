import NewProductsClient from "./new-products-client"

export default async function NewProductsSection() {
  const baseUrl =
    process.env.NEXT_PUBLIC_APP_URL || process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : "http://localhost:3000"

  let products: any[] = []

  try {
    const productsRes = await fetch(`${baseUrl}/api/products`, {
      cache: "no-store",
    })
    const productsData = await productsRes.json()
    products = productsData.data || []
  } catch (error) {
    console.error("[v0] Error fetching new products:", error)
    products = []
  }

  const newProducts = products.slice(0, 3)

  const formattedProducts = newProducts.map((product: any) => ({
    id: product.id,
    name: product.name_ar,
    price: product.price,
    slug: product.slug,
    image: product.image_url || "/placeholder.svg?height=400&width=400",
    colors: product.colors || [],
  }))

  return <NewProductsClient products={formattedProducts} />
}

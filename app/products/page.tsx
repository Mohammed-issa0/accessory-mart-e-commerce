import { createClient } from "@/lib/supabase/server"
import Header from "@/components/1-header"
import Footer from "@/components/8-footer"
import ProductsGrid from "@/components/products/products-grid"
import ProductsFilters from "@/components/products/products-filters"

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: {
    category?: string
    minPrice?: string
    maxPrice?: string
    sort?: string
    search?: string
    color?: string
  }
}) {
  const supabase = await createClient()

  // Fetch categories for filters
  const { data: categories } = await supabase
    .from("categories")
    .select("id, name_ar, slug")
    .eq("is_active", true)
    .order("name_ar")

  // Build query
  let query = supabase
    .from("products")
    .select(
      `
      id,
      name_ar,
      price,
      slug,
      stock_quantity,
      product_images (image_url, is_primary),
      product_colors (color_hex),
      category:categories (name_ar, slug)
    `,
    )
    .eq("is_available", true)

  // Apply filters
  if (searchParams.category) {
    const category = categories?.find((c) => c.slug === searchParams.category)
    if (category) {
      query = query.eq("category_id", category.id)
    }
  }

  if (searchParams.minPrice) {
    query = query.gte("price", Number.parseFloat(searchParams.minPrice))
  }

  if (searchParams.maxPrice) {
    query = query.lte("price", Number.parseFloat(searchParams.maxPrice))
  }

  if (searchParams.search) {
    query = query.ilike("name_ar", `%${searchParams.search}%`)
  }

  // Apply sorting
  switch (searchParams.sort) {
    case "price-asc":
      query = query.order("price", { ascending: true })
      break
    case "price-desc":
      query = query.order("price", { ascending: false })
      break
    case "name":
      query = query.order("name_ar", { ascending: true })
      break
    default:
      query = query.order("created_at", { ascending: false })
  }

  const { data: products } = await query

  let formattedProducts =
    products?.map((product) => ({
      id: product.id,
      name: product.name_ar,
      price: product.price,
      slug: product.slug,
      stock: product.stock_quantity,
      image:
        product.product_images?.find((img: any) => img.is_primary)?.image_url ||
        product.product_images?.[0]?.image_url ||
        "/placeholder.svg?height=400&width=400",
      colors: product.product_colors?.map((c: any) => c.color_hex) || [],
      category: product.category?.name_ar || "",
    })) || []

  if (searchParams.color) {
    formattedProducts = formattedProducts.filter((product) =>
      product.colors.some((color) => color.toLowerCase() === searchParams.color?.toLowerCase()),
    )
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 pt-32 pb-16">
        <div className="container mx-auto px-4">
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold mb-2">جميع المنتجات</h1>
            <p className="text-gray-600">اكتشف مجموعتنا الكاملة من الإكسسوارات العصرية</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Filters Sidebar */}
            <div className="lg:col-span-1">
              <ProductsFilters categories={categories || []} />
            </div>

            {/* Products Grid */}
            <div className="lg:col-span-3">
              <ProductsGrid products={formattedProducts} />
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}

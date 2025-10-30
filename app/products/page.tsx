import Header from "@/components/1-header"
import Footer from "@/components/8-footer"
import ProductsGrid from "@/components/products/products-grid"
import ProductsFilters from "@/components/products/products-filters"
import { AlertCircle } from "lucide-react"

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
  const baseUrl =
    process.env.NEXT_PUBLIC_APP_URL || process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : "http://localhost:3000"

  let categories: any[] = []
  let products: any[] = []
  let error: string | null = null

  try {
    // Fetch categories
    const categoriesRes = await fetch(`${baseUrl}/api/categories`, {
      cache: "no-store",
    })
    const categoriesData = await categoriesRes.json()

    if (categoriesData.error) {
      error = categoriesData.error
    } else {
      categories = categoriesData.data || []
    }

    // Fetch products
    const productsRes = await fetch(`${baseUrl}/api/products`, {
      cache: "no-store",
    })
    const productsData = await productsRes.json()

    if (productsData.error) {
      error = productsData.error
    } else {
      products = productsData.data || []
    }
  } catch (err: any) {
    console.error("[v0] Error fetching data:", err)
    error = "فشل الاتصال بالخادم. يرجى المحاولة مرة أخرى."
  }

  // Apply filters
  if (searchParams.category && !error) {
    const category = categories.find((c: any) => c.slug === searchParams.category)
    if (category) {
      products = products.filter((p: any) => p.category_id === category.id)
    }
  }

  if (searchParams.minPrice && !error) {
    products = products.filter((p: any) => p.price >= Number.parseFloat(searchParams.minPrice!))
  }

  if (searchParams.maxPrice && !error) {
    products = products.filter((p: any) => p.price <= Number.parseFloat(searchParams.maxPrice!))
  }

  if (searchParams.search && !error) {
    products = products.filter((p: any) => p.name_ar?.toLowerCase().includes(searchParams.search!.toLowerCase()))
  }

  // Apply sorting
  if (!error) {
    switch (searchParams.sort) {
      case "price-asc":
        products.sort((a: any, b: any) => a.price - b.price)
        break
      case "price-desc":
        products.sort((a: any, b: any) => b.price - a.price)
        break
      case "name":
        products.sort((a: any, b: any) => a.name_ar?.localeCompare(b.name_ar))
        break
      default:
        products.sort((a: any, b: any) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    }
  }

  let formattedProducts = products.map((product: any) => ({
    id: product.id,
    name: product.name_ar,
    price: product.price,
    slug: product.slug,
    stock: product.stock_quantity,
    image: product.image_url || "/placeholder.svg?height=400&width=400",
    colors: product.colors || [],
    category: product.category_name_ar || "",
  }))

  if (searchParams.color && !error) {
    formattedProducts = formattedProducts.filter((product: any) =>
      product.colors.some((color: string) => color.toLowerCase() === searchParams.color?.toLowerCase()),
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

          {error ? (
            <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
              <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-red-900 mb-2">خطأ في الاتصال</h3>
              <p className="text-red-700 mb-4">{error}</p>
              <p className="text-sm text-red-600">
                يرجى التأكد من إعداد متغير البيئة <code className="bg-red-100 px-2 py-1 rounded">EXTERNAL_API_URL</code>{" "}
                في قسم Vars
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
              <div className="lg:col-span-1">
                <ProductsFilters categories={categories} />
              </div>

              <div className="lg:col-span-3">
                <ProductsGrid products={formattedProducts} />
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  )
}

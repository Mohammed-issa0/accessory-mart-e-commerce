import { createClient } from "@/lib/supabase/server"
import { Plus, Search, Filter, ArrowUpDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import ProductsTable from "@/components/admin/products-table"
import ProductsStats from "@/components/admin/products-stats"
import ProductsChart from "@/components/admin/products-chart"
import CategoryFilters from "@/components/admin/category-filters"
import Link from "next/link"

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: { category?: string; showAll?: string }
}) {
  const supabase = await createClient()
  const categoryId = searchParams.category
  const showAll = searchParams.showAll === "true"

  let productsQuery = supabase
    .from("products")
    .select(`
      *,
      category:categories(name_ar),
      product_images(image_url)
    `)
    .order("created_at", { ascending: false })

  if (categoryId) {
    productsQuery = productsQuery.eq("category_id", categoryId)
  }

  const { data: products } = await productsQuery

  const { data: categories } = await supabase.from("categories").select("id, name_ar").eq("is_active", true)

  const categoriesWithCounts = await Promise.all(
    (categories || []).map(async (category) => {
      const { count } = await supabase
        .from("products")
        .select("*", { count: "exact", head: true })
        .eq("category_id", category.id)
      return { ...category, count: count || 0 }
    }),
  )

  const { count: totalProducts } = await supabase.from("products").select("*", { count: "exact", head: true })

  const { count: activeCategories } = await supabase
    .from("categories")
    .select("*", { count: "exact", head: true })
    .eq("is_active", true)

  const { count: outOfStock } = await supabase
    .from("products")
    .select("*", { count: "exact", head: true })
    .eq("stock_quantity", 0)

  const { count: lowStock } = await supabase
    .from("products")
    .select("*", { count: "exact", head: true })
    .lt("stock_quantity", 10)
    .gt("stock_quantity", 0)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg p-6 border border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">المنتجات</h1>
            <p className="text-gray-600">جميع منتجات متجرك هنا</p>
          </div>
          <Link href="/admin/products/new">
            <Button className="gap-2">
              <Plus className="w-4 h-4" />
              إضافة منتج
            </Button>
          </Link>
        </div>

        <CategoryFilters
          totalProducts={totalProducts || 0}
          categories={categoriesWithCounts}
          selectedCategory={categoryId}
        />
      </div>

      {/* Stats */}
      <ProductsStats
        totalProducts={totalProducts || 0}
        activeCategories={activeCategories || 0}
        outOfStock={outOfStock || 0}
        lowStock={lowStock || 0}
      />

      {/* Search and Filters */}
      <div className="bg-white rounded-lg p-6 border border-gray-200">
        <div className="flex items-center gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <Input placeholder="بحث عن منتج..." className="pr-10" />
          </div>
          <Button variant="outline" size="icon">
            <Filter className="w-5 h-5" />
          </Button>
          <Button variant="outline" size="icon">
            <ArrowUpDown className="w-5 h-5" />
          </Button>
        </div>

        <ProductsTable products={products || []} showAll={showAll} />

        {!showAll && (products?.length || 0) > 10 && (
          <div className="mt-6 flex justify-center">
            <Link href="/admin/products?showAll=true">
              <Button variant="outline">عرض جميع المنتجات ({totalProducts})</Button>
            </Link>
          </div>
        )}
      </div>

      {/* Charts */}
      <ProductsChart />
    </div>
  )
}

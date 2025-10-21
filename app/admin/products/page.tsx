import { createClient } from "@/lib/supabase/server"
import { Plus, Search, Filter, ArrowUpDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import ProductsTable from "@/components/admin/products-table"
import ProductsStats from "@/components/admin/products-stats"
import ProductsChart from "@/components/admin/products-chart"
import Link from "next/link"

export default async function ProductsPage() {
  const supabase = await createClient()

  const { data: products } = await supabase
    .from("products")
    .select(`
      *,
      category:categories(name_ar),
      product_images(image_url)
    `)
    .order("created_at", { ascending: false })

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

        {/* Filter Tabs */}
        <div className="flex items-center gap-2 flex-wrap">
          <Button variant="default" size="sm">
            الكل
            <span className="mr-2 bg-white text-black px-2 py-0.5 rounded text-xs">{totalProducts || 156}</span>
          </Button>
          <Button variant="outline" size="sm">
            المنتجات الفردية
            <span className="mr-2 bg-gray-100 px-2 py-0.5 rounded text-xs">50</span>
          </Button>
          <Button variant="outline" size="sm">
            المنتجات المجمعة
            <span className="mr-2 bg-gray-100 px-2 py-0.5 rounded text-xs">40</span>
          </Button>
          <Button variant="outline" size="sm">
            قسيمة
            <span className="mr-2 bg-gray-100 px-2 py-0.5 rounded text-xs">16</span>
          </Button>
          <Button variant="outline" size="sm">
            الطلبات الرقمية
            <span className="mr-2 bg-gray-100 px-2 py-0.5 rounded text-xs">50</span>
          </Button>
        </div>
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

        {/* Products Table */}
        <ProductsTable products={products || []} />

        {/* Export Button */}
        <div className="mt-6 flex justify-center">
          <Button variant="outline">جميع المنتجات</Button>
        </div>
      </div>

      {/* Charts */}
      <ProductsChart />
    </div>
  )
}

"use client"

import { Plus, Search, Filter, ArrowUpDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import ProductsTable from "@/components/admin/products-table"
import ProductsStats from "@/components/admin/products-stats"
import ProductsChart from "@/components/admin/products-chart"
import CategoryFilters from "@/components/admin/category-filters"
import Link from "next/link"
import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"

export default function ProductsPage() {
  const searchParams = useSearchParams()
  const categoryId = searchParams.get("category")
  const showAll = searchParams.get("showAll") === "true"

  const [products, setProducts] = useState<any[]>([])
  const [categories, setCategories] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchData() {
      try {
        // Fetch products
        const productsRes = await fetch("/api/products")
        const productsData = await productsRes.json()

        // Fetch categories
        const categoriesRes = await fetch("/api/categories")
        const categoriesData = await categoriesRes.json()

        console.log(" Admin products - Products fetched:", productsData.data?.length || 0)
        console.log(" Admin products - Categories fetched:", categoriesData.data?.length || 0)

        setProducts(productsData.data || [])
        setCategories(categoriesData.data || [])
      } catch (error) {
        console.error(" Error fetching admin products data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  // Filter products by category if selected
  const filteredProducts = categoryId ? products.filter((p) => p.category_id?.toString() === categoryId) : products

  // Calculate categories with counts
  const categoriesWithCounts = categories.map((category) => ({
    ...category,
    count: products.filter((p) => p.category_id === category.id).length,
  }))

  // Calculate statistics
  const totalProducts = products.length
  const activeCategories = categories.length
  const outOfStock = products.filter((p) => p.stock_quantity === 0).length
  const lowStock = products.filter((p) => p.stock_quantity > 0 && p.stock_quantity < 10).length

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p className="text-gray-600">جاري تحميل المنتجات...</p>
        </div>
      </div>
    )
  }

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
          totalProducts={totalProducts}
          categories={categoriesWithCounts}
          selectedCategory={categoryId || undefined}
        />
      </div>

      {/* Stats */}
      <ProductsStats
        totalProducts={totalProducts}
        activeCategories={activeCategories}
        outOfStock={outOfStock}
        lowStock={lowStock}
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

        <ProductsTable products={filteredProducts} showAll={showAll} />

        {!showAll && filteredProducts.length > 10 && (
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

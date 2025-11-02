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
import { apiClient } from "@/lib/api/client"

export default function ProductsPage() {
  const searchParams = useSearchParams()
  const categoryId = searchParams.get("category")
  const showAll = searchParams.get("showAll") === "true"

  const [products, setProducts] = useState<any[]>([])
  const [categories, setCategories] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [totalCount, setTotalCount] = useState(0)

  useEffect(() => {
    async function fetchData() {
      try {
        const productsData = await apiClient.getAllProducts()
        const categoriesData = await apiClient.getCategories()

        console.log("[v0] Admin products - Products response:", productsData)
        console.log("[v0] Admin products - Categories response:", categoriesData)

        const productsList = productsData.data || productsData.products || []
        const categoriesList = categoriesData.data || categoriesData.categories || []
        const total = productsData.meta?.total || productsList.length

        console.log("[v0] Admin products - Products fetched:", productsList.length)
        console.log("[v0] Admin products - Total count from API:", total)
        console.log("[v0] Admin products - Categories fetched:", categoriesList.length)

        setProducts(productsList)
        setCategories(categoriesList)
        setTotalCount(total)
      } catch (error) {
        console.error("[v0] Error fetching admin products data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  // Filter products by category if selected
  const filteredProducts = categoryId ? products.filter((p) => p.category?.id?.toString() === categoryId) : products

  // Calculate categories with counts
  const categoriesWithCounts = categories.map((category) => ({
    ...category,
    name_ar: category.name_ar || category.name,
    count: products.filter((p) => p.category?.id === category.id).length,
  }))

  const totalProducts = totalCount
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

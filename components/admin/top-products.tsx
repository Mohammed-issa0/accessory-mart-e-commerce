"use client"

import { useEffect, useState } from "react"
import Image from "next/image"

interface Product {
  id: number
  name_ar: string
  price: string
  image_url?: string
  sales_count?: number
}

export default function TopProducts() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchProducts() {
      try {
        const res = await fetch("/api/products")
        const data = await res.json()

        // Get top 3 products (mock sales count for now)
        const topProducts = (data.data || []).slice(0, 3).map((product: any, index: number) => ({
          ...product,
          sales_count: 50 - index * 10, // Mock sales count
        }))

        setProducts(topProducts)
      } catch (error) {
        console.error(" Error fetching top products:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [])

  if (loading) {
    return (
      <div className="bg-white rounded-lg p-6 border border-gray-200">
        <h2 className="text-lg font-bold text-gray-900 mb-6">المنتجات الأكثر مبيعاً</h2>
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg p-6 border border-gray-200">
      <h2 className="text-lg font-bold text-gray-900 mb-6">المنتجات الأكثر مبيعاً</h2>

      <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
        <p className="text-sm text-blue-800">
          📝 أرقام المبيعات تجريبية - سيتم ربطها بالـ API عند توفر endpoint المبيعات
        </p>
      </div>

      <div className="space-y-4">
        {products.map((product, index) => (
          <div key={product.id} className="flex items-center gap-4 p-3 rounded-lg hover:bg-gray-50">
            <span className="text-lg font-bold text-gray-400">{index + 1}</span>
            <div className="w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center overflow-hidden">
              {product.image_url ? (
                <Image
                  src={product.image_url || "/placeholder.svg"}
                  alt={product.name_ar}
                  width={48}
                  height={48}
                  className="object-cover"
                />
              ) : (
                <span className="text-2xl">📦</span>
              )}
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-900">{product.name_ar}</p>
              <p className="text-xs text-gray-500">{product.sales_count || 0} مبيعة</p>
            </div>
            <p className="text-sm font-bold text-gray-900">{product.price} ريال</p>
          </div>
        ))}
      </div>
      <button className="w-full mt-4 text-sm text-gray-600 hover:text-gray-900 transition-colors">
        تصفح كافة المنتجات
      </button>
    </div>
  )
}

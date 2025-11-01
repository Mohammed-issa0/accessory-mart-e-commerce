"use client"

import { useEffect, useState } from "react"
import ProductForm from "@/components/admin/product-form"
import { Spinner } from "@/components/ui/spinner"

interface Category {
  id: string
  name_ar: string
}

export default function NewProductPage() {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchCategories() {
      try {
        const response = await fetch("/api/categories")
        const data = await response.json()

        // Transform API data to match expected format
        const formattedCategories = (data.data || []).map((cat: any) => ({
          id: String(cat.id),
          name_ar: cat.name || cat.name_ar || "غير محدد",
        }))

        setCategories(formattedCategories)
      } catch (error) {
        console.error("Error fetching categories:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchCategories()
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Spinner className="w-8 h-8" />
      </div>
    )
  }

  return (
    <div className="max-w-4xl">
      <div className="bg-white rounded-lg p-6 border border-gray-200 mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">إضافة منتج جديد</h1>
        <p className="text-gray-600">أدخل المعلومات الأساسية لمنتجك الجديد</p>
        <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <p className="text-sm text-yellow-800">
            <strong>ملاحظة:</strong> وظيفة إضافة المنتجات تتطلب API endpoint للإنشاء (POST /api/products). حالياً يمكنك
            ملء النموذج لكن الحفظ لن يعمل حتى يتم توفير هذا الـ endpoint من الباك اند.
          </p>
        </div>
      </div>

      <ProductForm categories={categories} />
    </div>
  )
}

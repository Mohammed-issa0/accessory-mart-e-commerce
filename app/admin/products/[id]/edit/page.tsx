"use client"

import { useEffect, useState } from "react"
import { notFound } from "next/navigation"
import ProductForm from "@/components/admin/product-form"
import { Spinner } from "@/components/ui/spinner"

interface Category {
  id: string
  name_ar: string
}

export default function EditProductPage({ params }: { params: { id: string } }) {
  const [product, setProduct] = useState<any>(null)
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [notFoundError, setNotFoundError] = useState(false)

  useEffect(() => {
    async function fetchData() {
      try {
        // Fetch product
        const productResponse = await fetch(`/api/products/${params.id}`)
        if (!productResponse.ok) {
          setNotFoundError(true)
          return
        }
        const productData = await productResponse.json()

        // Fetch categories
        const categoriesResponse = await fetch("/api/categories")
        const categoriesData = await categoriesResponse.json()

        // Transform data
        const formattedCategories = (categoriesData.data || []).map((cat: any) => ({
          id: String(cat.id),
          name_ar: cat.name || cat.name_ar || "غير محدد",
        }))

        setProduct(productData)
        setCategories(formattedCategories)
      } catch (error) {
        console.error("Error fetching data:", error)
        setNotFoundError(true)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [params.id])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Spinner className="w-8 h-8" />
      </div>
    )
  }

  if (notFoundError || !product) {
    notFound()
  }

  return (
    <div className="max-w-4xl">
      <div className="bg-white rounded-lg p-6 border border-gray-200 mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">تعديل المنتج</h1>
        <p className="text-gray-600">قم بتحديث معلومات المنتج</p>
        <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <p className="text-sm text-yellow-800">
            <strong>ملاحظة:</strong> وظيفة تعديل المنتجات تتطلب API endpoint للتحديث (PUT /api/products/:id). حالياً
            يمكنك تعديل النموذج لكن الحفظ لن يعمل حتى يتم توفير هذا الـ endpoint من الباك اند.
          </p>
        </div>
      </div>

      <ProductForm categories={categories} product={product} />
    </div>
  )
}

"use client"

import { useEffect, useState } from "react"
import { notFound } from "next/navigation"
import ProductForm from "@/components/admin/product-form"
import { Spinner } from "@/components/ui/spinner"
import { apiClient } from "@/lib/api/client"

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
        const productData = await apiClient.getProduct(params.id)
        const categoriesData = await apiClient.getCategories()

        console.log("[v0] Product data:", productData)
        console.log("[v0] Categories data:", categoriesData)

        const productItem = productData.data || productData.product || productData
        const categoriesList = categoriesData.data || categoriesData.categories || []

        // Transform data
        const formattedCategories = categoriesList.map((cat: any) => ({
          id: String(cat.id),
          name_ar: cat.name_ar || cat.name || "غير محدد",
        }))

        setProduct(productItem)
        setCategories(formattedCategories)
      } catch (error) {
        console.error("[v0] Error fetching data:", error)
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
      </div>

      <ProductForm categories={categories} product={product} />
    </div>
  )
}

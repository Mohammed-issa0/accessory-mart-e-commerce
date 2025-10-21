import { createClient } from "@/lib/supabase/server"
import { notFound } from "next/navigation"
import ProductForm from "@/components/admin/product-form"

export default async function EditProductPage({ params }: { params: { id: string } }) {
  const supabase = await createClient()

  // Fetch product data
  const { data: product } = await supabase
    .from("products")
    .select(
      `
      *,
      product_images (*)
    `,
    )
    .eq("id", params.id)
    .single()

  if (!product) {
    notFound()
  }

  // Fetch categories
  const { data: categories } = await supabase.from("categories").select("*").eq("is_active", true).order("name_ar")

  return (
    <div className="max-w-4xl">
      <div className="bg-white rounded-lg p-6 border border-gray-200 mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">تعديل المنتج</h1>
        <p className="text-gray-600">قم بتحديث معلومات المنتج</p>
      </div>

      <ProductForm categories={categories || []} product={product} />
    </div>
  )
}

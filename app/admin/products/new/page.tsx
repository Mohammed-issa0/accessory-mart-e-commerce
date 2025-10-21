import { createClient } from "@/lib/supabase/server"
import ProductForm from "@/components/admin/product-form"

export default async function NewProductPage() {
  const supabase = await createClient()

  const { data: categories } = await supabase.from("categories").select("*").eq("is_active", true).order("name_ar")

  return (
    <div className="max-w-4xl">
      <div className="bg-white rounded-lg p-6 border border-gray-200 mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">إضافة منتج جديد</h1>
        <p className="text-gray-600">أدخل المعلومات الأساسية لمنتجك الجديد</p>
      </div>

      <ProductForm categories={categories || []} />
    </div>
  )
}

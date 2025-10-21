import { createClient } from "@/lib/supabase/server"
import Image from "next/image"

export default async function TopProducts() {
  const supabase = await createClient()

  const { data: products } = await supabase
    .from("products")
    .select(`
      *,
      product_images(image_url)
    `)
    .order("sales_count", { ascending: false })
    .limit(3)

  return (
    <div className="bg-white rounded-lg p-6 border border-gray-200">
      <h2 className="text-lg font-bold text-gray-900 mb-6">المنتجات الأكثر مبيعاً</h2>
      <div className="space-y-4">
        {products?.map((product, index) => (
          <div key={product.id} className="flex items-center gap-4 p-3 rounded-lg hover:bg-gray-50">
            <span className="text-lg font-bold text-gray-400">{index + 1}</span>
            <div className="w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center overflow-hidden">
              {product.product_images?.[0]?.image_url ? (
                <Image
                  src={product.product_images[0].image_url || "/placeholder.svg"}
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

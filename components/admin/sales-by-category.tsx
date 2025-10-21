import { createClient } from "@/lib/supabase/server"

export default async function SalesByCategory() {
  const supabase = await createClient()

  const { data: categories } = await supabase
    .from("categories")
    .select(`
      name_ar,
      products(sales_count)
    `)
    .limit(5)

  const categoryData =
    categories?.map((cat) => ({
      name: cat.name_ar,
      sales: cat.products?.reduce((sum: number, p: any) => sum + (p.sales_count || 0), 0) || 0,
    })) || []

  const maxSales = Math.max(...categoryData.map((c) => c.sales), 1)

  return (
    <div className="bg-white rounded-lg p-6 border border-gray-200">
      <h2 className="text-lg font-bold text-gray-900 mb-6">المبيعات حسب الفئة</h2>
      <div className="space-y-4">
        {categoryData.map((category) => (
          <div key={category.name}>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">{category.name}</span>
              <span className="text-sm text-gray-600">{category.sales}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-black h-2 rounded-full transition-all"
                style={{ width: `${(category.sales / maxSales) * 100}%` }}
              />
            </div>
          </div>
        ))}
      </div>
      <button className="w-full mt-4 text-sm text-gray-600 hover:text-gray-900 transition-colors">
        تصفح كافة الفئات
      </button>
    </div>
  )
}

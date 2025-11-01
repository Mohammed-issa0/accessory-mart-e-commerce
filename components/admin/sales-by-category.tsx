"use client"

export default function SalesByCategory() {
  // Mock data for sales by category (will be replaced when API has sales data)
  const categoryData = [
    { name: "إكسسوارات الهواتف", sales: 245 },
    { name: "الشواحن والكابلات", sales: 198 },
    { name: "السماعات", sales: 167 },
    { name: "حوامل وحافظات", sales: 134 },
    { name: "أخرى", sales: 89 },
  ]

  const maxSales = Math.max(...categoryData.map((c) => c.sales), 1)

  return (
    <div className="bg-white rounded-lg p-6 border border-gray-200">
      <h2 className="text-lg font-bold text-gray-900 mb-6">المبيعات حسب الفئة</h2>
      <p className="text-xs text-gray-500 mb-4">(بيانات تجريبية - سيتم ربطها بالـ API لاحقاً)</p>
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
    </div>
  )
}

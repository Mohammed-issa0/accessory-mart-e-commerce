"use client"

export default function SuccessMetrics() {
  // Mock data for success metrics (will be replaced when API has orders endpoint)
  const metrics = [
    { title: "إتمام الطلبات", percentage: 87 },
    { title: "قيد التوصيل", percentage: 12 },
    { title: "المنتجات المتاحة", percentage: 94 },
  ]

  return (
    <div className="bg-white rounded-lg p-6 border border-gray-200">
      <h2 className="text-lg font-bold text-gray-900 mb-6">إحصائيات المتجر</h2>
      <p className="text-xs text-gray-500 mb-4">(بيانات تجريبية - سيتم ربطها بالـ API لاحقاً)</p>
      <div className="space-y-4">
        {metrics.map((metric) => (
          <div key={metric.title}>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">{metric.title}</span>
              <span className="text-sm font-bold text-gray-900">{metric.percentage}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-black h-2 rounded-full transition-all" style={{ width: `${metric.percentage}%` }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

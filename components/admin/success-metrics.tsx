export default function SuccessMetrics() {
  const metrics = [
    { title: "تحقيق الأرباح", percentage: 23 },
    { title: "إتمام البيع", percentage: 67 },
    { title: "الشحن والتوصيل", percentage: 45 },
  ]

  return (
    <div className="bg-white rounded-lg p-6 border border-gray-200">
      <h2 className="text-lg font-bold text-gray-900 mb-6">ابدأ رحلة نجاح متجرك</h2>
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

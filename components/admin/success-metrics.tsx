import { createClient } from "@/lib/supabase/server"

export default async function SuccessMetrics() {
  const supabase = await createClient()

  const { count: totalOrders } = await supabase.from("orders").select("*", { count: "exact", head: true })

  const { count: completedOrders } = await supabase
    .from("orders")
    .select("*", { count: "exact", head: true })
    .eq("status", "completed")

  const { count: shippingOrders } = await supabase
    .from("orders")
    .select("*", { count: "exact", head: true })
    .eq("status", "shipping")

  const { count: totalProducts } = await supabase.from("products").select("*", { count: "exact", head: true })

  const { count: availableProducts } = await supabase
    .from("products")
    .select("*", { count: "exact", head: true })
    .eq("is_available", true)

  // Calculate percentages
  const completionRate = totalOrders ? Math.round((completedOrders! / totalOrders) * 100) : 0
  const shippingRate = totalOrders ? Math.round((shippingOrders! / totalOrders) * 100) : 0
  const availabilityRate = totalProducts ? Math.round((availableProducts! / totalProducts) * 100) : 0

  const metrics = [
    { title: "إتمام الطلبات", percentage: completionRate },
    { title: "قيد التوصيل", percentage: shippingRate },
    { title: "المنتجات المتاحة", percentage: availabilityRate },
  ]

  return (
    <div className="bg-white rounded-lg p-6 border border-gray-200">
      <h2 className="text-lg font-bold text-gray-900 mb-6">إحصائيات المتجر</h2>
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

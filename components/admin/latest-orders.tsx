import { createClient } from "@/lib/supabase/server"
import { Button } from "@/components/ui/button"

export default async function LatestOrders() {
  const supabase = await createClient()

  const { data: orders } = await supabase.from("orders").select("*").order("created_at", { ascending: false }).limit(3)

  const getStatusBadge = (status: string) => {
    const statusMap: Record<string, { label: string; className: string }> = {
      new: { label: "جديد", className: "bg-blue-100 text-blue-700" },
      completed: { label: "مكتمل", className: "bg-green-100 text-green-700" },
      shipping: { label: "قيد التوصيل", className: "bg-yellow-100 text-yellow-700" },
    }
    return statusMap[status] || { label: status, className: "bg-gray-100 text-gray-700" }
  }

  return (
    <div className="bg-white rounded-lg p-6 border border-gray-200">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-bold text-gray-900">آخر الطلبات</h2>
        <Button variant="outline" size="sm">
          إنشاء طلب جديد
        </Button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="text-right py-3 px-4 text-sm font-medium text-gray-600">رقم الطلب</th>
              <th className="text-right py-3 px-4 text-sm font-medium text-gray-600">العميل</th>
              <th className="text-right py-3 px-4 text-sm font-medium text-gray-600">رقم الهاتف</th>
              <th className="text-right py-3 px-4 text-sm font-medium text-gray-600">المبلغ</th>
              <th className="text-right py-3 px-4 text-sm font-medium text-gray-600">الحالة</th>
              <th className="text-right py-3 px-4 text-sm font-medium text-gray-600">تاريخ الطلب</th>
            </tr>
          </thead>
          <tbody>
            {orders?.map((order) => {
              const status = getStatusBadge(order.status)
              return (
                <tr key={order.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 px-4 text-sm text-gray-900">{order.order_number}</td>
                  <td className="py-3 px-4 text-sm text-gray-900">{order.customer_name}</td>
                  <td className="py-3 px-4 text-sm text-gray-600">{order.customer_phone}</td>
                  <td className="py-3 px-4 text-sm text-gray-900">{order.total} ريال</td>
                  <td className="py-3 px-4">
                    <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${status.className}`}>
                      {status.label}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-600">
                    {new Date(order.created_at).toLocaleDateString("ar-SA")}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}

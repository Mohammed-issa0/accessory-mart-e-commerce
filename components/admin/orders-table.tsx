"use client"

import { useState } from "react"
import { Eye } from "lucide-react"
import { Button } from "@/components/ui/button"
import OrderDetailsModal from "./order-details-modal"

interface Order {
  id: string
  order_number: string
  customer_name: string
  customer_email: string
  customer_phone: string
  total: number
  status: string
  created_at: string
}

interface OrdersTableProps {
  orders: Order[]
}

export default function OrdersTable({ orders }: OrdersTableProps) {
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)

  const getStatusBadge = (status: string) => {
    const statusMap: Record<string, { label: string; className: string }> = {
      new: { label: "جديد", className: "bg-blue-100 text-blue-700" },
      processing: { label: "جاري التجهيز", className: "bg-yellow-100 text-yellow-700" },
      ready: { label: "جاهز", className: "bg-purple-100 text-purple-700" },
      shipping: { label: "قيد التوصيل", className: "bg-orange-100 text-orange-700" },
      completed: { label: "مكتمل", className: "bg-green-100 text-green-700" },
      cancelled: { label: "ملغي", className: "bg-red-100 text-red-700" },
      refund_pending: { label: "قيد الاسترجاع", className: "bg-pink-100 text-pink-700" },
      refunded: { label: "مسترجع", className: "bg-gray-100 text-gray-700" },
    }
    return statusMap[status] || { label: status, className: "bg-gray-100 text-gray-700" }
  }

  return (
    <>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="text-right py-3 px-4 text-sm font-medium text-gray-600">رقم الطلب</th>
              <th className="text-right py-3 px-4 text-sm font-medium text-gray-600">الاسم</th>
              <th className="text-right py-3 px-4 text-sm font-medium text-gray-600">البريد الإلكتروني</th>
              <th className="text-right py-3 px-4 text-sm font-medium text-gray-600">رقم الهاتف</th>
              <th className="text-right py-3 px-4 text-sm font-medium text-gray-600">المبلغ</th>
              <th className="text-right py-3 px-4 text-sm font-medium text-gray-600">الحالة</th>
              <th className="text-right py-3 px-4 text-sm font-medium text-gray-600">تاريخ الطلب</th>
              <th className="text-right py-3 px-4 text-sm font-medium text-gray-600">الإجراءات</th>
            </tr>
          </thead>
          <tbody>
            {orders.slice(0, 6).map((order) => {
              const status = getStatusBadge(order.status)
              return (
                <tr key={order.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 px-4 text-sm text-gray-900">{order.order_number}</td>
                  <td className="py-3 px-4 text-sm text-gray-900">{order.customer_name}</td>
                  <td className="py-3 px-4 text-sm text-gray-600">{order.customer_email}</td>
                  <td className="py-3 px-4 text-sm text-gray-600">{order.customer_phone}</td>
                  <td className="py-3 px-4 text-sm text-gray-900">{order.total} ج.س</td>
                  <td className="py-3 px-4">
                    <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${status.className}`}>
                      {status.label}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-600">
                    {new Date(order.created_at).toLocaleDateString("ar-SA")}
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="gap-2 bg-transparent"
                        onClick={() => setSelectedOrder(order)}
                      >
                        <Eye className="w-4 h-4" />
                        عرض المشتريات
                      </Button>
                      <Button variant="outline" size="sm" className="gap-2 bg-transparent">
                        تواصل
                      </Button>
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {selectedOrder && <OrderDetailsModal order={selectedOrder} onClose={() => setSelectedOrder(null)} />}
    </>
  )
}

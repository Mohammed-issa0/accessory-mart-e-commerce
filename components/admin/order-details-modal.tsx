"use client"

import { useEffect, useState } from "react"
import { X, Download } from "lucide-react"
import { Button } from "@/components/ui/button"
import { createClient } from "@/lib/supabase/client"
import Image from "next/image"

interface Order {
  id: string
  order_number: string
  customer_name: string
  customer_email: string
  customer_phone: string
  shipping_address: string
  payment_method: string
  subtotal: number
  tax: number
  total: number
  created_at: string
}

interface OrderDetailsModalProps {
  order: Order
  onClose: () => void
}

export default function OrderDetailsModal({ order, onClose }: OrderDetailsModalProps) {
  const [orderItems, setOrderItems] = useState<any[]>([])
  const supabase = createClient()

  useEffect(() => {
    const fetchOrderItems = async () => {
      const { data } = await supabase.from("order_items").select("*").eq("order_id", order.id)

      setOrderItems(data || [])
    }

    fetchOrderItems()
  }, [order.id, supabase])

  const getStatusBadge = (status: string) => {
    const statusMap: Record<string, { label: string; className: string }> = {
      completed: { label: "تم التوصيل", className: "bg-green-100 text-green-700" },
      shipping: { label: "قيد الشحن", className: "bg-blue-100 text-blue-700" },
    }
    return statusMap[status] || { label: "قيد التوصيل", className: "bg-yellow-100 text-yellow-700" }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div
        className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-gray-900">فاتورة الطلب {order.order_number}</h2>
            <p className="text-sm text-gray-600">
              تم إنشاء الفاتورة في {new Date(order.created_at).toLocaleDateString("ar-SA")}
            </p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Customer Info */}
          <div>
            <h3 className="text-sm font-bold text-gray-900 mb-3">معلومات العميل</h3>
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2">
                <span className="text-gray-600">اسم العميل:</span>
                <span className="text-gray-900">{order.customer_name}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-gray-600">العنوان:</span>
                <span className="text-gray-900">{order.shipping_address}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-gray-600">رقم الهاتف:</span>
                <span className="text-gray-900">{order.customer_phone}</span>
              </div>
            </div>
          </div>

          {/* Payment Method */}
          <div>
            <h3 className="text-sm font-bold text-gray-900 mb-3">طريقة الدفع</h3>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded bg-gray-100 flex items-center justify-center">💳</div>
              <span className="text-sm text-gray-900">
                {order.payment_method === "mada" ? "بطاقة مدى" : order.payment_method}
              </span>
            </div>
          </div>

          {/* Products */}
          <div>
            <h3 className="text-sm font-bold text-gray-900 mb-3">المنتجات</h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-right py-2 text-xs font-medium text-gray-600">رقم الطلب</th>
                    <th className="text-right py-2 text-xs font-medium text-gray-600">اسم المنتج</th>
                    <th className="text-right py-2 text-xs font-medium text-gray-600">السعر</th>
                    <th className="text-right py-2 text-xs font-medium text-gray-600">الكمية</th>
                    <th className="text-right py-2 text-xs font-medium text-gray-600">الإجمالي</th>
                    <th className="text-right py-2 text-xs font-medium text-gray-600">الحالة</th>
                  </tr>
                </thead>
                <tbody>
                  {orderItems.map((item, index) => (
                    <tr key={item.id} className="border-b border-gray-100">
                      <td className="py-3 text-sm text-gray-900">{index + 1}</td>
                      <td className="py-3">
                        <div className="flex items-center gap-2">
                          <div className="w-10 h-10 rounded bg-gray-100 flex items-center justify-center overflow-hidden">
                            {item.product_image ? (
                              <Image
                                src={item.product_image || "/placeholder.svg"}
                                alt={item.product_name}
                                width={40}
                                height={40}
                                className="object-cover"
                              />
                            ) : (
                              <span>📦</span>
                            )}
                          </div>
                          <span className="text-sm text-gray-900">{item.product_name}</span>
                        </div>
                      </td>
                      <td className="py-3 text-sm text-gray-900">{item.price} ريال</td>
                      <td className="py-3 text-sm text-gray-900">{item.quantity}</td>
                      <td className="py-3 text-sm text-gray-900">{item.total} ريال</td>
                      <td className="py-3">
                        <span className="inline-flex px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
                          تم التوصيل
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Totals */}
          <div className="border-t border-gray-200 pt-4 space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">المجموع الفرعي:</span>
              <span className="text-gray-900">{order.subtotal} ريال</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">الضريبة (15%):</span>
              <span className="text-gray-900">{order.tax} ريال</span>
            </div>
            <div className="flex items-center justify-between text-base font-bold border-t border-gray-200 pt-2">
              <span className="text-gray-900">المجموع النهائي:</span>
              <span className="text-gray-900">{order.total} ريال</span>
            </div>
          </div>

          {/* Download Button */}
          <Button className="w-full gap-2">
            <Download className="w-4 h-4" />
            تحميل الفاتورة PDF
          </Button>
        </div>
      </div>
    </div>
  )
}

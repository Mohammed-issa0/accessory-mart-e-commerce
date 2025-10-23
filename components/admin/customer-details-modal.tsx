"use client"

import { useEffect, useState } from "react"
import { X, Download } from "lucide-react"
import { Button } from "@/components/ui/button"
import { createClient } from "@/lib/supabase/client"
import Image from "next/image"

interface Customer {
  id: string
  full_name: string
  email: string
  phone: string
  total_orders: number
}

interface CustomerDetailsModalProps {
  customer: Customer
  onClose: () => void
}

export default function CustomerDetailsModal({ customer, onClose }: CustomerDetailsModalProps) {
  const [orders, setOrders] = useState<any[]>([])
  const [orderItems, setOrderItems] = useState<any[]>([])
  const supabase = createClient()

  useEffect(() => {
    const fetchCustomerOrders = async () => {
      const { data: ordersData } = await supabase
        .from("orders")
        .select("*")
        .eq("customer_id", customer.id)
        .order("created_at", { ascending: false })
        .limit(1)

      if (ordersData && ordersData.length > 0) {
        setOrders(ordersData)

        const { data: itemsData } = await supabase.from("order_items").select("*").eq("order_id", ordersData[0].id)

        setOrderItems(itemsData || [])
      }
    }

    fetchCustomerOrders()
  }, [customer.id, supabase])

  const totalAmount = orderItems.reduce((sum, item) => sum + Number(item.total), 0)

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
        className="bg-white rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-900">مشتريات العميل - {customer.full_name}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {orders.length > 0 ? (
            <>
              {/* Products Table */}
              <div className="overflow-x-auto mb-6">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-right py-2 text-sm font-medium text-gray-600">رقم الطلب</th>
                      <th className="text-right py-2 text-sm font-medium text-gray-600">اسم المنتج</th>
                      <th className="text-right py-2 text-sm font-medium text-gray-600">السعر</th>
                      <th className="text-right py-2 text-sm font-medium text-gray-600">الكمية</th>
                      <th className="text-right py-2 text-sm font-medium text-gray-600">تاريخ الشراء</th>
                      <th className="text-right py-2 text-sm font-medium text-gray-600">الحالة</th>
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
                        <td className="py-3 text-sm text-gray-600">
                          {new Date(orders[0].created_at).toLocaleDateString("ar-SA")}
                        </td>
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

              {/* Summary */}
              <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">إجمالي المشتريات:</span>
                  <span className="text-gray-900 font-bold">{orderItems.length} منتجات</span>
                </div>
                <div className="flex items-center justify-between text-base font-bold">
                  <span className="text-gray-900">المجموع الكلي:</span>
                  <span className="text-gray-900">{totalAmount.toFixed(2)} ريال</span>
                </div>
              </div>

              {/* Download Button */}
              <Button className="w-full mt-6 gap-2">
                <Download className="w-4 h-4" />
                تحميل الفاتورة PDF
              </Button>
            </>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500">لا توجد مشتريات لهذا العميل</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

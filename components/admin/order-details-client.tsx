"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { ArrowRight, Upload } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import Image from "next/image"
import Link from "next/link"

interface OrderItem {
  id: string
  product_name: string
  product_image: string
  quantity: number
  price: number
  total: number
}

interface Order {
  id: string
  order_number: string
  customer_name: string
  customer_email: string
  customer_phone: string
  shipping_address: string
  shipping_city: string
  payment_method: string
  subtotal: number
  tax: number
  total: number
  status: string
  notes: string | null
  created_at: string
  order_items: OrderItem[]
}

interface OrderDetailsClientProps {
  order: Order
}

export default function OrderDetailsClient({ order }: OrderDetailsClientProps) {
  const router = useRouter()
  const { toast } = useToast()
  const [status, setStatus] = useState(order.status)
  const [isUpdating, setIsUpdating] = useState(false)

  const handleStatusUpdate = async (newStatus: string) => {
    setIsUpdating(true)
    try {
      const response = await fetch(`/api/orders/${order.id}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      })

      if (!response.ok) throw new Error("Failed to update status")

      setStatus(newStatus)
      toast({
        title: "تم تحديث الحالة",
        description: "تم تحديث حالة الطلب بنجاح",
      })
      router.refresh()
    } catch (error) {
      toast({
        title: "خطأ",
        description: "فشل تحديث حالة الطلب",
        variant: "destructive",
      })
    } finally {
      setIsUpdating(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/admin/orders">
              <Button variant="ghost" size="icon">
                <ArrowRight className="w-5 h-5" />
              </Button>
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">تفاصيل الطلب #{order.order_number}</h1>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline">عرض الفاتورة</Button>
            <Button className="bg-black hover:bg-gray-800">إضافة ملاحظة</Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Order Information */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4">معلومات الطلب</h2>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <p className="text-sm text-gray-600 mb-1">رقم الطلب</p>
                  <p className="text-sm font-medium text-gray-900">#{order.order_number}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">تاريخ الإنشاء</p>
                  <p className="text-sm font-medium text-gray-900">
                    {new Date(order.created_at).toLocaleDateString("ar-SA")}
                  </p>
                  <p className="text-xs text-gray-500">
                    {new Date(order.created_at).toLocaleTimeString("ar-SA", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">مصدر الطلب</p>
                  <p className="text-sm font-medium text-gray-900">المتجر الإلكتروني</p>
                </div>
              </div>
            </div>

            {/* Order Status */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4">حالة الطلب</h2>
              <Select value={status} onValueChange={handleStatusUpdate} disabled={isUpdating}>
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="new">جديد</SelectItem>
                  <SelectItem value="processing">جاري التجهيز</SelectItem>
                  <SelectItem value="ready">جاهز</SelectItem>
                  <SelectItem value="shipping">جاري التوصيل</SelectItem>
                  <SelectItem value="completed">مكتمل</SelectItem>
                  <SelectItem value="cancelled">ملغي</SelectItem>
                  <SelectItem value="refund_pending">قيد الاسترجاع</SelectItem>
                  <SelectItem value="refunded">مسترجع</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Products Table */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4">حالة الطلب</h2>
              <table className="w-full">
                <thead className="border-b border-gray-200">
                  <tr>
                    <th className="text-right py-3 text-sm font-medium text-gray-700">المنتج</th>
                    <th className="text-center py-3 text-sm font-medium text-gray-700">الكمية</th>
                    <th className="text-center py-3 text-sm font-medium text-gray-700">السعر</th>
                    <th className="text-center py-3 text-sm font-medium text-gray-700">الإجمالي</th>
                  </tr>
                </thead>
                <tbody>
                  {order.order_items.map((item) => (
                    <tr key={item.id} className="border-b border-gray-100">
                      <td className="py-4">
                        <div className="flex items-center gap-3">
                          <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-gray-100">
                            {item.product_image && (
                              <Image
                                src={item.product_image || "/placeholder.svg"}
                                alt={item.product_name}
                                fill
                                className="object-cover"
                              />
                            )}
                          </div>
                          <span className="text-sm text-gray-900">{item.product_name}</span>
                        </div>
                      </td>
                      <td className="py-4 text-center text-sm text-gray-900">{item.quantity}</td>
                      <td className="py-4 text-center text-sm text-gray-900">{item.price} ريال</td>
                      <td className="py-4 text-center text-sm text-gray-900">--</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Payment Method */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4">طريقة الدفع</h2>
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-gray-100 rounded flex items-center justify-center">
                    <span className="text-xs">💳</span>
                  </div>
                  <span className="text-sm text-gray-900">
                    {order.payment_method === "apple_pay" ? "Apple Pay" : order.payment_method}
                  </span>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-2">معلومات</p>
                  <Button variant="outline" size="sm" className="gap-2 bg-transparent">
                    <Upload className="w-4 h-4" />
                    تحميل الإيصال
                  </Button>
                </div>
              </div>
            </div>

            {/* Shipping Method */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4">طريقة الشحن</h2>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-gray-100 rounded flex items-center justify-center">
                    <span className="text-xs">📦</span>
                  </div>
                  <span className="text-sm text-gray-900">لا يتطلب شحن</span>
                </div>
                <p className="text-sm text-gray-600">الوقت المتوقع للتسليم</p>
                <p className="text-sm text-gray-900">---</p>
              </div>
            </div>

            {/* Customer Notes */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4">ملاحظات العميل</h2>
              <p className="text-sm text-gray-600">{order.notes || "لا توجد ملاحظات"}</p>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Invoice */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4">الفاتورة</h2>
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">قيمة المنتجات</span>
                  <span className="text-gray-900 font-medium">KWD {order.subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">المجموع الكلي</span>
                  <span className="text-gray-900 font-medium">KWD {order.total.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">المبلغ المدفوع</span>
                  <span className="text-gray-900 font-medium">KWD {order.total.toFixed(2)}</span>
                </div>
              </div>
            </div>

            {/* Customer Info */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4">الفاتورة</h2>
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-600 mb-1">الاسم</p>
                  <p className="text-sm text-gray-900">{order.customer_name}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">البريد الإلكتروني</p>
                  <p className="text-sm text-gray-900">{order.customer_email}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">رقم الهاتف</p>
                  <p className="text-sm text-gray-900">{order.customer_phone}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">الولاية</p>
                  <p className="text-sm text-gray-900">{order.shipping_city || "NA"}</p>
                </div>
                <Button variant="outline" size="sm" className="w-full bg-transparent">
                  عرض التفاصيل
                </Button>
              </div>
            </div>

            {/* Order Activity */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4">تحركات الطلب</h2>
              <p className="text-sm text-gray-600 mb-4">تتبع جميع حركات الطلب</p>
              <div className="space-y-4">
                <div className="flex gap-3">
                  <div className="w-2 h-2 rounded-full bg-green-500 mt-1.5"></div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-900">تم إرسال الفاتورة الرقمية بواسطة: {order.customer_name}</p>
                    <p className="text-xs text-gray-500">
                      {new Date(order.created_at).toLocaleDateString("ar-SA")} -{" "}
                      {new Date(order.created_at).toLocaleTimeString("ar-SA", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                </div>
              </div>
              <Button variant="outline" size="sm" className="w-full mt-4 bg-transparent">
                إضافة ملاحظة
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

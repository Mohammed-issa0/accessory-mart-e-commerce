"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Phone, Mail, MessageCircle, Send, Copy, ChevronRight } from "lucide-react"
import Link from "next/link"

type Customer = {
  id: string
  full_name: string
  email: string
  phone: string
  city: string
  address: string
  total_orders: number
  total_spent: number
  created_at: string
  status: string
}

type Order = {
  id: string
  order_number: string
  total: number
  status: string
  created_at: string
  items: any[]
}

type Props = {
  customer: Customer
  orders: Order[]
}

export default function CustomerDetailsClient({ customer, orders }: Props) {
  const [activeTab, setActiveTab] = useState<"settings" | "favorites" | "saved">("settings")
  const [notificationsEnabled, setNotificationsEnabled] = useState(true)
  const [newsletterEnabled, setNewsletterEnabled] = useState(false)

  const handleDownloadInvoice = async (orderId: string) => {
    const response = await fetch(`/api/orders/${orderId}/invoice`)
    const blob = await response.blob()
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `invoice-${orderId}.pdf`
    document.body.appendChild(a)
    a.click()
    window.URL.revokeObjectURL(url)
    document.body.removeChild(a)
  }

  const getStatusBadge = (status: string) => {
    const statusMap: Record<string, { label: string; className: string }> = {
      new: { label: "معلق", className: "bg-orange-100 text-orange-800" },
      processing: { label: "جاري التجهيز", className: "bg-blue-100 text-blue-800" },
      completed: { label: "مكتمل", className: "bg-green-100 text-green-800" },
      shipping: { label: "قيد التوصيل", className: "bg-blue-100 text-blue-800" },
    }

    const statusInfo = statusMap[status] || { label: status, className: "bg-gray-100 text-gray-800" }
    return <Badge className={statusInfo.className}>{statusInfo.label}</Badge>
  }

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-gray-600">
        <Link href="/admin/customers" className="hover:text-gray-900">
          قائمة العملاء
        </Link>
        <ChevronRight className="w-4 h-4" />
        <span className="text-gray-900">تفاصيل العميل</span>
      </div>

      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">تفاصيل العميل</h1>
        <Button variant="outline">حذف</Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <p className="text-sm text-gray-600 mb-2">الطلبات</p>
          <p className="text-3xl font-bold text-gray-900">{customer.total_orders || 0}</p>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <p className="text-sm text-gray-600 mb-2">إجمالي المشتريات</p>
          <p className="text-3xl font-bold text-gray-900">
            {customer.total_spent || 0}
            <span className="text-sm text-gray-600 mr-1">KWD</span>
          </p>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <p className="text-sm text-gray-600 mb-2">متوسط قيمة الطلب</p>
          <p className="text-3xl font-bold text-gray-900">
            {customer.total_orders > 0 ? ((customer.total_spent || 0) / customer.total_orders).toFixed(2) : 0}
            <span className="text-sm text-gray-600 mr-1">KWD</span>
          </p>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <p className="text-sm text-gray-600 mb-2">نقاط الولاء</p>
          <div className="flex items-center gap-2">
            <p className="text-3xl font-bold text-gray-900">200/100</p>
            <Button size="sm" variant="outline">
              تفعيل
            </Button>
          </div>
        </div>
      </div>

      {/* Customer Info */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold text-gray-900">{customer.full_name}</h2>
            <p className="text-sm text-gray-600">
              تاريخ التسجيل{" "}
              {new Date(customer.created_at).toLocaleDateString("ar-SA", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Contact Info */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-gray-400" />
                <MessageCircle className="w-4 h-4 text-gray-400" />
                <Send className="w-4 h-4 text-gray-400" />
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-900">{customer.phone}</span>
                <Button variant="ghost" size="icon" className="h-6 w-6">
                  <Copy className="w-3 h-3" />
                </Button>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-gray-400" />
                <Send className="w-4 h-4 text-gray-400" />
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-900">{customer.email}</span>
                <Button variant="ghost" size="icon" className="h-6 w-6">
                  <Copy className="w-3 h-3" />
                </Button>
              </div>
            </div>
          </div>

          {/* Personal Details */}
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">المدينة</span>
              <span className="text-sm text-gray-900">{customer.city || "---"}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">الدولة</span>
              <span className="text-sm text-gray-900">السعودية</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">الجنس</span>
              <span className="text-sm text-gray-900">ذكر</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">تاريخ الميلاد</span>
              <span className="text-sm text-gray-900">1999-09-04</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">قناة وصول العميل</span>
              <span className="text-sm text-gray-900">لوحة تحكم المتاجر</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">نوع العميل</span>
              <span className="text-sm text-gray-900">فرد</span>
            </div>
          </div>
        </div>

        <div className="mt-6">
          <Button>تعديل</Button>
        </div>
      </div>

      {/* Orders History */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">سجل الطلبات</h2>

        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-4 py-3 text-right text-xs font-medium text-gray-500">رقم الطلب</th>
              <th className="px-4 py-3 text-right text-xs font-medium text-gray-500">الدفع</th>
              <th className="px-4 py-3 text-right text-xs font-medium text-gray-500">الشحن</th>
              <th className="px-4 py-3 text-right text-xs font-medium text-gray-500">المجموع</th>
              <th className="px-4 py-3 text-right text-xs font-medium text-gray-500">الحالة</th>
              <th className="px-4 py-3 text-right text-xs font-medium text-gray-500">تاريخ الإنشاء</th>
              <th className="px-4 py-3 text-right text-xs font-medium text-gray-500">الإجراءات</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {orders.map((order) => (
              <tr key={order.id} className="hover:bg-gray-50">
                <td className="px-4 py-4 text-sm text-gray-900">{order.order_number}</td>
                <td className="px-4 py-4 text-sm text-gray-600">لا يتطلب شحن</td>
                <td className="px-4 py-4 text-sm text-gray-600">Apple Pay</td>
                <td className="px-4 py-4 text-sm text-gray-900">{order.total} KWD</td>
                <td className="px-4 py-4">{getStatusBadge(order.status)}</td>
                <td className="px-4 py-4 text-sm text-gray-600">
                  {new Date(order.created_at).toLocaleDateString("ar-SA")}
                </td>
                <td className="px-4 py-4">
                  <Button variant="outline" size="sm" onClick={() => handleDownloadInvoice(order.id)} className="gap-2">
                    عرض التفاصيل
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="mt-4">
          <Button variant="outline">تحميل</Button>
        </div>
      </div>

      {/* Settings Section */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center gap-4 mb-6 border-b border-gray-200">
          <button
            onClick={() => setActiveTab("settings")}
            className={`pb-3 px-4 text-sm font-medium ${
              activeTab === "settings" ? "border-b-2 border-black text-black" : "text-gray-600 hover:text-gray-900"
            }`}
          >
            الإعدادات
          </button>
          <button
            onClick={() => setActiveTab("favorites")}
            className={`pb-3 px-4 text-sm font-medium ${
              activeTab === "favorites" ? "border-b-2 border-black text-black" : "text-gray-600 hover:text-gray-900"
            }`}
          >
            قائمة السلبيات
          </button>
          <button
            onClick={() => setActiveTab("saved")}
            className={`pb-3 px-4 text-sm font-medium ${
              activeTab === "saved" ? "border-b-2 border-black text-black" : "text-gray-600 hover:text-gray-900"
            }`}
          >
            المفضلين المحفوظة
          </button>
        </div>

        {activeTab === "settings" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-900">التبليغ عند الاستلام</p>
                <p className="text-sm text-gray-600">تلقي إشعار عند استلام منتج جديد</p>
              </div>
              <Switch checked={notificationsEnabled} onCheckedChange={setNotificationsEnabled} />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-900">الاشتراك في النشرة البريدية</p>
                <p className="text-sm text-gray-600">سيستلم النشرة البريدية</p>
              </div>
              <Switch checked={newsletterEnabled} onCheckedChange={setNewsletterEnabled} />
            </div>

            <Button>حفظ</Button>
          </div>
        )}
      </div>

      {/* Activity Log */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">النقاط</h2>

        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-4 py-3 text-right text-xs font-medium text-gray-500">الطريقة</th>
              <th className="px-4 py-3 text-right text-xs font-medium text-gray-500">رقم الطلب</th>
              <th className="px-4 py-3 text-right text-xs font-medium text-gray-500">المبلغ</th>
              <th className="px-4 py-3 text-right text-xs font-medium text-gray-500">حالة الدفع</th>
              <th className="px-4 py-3 text-right text-xs font-medium text-gray-500">تاريخ الإنشاء</th>
              <th className="px-4 py-3 text-right text-xs font-medium text-gray-500">تاريخ الانتهاء</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td colSpan={6} className="px-4 py-8 text-center text-sm text-gray-600">
                لا توجد بيانات
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Customer Notes */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">ملاحظات العميل</h2>
        <p className="text-sm text-gray-600 mb-4">ملاحظات تساعد فري��ك لفهم وتلبية احتياجات العميل بشكل أفضل</p>

        <div className="space-y-4">
          <Input placeholder="أضف ملاحظة جديدة..." />
          <Button variant="outline">تصفح</Button>
        </div>
      </div>
    </div>
  )
}

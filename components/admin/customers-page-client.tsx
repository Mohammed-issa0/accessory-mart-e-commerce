"use client"

import { useState } from "react"
import { Search, Filter, ArrowUpDown, Phone, Eye, Download, Users } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"

type Customer = {
  id: string
  full_name: string
  email: string
  phone: string
  total_orders: number
  last_order_date: string
  status: string
  created_at: string
}

type Props = {
  customers: Customer[]
}

export default function CustomersPageClient({ customers }: Props) {
  const [filter, setFilter] = useState<"all" | "active" | "blocked">("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null)
  const [customerOrders, setCustomerOrders] = useState<any[]>([])

  // Filter customers
  const filteredCustomers = customers.filter((customer) => {
    const matchesFilter =
      filter === "all" ||
      (filter === "active" && customer.status === "active") ||
      (filter === "blocked" && customer.status === "blocked")

    const matchesSearch =
      customer.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      customer.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      customer.phone?.includes(searchQuery)

    return matchesFilter && matchesSearch
  })

  const handleViewPurchases = async (customer: Customer) => {
    setSelectedCustomer(customer)

    // Fetch customer orders
    const response = await fetch(`/api/customers/${customer.id}/orders`)
    const data = await response.json()
    setCustomerOrders(data.orders || [])
  }

  const handleDownloadInvoice = async (orderId: string) => {
    // Generate and download PDF invoice
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
    const statusMap: Record<string, { label: string; variant: "default" | "secondary" | "destructive" }> = {
      new: { label: "معلق", variant: "secondary" },
      processing: { label: "جاري التجهيز", variant: "default" },
      ready: { label: "جاهز", variant: "default" },
      shipping: { label: "قيد الشحن", variant: "default" },
      completed: { label: "تم التوصيل", variant: "default" },
      cancelled: { label: "ملغي", variant: "destructive" },
    }

    const statusInfo = statusMap[status] || { label: status, variant: "secondary" as const }
    return (
      <Badge variant={statusInfo.variant} className="text-xs">
        {statusInfo.label}
      </Badge>
    )
  }

  const hasCustomers = customers.length > 0

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">قائمة عملائك</h1>
          <p className="text-sm text-gray-600">إدارة عملاء متجرك</p>
        </div>
        <div className="flex items-center gap-2">
          <Button>إضافة</Button>
          <Button variant="outline" size="icon">
            <Filter className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {!hasCustomers ? (
        <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center">
              <Users className="w-8 h-8 text-gray-400" />
            </div>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">لا يوجد عملاء بعد</h3>
          <p className="text-sm text-gray-600 mb-6">عندما يقوم العملاء بإنشاء حسابات أو تقديم طلبات، سيظهرون هنا</p>
          <Button>إضافة عميل جديد</Button>
        </div>
      ) : (
        <>
          {/* Filter Tabs */}
          <div className="flex items-center gap-2">
            <Button
              variant={filter === "all" ? "default" : "outline"}
              size="sm"
              onClick={() => setFilter("all")}
              className={filter === "all" ? "bg-black text-white" : ""}
            >
              الكل
            </Button>
            <Button
              variant={filter === "active" ? "default" : "outline"}
              size="sm"
              onClick={() => setFilter("active")}
              className={filter === "active" ? "bg-black text-white" : ""}
            >
              مفعل
            </Button>
            <Button
              variant={filter === "blocked" ? "default" : "outline"}
              size="sm"
              onClick={() => setFilter("blocked")}
              className={filter === "blocked" ? "bg-black text-white" : ""}
            >
              محظور
            </Button>
          </div>

          {/* Search and Sort */}
          <div className="flex items-center gap-4">
            <Button variant="outline" size="icon">
              <Filter className="w-4 h-4" />
            </Button>
            <Button variant="outline" size="icon">
              <ArrowUpDown className="w-4 h-4" />
            </Button>
            <div className="flex-1 relative">
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="بحث..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pr-10"
              />
            </div>
          </div>

          {/* Customers Table */}
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500">الاسم</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500">البريد الإلكتروني</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500">رقم الهاتف</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500">عدد الطلبات</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500">آخر عملية شراء</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500">الإجراءات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredCustomers.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-8 text-center text-sm text-gray-500">
                      لا توجد نتائج مطابقة للبحث
                    </td>
                  </tr>
                ) : (
                  filteredCustomers.map((customer) => (
                    <tr key={customer.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 text-sm text-gray-900">{customer.full_name}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">{customer.email}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">{customer.phone}</td>
                      <td className="px-6 py-4 text-sm text-gray-900">{customer.total_orders || 0}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {customer.last_order_date
                          ? new Date(customer.last_order_date).toLocaleDateString("ar-SA", {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            })
                          : "-"}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleViewPurchases(customer)}
                            className="gap-2"
                          >
                            <Eye className="w-4 h-4" />
                            عرض المشتريات
                          </Button>
                          <Link href={`/admin/customers/${customer.id}`}>
                            <Button variant="outline" size="sm" className="gap-2 bg-transparent">
                              <Phone className="w-4 h-4" />
                              تواصل
                            </Button>
                          </Link>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Customer Purchases Section */}
          {selectedCustomer && customerOrders.length > 0 && (
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">مشتريات العميل – {selectedCustomer.full_name}</h2>

              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500">رقم الطلب</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500">اسم المنتج</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500">السعر</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500">الكمية</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500">تاريخ الشراء</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500">الحالة</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {customerOrders.map((order: any) => (
                    <tr key={order.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 text-sm text-gray-900">{order.order_number}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          {order.items?.[0]?.product_image && (
                            <img
                              src={order.items[0].product_image || "/placeholder.svg"}
                              alt={order.items[0].product_name}
                              className="w-10 h-10 rounded object-cover"
                            />
                          )}
                          <span className="text-sm text-gray-900">{order.items?.[0]?.product_name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">{order.total} ريال</td>
                      <td className="px-6 py-4 text-sm text-gray-900">{order.items?.length || 0}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {new Date(order.created_at).toLocaleDateString("ar-SA", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </td>
                      <td className="px-6 py-4">{getStatusBadge(order.status)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div className="mt-6 flex items-center justify-between">
                <p className="text-sm text-gray-600">إجمالي المشتريات: {customerOrders.length} منتجات</p>
                <p className="text-lg font-bold text-gray-900">
                  المجموع الكلي:{" "}
                  {customerOrders.reduce((sum, order) => sum + Number.parseFloat(order.total || 0), 0).toFixed(2)} ريال
                </p>
              </div>

              <div className="mt-4 flex justify-center">
                <Button
                  onClick={() => {
                    if (customerOrders[0]?.id) {
                      handleDownloadInvoice(customerOrders[0].id)
                    }
                  }}
                  className="gap-2 bg-black text-white hover:bg-gray-800"
                >
                  <Download className="w-4 h-4" />
                  تحميل الفاتورة PDF
                </Button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  )
}

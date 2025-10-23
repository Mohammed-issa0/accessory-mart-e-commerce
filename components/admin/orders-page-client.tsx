"use client"

import type React from "react"

import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Search, Filter, ArrowUpDown, ChevronDown, ChevronRight, Download, MoreVertical } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import Link from "next/link"

interface Order {
  id: string
  order_number: string
  customer_name: string
  customer_email: string
  customer_phone: string
  payment_method: string
  shipping_address: string
  total: number
  status: string
  created_at: string
  order_items: Array<{
    id: string
    product_name: string
    product_image: string
    quantity: number
    price: number
    total: number
  }>
}

interface OrdersPageClientProps {
  orders: Order[]
  statusCounts: {
    all: number
    new: number
    processing: number
    ready: number
    shipping: number
    completed: number
    cancelled: number
  }
}

export default function OrdersPageClient({ orders, statusCounts }: OrdersPageClientProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const currentStatus = searchParams.get("status") || "all"
  const [selectedOrders, setSelectedOrders] = useState<string[]>([])
  const [expandedOrders, setExpandedOrders] = useState<string[]>([])
  const [searchQuery, setSearchQuery] = useState("")

  const statusFilters = [
    { key: "all", label: "الكل", count: statusCounts.all },
    { key: "new", label: "جديد", count: statusCounts.new },
    { key: "processing", label: "جاري التجهيز", count: statusCounts.processing },
    { key: "ready", label: "جاهز", count: statusCounts.ready },
    { key: "shipping", label: "جاري التوصيل", count: statusCounts.shipping },
    { key: "completed", label: "مكتمل", count: statusCounts.completed },
    { key: "cancelled", label: "ملغي", count: statusCounts.cancelled },
  ]

  const getStatusBadge = (status: string) => {
    const statusMap: Record<string, { label: string; className: string }> = {
      new: { label: "معلق", className: "bg-orange-500 text-white" },
      processing: { label: "جاري التجهيز", className: "bg-yellow-500 text-white" },
      ready: { label: "جاهز", className: "bg-purple-500 text-white" },
      shipping: { label: "قيد التوصيل", className: "bg-blue-500 text-white" },
      completed: { label: "مكتمل", className: "bg-green-500 text-white" },
      cancelled: { label: "ملغي", className: "bg-red-500 text-white" },
      refund_pending: { label: "قيد الاسترجاع", className: "bg-pink-500 text-white" },
      refunded: { label: "مسترجع", className: "bg-gray-500 text-white" },
    }
    return statusMap[status] || { label: status, className: "bg-gray-500 text-white" }
  }

  const handleStatusFilter = (status: string) => {
    const params = new URLSearchParams(searchParams.toString())
    if (status === "all") {
      params.delete("status")
    } else {
      params.set("status", status)
    }
    router.push(`/admin/orders?${params.toString()}`)
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    const params = new URLSearchParams(searchParams.toString())
    if (searchQuery) {
      params.set("search", searchQuery)
    } else {
      params.delete("search")
    }
    router.push(`/admin/orders?${params.toString()}`)
  }

  const toggleOrderSelection = (orderId: string) => {
    setSelectedOrders((prev) => (prev.includes(orderId) ? prev.filter((id) => id !== orderId) : [...prev, orderId]))
  }

  const toggleAllOrders = () => {
    if (selectedOrders.length === orders.length) {
      setSelectedOrders([])
    } else {
      setSelectedOrders(orders.map((o) => o.id))
    }
  }

  const toggleOrderExpand = (orderId: string) => {
    setExpandedOrders((prev) => (prev.includes(orderId) ? prev.filter((id) => id !== orderId) : [...prev, orderId]))
  }

  const exportOrders = () => {
    // Create CSV content
    const headers = ["رقم الطلب", "العميل", "الدفع", "الشحن", "المجموع", "الحالة", "تاريخ الإنشاء"]
    const rows = orders.map((order) => [
      order.order_number,
      order.customer_name,
      order.payment_method,
      "لا يتطلب شحن",
      `${order.total} KWD`,
      getStatusBadge(order.status).label,
      new Date(order.created_at).toLocaleDateString("ar-SA"),
    ])

    const csvContent = [headers, ...rows].map((row) => row.join(",")).join("\n")
    const blob = new Blob(["\ufeff" + csvContent], { type: "text/csv;charset=utf-8;" })
    const link = document.createElement("a")
    link.href = URL.createObjectURL(blob)
    link.download = `orders-${new Date().toISOString().split("T")[0]}.csv`
    link.click()
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">قائمة الطلبات</h1>
            <p className="text-sm text-gray-600">جميع طلبات متجرك هنا</p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={exportOrders} className="gap-2 bg-transparent">
              <Download className="w-4 h-4" />
              تصدير الطلبات
            </Button>
            <Button className="gap-2 bg-black hover:bg-gray-800">إضافة</Button>
            <Button variant="outline" size="icon">
              <MoreVertical className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Status Filters */}
        <div className="flex items-center gap-2 flex-wrap">
          {statusFilters.map((filter) => (
            <Button
              key={filter.key}
              variant={currentStatus === filter.key ? "default" : "outline"}
              size="sm"
              onClick={() => handleStatusFilter(filter.key)}
              className={
                currentStatus === filter.key ? "bg-black hover:bg-gray-800 text-white" : "bg-white hover:bg-gray-50"
              }
            >
              {filter.label}
              <span
                className={`mr-2 px-2 py-0.5 rounded-full text-xs ${
                  currentStatus === filter.key ? "bg-white text-black" : "bg-black text-white"
                }`}
              >
                {filter.count}
              </span>
            </Button>
          ))}
        </div>
      </div>

      {/* Search and Actions */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon">
            <Filter className="w-4 h-4" />
          </Button>
          <Button variant="outline" size="icon">
            <ArrowUpDown className="w-4 h-4" />
          </Button>
          <form onSubmit={handleSearch} className="flex-1 relative">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              placeholder="بحث..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pr-10"
            />
          </form>
          {selectedOrders.length > 0 && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="gap-2 bg-transparent">
                  الإجراءات {selectedOrders.length}
                  <ChevronDown className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem>تحديث الحالة</DropdownMenuItem>
                <DropdownMenuItem>تصدير المحدد</DropdownMenuItem>
                <DropdownMenuItem className="text-red-600">حذف</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="w-12 px-6 py-3">
                <Checkbox checked={selectedOrders.length === orders.length} onCheckedChange={toggleAllOrders} />
              </th>
              <th className="text-right px-4 py-3 text-sm font-medium text-gray-700">رقم الطلب</th>
              <th className="text-right px-4 py-3 text-sm font-medium text-gray-700">العميل</th>
              <th className="text-right px-4 py-3 text-sm font-medium text-gray-700">الدفع</th>
              <th className="text-right px-4 py-3 text-sm font-medium text-gray-700">الشحن</th>
              <th className="text-right px-4 py-3 text-sm font-medium text-gray-700">المجموع</th>
              <th className="text-right px-4 py-3 text-sm font-medium text-gray-700">الحالة</th>
              <th className="text-right px-4 py-3 text-sm font-medium text-gray-700">تاريخ الإنشاء</th>
              <th className="w-12 px-4 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => {
              const status = getStatusBadge(order.status)
              const isExpanded = expandedOrders.includes(order.id)
              return (
                <tr key={order.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <Checkbox
                      checked={selectedOrders.includes(order.id)}
                      onCheckedChange={() => toggleOrderSelection(order.id)}
                    />
                  </td>
                  <td className="px-4 py-4">
                    <Link
                      href={`/admin/orders/${order.id}`}
                      className="text-sm font-medium text-gray-900 hover:text-blue-600"
                    >
                      #{order.order_number}
                    </Link>
                  </td>
                  <td className="px-4 py-4">
                    <div className="text-sm text-gray-900">{order.customer_name}</div>
                    <div className="text-xs text-gray-500">{order.customer_phone}</div>
                  </td>
                  <td className="px-4 py-4">
                    <div className="text-sm text-gray-900">
                      {order.payment_method === "apple_pay" ? "Apple Pay" : order.payment_method}
                    </div>
                    <div className="text-xs text-gray-500">مدفوع</div>
                  </td>
                  <td className="px-4 py-4">
                    <div className="text-sm text-gray-900">لا يتطلب</div>
                    <div className="text-xs text-gray-500">شحن</div>
                  </td>
                  <td className="px-4 py-4">
                    <div className="text-sm font-medium text-gray-900">KWD {order.total.toFixed(2)}</div>
                  </td>
                  <td className="px-4 py-4">
                    <span className={`inline-flex px-3 py-1 rounded-md text-xs font-medium ${status.className}`}>
                      {status.label}
                    </span>
                  </td>
                  <td className="px-4 py-4">
                    <div className="text-sm text-gray-900">
                      {new Date(order.created_at).toLocaleDateString("ar-SA", {
                        year: "numeric",
                        month: "2-digit",
                        day: "2-digit",
                      })}
                    </div>
                    <div className="text-xs text-gray-500">
                      {new Date(order.created_at).toLocaleTimeString("ar-SA", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <Button variant="ghost" size="icon" onClick={() => toggleOrderExpand(order.id)} className="w-8 h-8">
                      {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                    </Button>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>

        {/* Pagination */}
        <div className="flex items-center justify-center gap-2 py-6 border-t border-gray-200">
          <Button variant="outline" size="icon" disabled>
            «
          </Button>
          <Button variant="outline" size="icon" disabled>
            ‹
          </Button>
          {[1, 2, 3, 4, 5].map((page) => (
            <Button key={page} variant={page === 1 ? "default" : "outline"} size="icon" className="w-10 h-10">
              {page}
            </Button>
          ))}
          <Button variant="outline" size="icon">
            ›
          </Button>
          <Button variant="outline" size="icon">
            »
          </Button>
        </div>
      </div>

      {/* Footer */}
      <div className="text-center py-8">
        <p className="text-sm text-gray-600">Powered By Syber</p>
      </div>
    </div>
  )
}

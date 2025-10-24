"use client"

import { useState } from "react"
import { Search, Filter, ArrowUpDown, Eye, Download, Users, Edit, Save, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"

type Customer = {
  id: string
  full_name: string
  email: string
  phone: string
  avatar_url?: string
  total_orders: number
  created_at: string
  updated_at: string
  is_admin: boolean
}

type Props = {
  customers: Customer[]
}

export default function CustomersPageClient({ customers }: Props) {
  const [filter, setFilter] = useState<"all" | "active" | "blocked">("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null)
  const [customerOrders, setCustomerOrders] = useState<any[]>([])
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null)
  const [editForm, setEditForm] = useState({
    full_name: "",
    email: "",
    phone: "",
    avatar_url: "",
    is_admin: false,
  })
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

  const filteredCustomers = customers.filter((customer) => {
    const matchesSearch =
      customer.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      customer.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      customer.phone?.includes(searchQuery)

    return matchesSearch
  })

  const handleViewPurchases = async (customer: Customer) => {
    setSelectedCustomer(customer)

    // Fetch customer orders
    const response = await fetch(`/api/customers/${customer.id}/orders`)
    const data = await response.json()
    setCustomerOrders(data.orders || [])
  }

  const handleEditCustomer = (customer: Customer) => {
    setEditingCustomer(customer)
    setEditForm({
      full_name: customer.full_name || "",
      email: customer.email || "",
      phone: customer.phone || "",
      avatar_url: customer.avatar_url || "",
      is_admin: customer.is_admin || false,
    })
    setIsEditDialogOpen(true)
  }

  const handleSaveCustomer = async () => {
    if (!editingCustomer) return

    setIsSaving(true)
    try {
      const response = await fetch(`/api/customers/${editingCustomer.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editForm),
      })

      if (response.ok) {
        // Refresh the page to show updated data
        window.location.reload()
      } else {
        alert("فشل في تحديث بيانات العميل")
      }
    } catch (error) {
      console.error("Error updating customer:", error)
      alert("حدث خطأ أثناء تحديث البيانات")
    } finally {
      setIsSaving(false)
    }
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
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500">الاسم الكامل</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500">البريد الإلكتروني</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500">رقم الهاتف</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500">الصورة الشخصية</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500">تاريخ الإنشاء</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500">آخر تحديث</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500">الصلاحية</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500">الإجراءات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredCustomers.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="px-6 py-8 text-center text-sm text-gray-500">
                      لا توجد نتائج مطابقة للبحث
                    </td>
                  </tr>
                ) : (
                  filteredCustomers.map((customer) => (
                    <tr key={customer.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 text-sm text-gray-900">{customer.full_name || "-"}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">{customer.email}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">{customer.phone || "-"}</td>
                      <td className="px-6 py-4">
                        {customer.avatar_url ? (
                          <img
                            src={customer.avatar_url || "/placeholder.svg"}
                            alt={customer.full_name}
                            className="w-10 h-10 rounded-full object-cover"
                          />
                        ) : (
                          <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 text-xs">
                            {customer.full_name?.charAt(0) || "؟"}
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {customer.created_at
                          ? new Date(customer.created_at).toLocaleDateString("ar-SA", {
                              year: "numeric",
                              month: "2-digit",
                              day: "2-digit",
                            })
                          : "-"}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {customer.updated_at
                          ? new Date(customer.updated_at).toLocaleDateString("ar-SA", {
                              year: "numeric",
                              month: "2-digit",
                              day: "2-digit",
                            })
                          : "-"}
                      </td>
                      <td className="px-6 py-4">
                        <Badge variant={customer.is_admin ? "default" : "secondary"} className="text-xs">
                          {customer.is_admin ? "مسؤول" : "عميل"}
                        </Badge>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEditCustomer(customer)}
                            className="gap-2"
                          >
                            <Edit className="w-4 h-4" />
                            تعديل
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleViewPurchases(customer)}
                            className="gap-2"
                          >
                            <Eye className="w-4 h-4" />
                            المشتريات
                          </Button>
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

      {/* Edit Customer Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="text-right">تعديل بيانات العميل</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="full_name" className="text-right block">
                الاسم الكامل
              </Label>
              <Input
                id="full_name"
                value={editForm.full_name}
                onChange={(e) => setEditForm({ ...editForm, full_name: e.target.value })}
                className="text-right"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email" className="text-right block">
                البريد الإلكتروني
              </Label>
              <Input
                id="email"
                type="email"
                value={editForm.email}
                onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                className="text-right"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone" className="text-right block">
                رقم الهاتف
              </Label>
              <Input
                id="phone"
                value={editForm.phone}
                onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                className="text-right"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="avatar_url" className="text-right block">
                رابط الصورة الشخصية
              </Label>
              <Input
                id="avatar_url"
                value={editForm.avatar_url}
                onChange={(e) => setEditForm({ ...editForm, avatar_url: e.target.value })}
                className="text-right"
                placeholder="https://..."
              />
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="is_admin"
                checked={editForm.is_admin}
                onChange={(e) => setEditForm({ ...editForm, is_admin: e.target.checked })}
                className="w-4 h-4"
              />
              <Label htmlFor="is_admin" className="cursor-pointer">
                منح صلاحيات المسؤول
              </Label>
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)} disabled={isSaving}>
              <X className="w-4 h-4 ml-2" />
              إلغاء
            </Button>
            <Button onClick={handleSaveCustomer} disabled={isSaving}>
              <Save className="w-4 h-4 ml-2" />
              {isSaving ? "جاري الحفظ..." : "حفظ التغييرات"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

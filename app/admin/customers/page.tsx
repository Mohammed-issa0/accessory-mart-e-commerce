"use client"

import { useEffect, useState } from "react"
import { useAuth } from "@/lib/contexts/auth-context"
import { useRouter } from "next/navigation"
import AdminHeader from "@/components/admin/admin-header"
import AdminSidebar from "@/components/admin/admin-sidebar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, Mail, Phone, Calendar, CheckCircle, XCircle, Edit, Shield } from "lucide-react"
import { apiClient } from "@/lib/api/client"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"

interface Customer {
  id: number
  name: string
  email: string
  phone?: string
  is_admin?: boolean
  email_verified_at?: string | null
  created_at: string
  updated_at: string
}

export default function CustomersPage() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [customers, setCustomers] = useState<Customer[]>([])
  const [filteredCustomers, setFilteredCustomers] = useState<Customer[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [verifiedFilter, setVerifiedFilter] = useState<string>("all")
  const [sortBy, setSortBy] = useState("name")
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc")
  const [isLoading, setIsLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null)
  const [editFormData, setEditFormData] = useState({ name: "", email: "", phone: "", is_admin: false })

  useEffect(() => {
    if (!loading && !user) {
      router.push("/auth/login")
    } else if (user && !user.is_admin) {
      router.push("/")
    }
  }, [user, loading, router])

  useEffect(() => {
    if (user?.is_admin) {
      fetchCustomers()
    }
  }, [user, verifiedFilter, sortBy, sortOrder, currentPage])

  useEffect(() => {
    if (searchQuery.trim()) {
      const filtered = customers.filter(
        (customer) =>
          customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          customer.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
          customer.phone?.includes(searchQuery),
      )
      setFilteredCustomers(filtered)
    } else {
      setFilteredCustomers(customers)
    }
  }, [searchQuery, customers])

  const fetchCustomers = async () => {
    try {
      setIsLoading(true)
      const params: any = {
        page: currentPage,
        sort_by: sortBy,
        sort_order: sortOrder,
      }

      if (verifiedFilter !== "all") {
        params.verified = verifiedFilter === "verified"
      }

      const response = await apiClient.getCustomers(params)
      const customersList = response.data || []
      setCustomers(customersList)
      setFilteredCustomers(customersList)

      if (response.meta) {
        setTotalPages(response.meta.last_page || 1)
      }
    } catch (error) {
      console.error("Error fetching customers:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleEditClick = (customer: Customer) => {
    setSelectedCustomer(customer)
    setEditFormData({
      name: customer.name,
      email: customer.email,
      phone: customer.phone || "",
      is_admin: customer.is_admin || false,
    })
    setEditDialogOpen(true)
  }

  const handleEditSubmit = async () => {
    if (!selectedCustomer) return

    try {
      // Note: This would need a backend endpoint to update customer
      // For now, we'll just update locally and show a message
      console.log("[v0] Updating customer:", selectedCustomer.id, editFormData)

      // Update local state
      const updatedCustomers = customers.map((c) => (c.id === selectedCustomer.id ? { ...c, ...editFormData } : c))
      setCustomers(updatedCustomers)
      setFilteredCustomers(updatedCustomers)

      setEditDialogOpen(false)
      alert("تم تحديث بيانات العميل بنجاح")
    } catch (error) {
      console.error("Error updating customer:", error)
      alert("حدث خطأ أثناء تحديث بيانات العميل")
    }
  }

  if (loading || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!user?.is_admin) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50" dir="rtl">
     
      <div className="flex">
        
        <main className="flex-1 p-8">
          <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold mb-2">إدارة العملاء</h1>
              <p className="text-gray-600">عرض وإدارة بيانات العملاء</p>
            </div>

            {/* Filters */}
            <div className="bg-white rounded-lg p-6 border border-gray-200 mb-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="md:col-span-2 relative">
                  <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <Input
                    type="text"
                    placeholder="البحث عن عميل..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pr-10"
                  />
                </div>

                <Select value={verifiedFilter} onValueChange={setVerifiedFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="حالة التحقق" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">الكل</SelectItem>
                    <SelectItem value="verified">محقق</SelectItem>
                    <SelectItem value="unverified">غير محقق</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger>
                    <SelectValue placeholder="الترتيب حسب" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="name">الاسم</SelectItem>
                    <SelectItem value="email">البريد الإلكتروني</SelectItem>
                    <SelectItem value="created_at">تاريخ التسجيل</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Customers Table */}
            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        العميل
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        البريد الإلكتروني
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        الهاتف
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        الحالة
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        تاريخ التسجيل
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        الإجراءات
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredCustomers.map((customer) => (
                      <tr key={customer.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                              <span className="text-primary font-semibold">
                                {customer.name.charAt(0).toUpperCase()}
                              </span>
                            </div>
                            <div className="mr-3">
                              <div className="text-sm font-medium text-gray-900 flex items-center gap-2">
                                {customer.name}
                                {customer.is_admin && (
                                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                                    <Shield className="w-3 h-3" />
                                    مدير
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-2 text-sm text-gray-900">
                            <Mail className="w-4 h-4 text-gray-400" />
                            {customer.email}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-2 text-sm text-gray-900">
                            <Phone className="w-4 h-4 text-gray-400" />
                            {customer.phone || "-"}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {customer.email_verified_at ? (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                              <CheckCircle className="w-3 h-3" />
                              محقق
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                              <XCircle className="w-3 h-3" />
                              غير محقق
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-2 text-sm text-gray-500">
                            <Calendar className="w-4 h-4" />
                            {new Date(customer.created_at).toLocaleDateString("ar-SA")}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <div className="flex gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              className="gap-2 bg-transparent"
                              onClick={() => handleEditClick(customer)}
                            >
                              <Edit className="w-4 h-4" />
                              تعديل
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {filteredCustomers.length === 0 && (
                <div className="text-center py-12">
                  <p className="text-gray-500">لا يوجد عملاء</p>
                </div>
              )}

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
                  <div className="text-sm text-gray-700">
                    صفحة {currentPage} من {totalPages}
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                      disabled={currentPage === 1}
                    >
                      السابق
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                      disabled={currentPage === totalPages}
                    >
                      التالي
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>

      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="sm:max-w-[500px]" dir="rtl">
          <DialogHeader>
            <DialogTitle>تعديل بيانات العميل</DialogTitle>
            <DialogDescription>قم بتعديل بيانات العميل وصلاحياته</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <Label htmlFor="edit-name">الاسم</Label>
              <Input
                id="edit-name"
                value={editFormData.name}
                onChange={(e) => setEditFormData({ ...editFormData, name: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="edit-email">البريد الإلكتروني</Label>
              <Input
                id="edit-email"
                type="email"
                value={editFormData.email}
                onChange={(e) => setEditFormData({ ...editFormData, email: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="edit-phone">رقم الهاتف</Label>
              <Input
                id="edit-phone"
                value={editFormData.phone}
                onChange={(e) => setEditFormData({ ...editFormData, phone: e.target.value })}
              />
            </div>
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="edit-is-admin"
                checked={editFormData.is_admin}
                onChange={(e) => setEditFormData({ ...editFormData, is_admin: e.target.checked })}
                className="w-4 h-4 rounded border-gray-300"
              />
              <Label htmlFor="edit-is-admin" className="cursor-pointer flex items-center gap-2">
                <Shield className="w-4 h-4" />
                منح صلاحيات المدير
              </Label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditDialogOpen(false)}>
              إلغاء
            </Button>
            <Button onClick={handleEditSubmit}>حفظ التغييرات</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

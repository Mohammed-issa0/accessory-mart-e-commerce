"use client"

import { useState } from "react"
import { Eye, MessageCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import CustomerDetailsModal from "./customer-details-modal"

interface Customer {
  id: string
  full_name: string
  email: string
  phone: string
  total_orders: number
  last_order_date: string | null
  status: string
}

interface CustomersTableProps {
  customers: Customer[]
}

export default function CustomersTable({ customers }: CustomersTableProps) {
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null)

  return (
    <>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="text-right py-3 px-4 text-sm font-medium text-gray-600">الاسم</th>
              <th className="text-right py-3 px-4 text-sm font-medium text-gray-600">البريد الإلكتروني</th>
              <th className="text-right py-3 px-4 text-sm font-medium text-gray-600">رقم الهاتف</th>
              <th className="text-right py-3 px-4 text-sm font-medium text-gray-600">عدد الطلبات</th>
              <th className="text-right py-3 px-4 text-sm font-medium text-gray-600">آخر عملية شراء</th>
              <th className="text-right py-3 px-4 text-sm font-medium text-gray-600">الإجراءات</th>
            </tr>
          </thead>
          <tbody>
            {customers.slice(0, 6).map((customer) => (
              <tr key={customer.id} className="border-b border-gray-100 hover:bg-gray-50">
                <td className="py-3 px-4 text-sm text-gray-900">{customer.full_name}</td>
                <td className="py-3 px-4 text-sm text-gray-600">{customer.email}</td>
                <td className="py-3 px-4 text-sm text-gray-600">{customer.phone || "-"}</td>
                <td className="py-3 px-4 text-sm text-gray-900">{customer.total_orders}</td>
                <td className="py-3 px-4 text-sm text-gray-600">
                  {customer.last_order_date ? new Date(customer.last_order_date).toLocaleDateString("ar-SA") : "-"}
                </td>
                <td className="py-3 px-4">
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="gap-2 bg-transparent"
                      onClick={() => setSelectedCustomer(customer)}
                    >
                      <Eye className="w-4 h-4" />
                      عرض المشتريات
                    </Button>
                    <Button variant="outline" size="sm" className="gap-2 bg-transparent">
                      <MessageCircle className="w-4 h-4" />
                      تواصل
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selectedCustomer && (
        <CustomerDetailsModal customer={selectedCustomer} onClose={() => setSelectedCustomer(null)} />
      )}
    </>
  )
}

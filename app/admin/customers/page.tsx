"use client"

import { Users } from "lucide-react"

export default function CustomersPage() {
  return (
    <div className="max-w-6xl mx-auto">
      <div className="bg-white rounded-lg p-6 border border-gray-200 mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">إدارة العملاء</h1>
        <p className="text-gray-600">عرض وإدارة بيانات العملاء</p>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-8 text-center">
        <Users className="w-16 h-16 text-blue-500 mx-auto mb-4" />
        <h2 className="text-xl font-bold text-gray-900 mb-2">قسم العملاء قيد التطوير</h2>
        <p className="text-gray-600 mb-4">لعرض وإدارة العملاء، يجب توفير API endpoints التالية من الباك اند:</p>
        <ul className="text-right text-sm text-gray-700 space-y-2 max-w-md mx-auto">
          <li className="flex items-start gap-2">
            <span className="text-blue-500">•</span>
            <span>
              <code className="bg-gray-100 px-2 py-1 rounded">GET /api/customers</code> - لجلب قائمة العملاء
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-blue-500">•</span>
            <span>
              <code className="bg-gray-100 px-2 py-1 rounded">GET /api/customers/:id</code> - لجلب تفاصيل عميل معين
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-blue-500">•</span>
            <span>
              <code className="bg-gray-100 px-2 py-1 rounded">GET /api/customers/:id/orders</code> - لجلب طلبات العميل
            </span>
          </li>
        </ul>
      </div>
    </div>
  )
}

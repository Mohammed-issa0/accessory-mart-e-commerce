"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/lib/contexts/auth-context"
import { AlertCircle } from "lucide-react"

export default function OrdersPage() {
  const { user, loading } = useAuth()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  // Wait for auth to load
  if (loading || !mounted) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4 text-gray-600">جاري التحميل...</p>
        </div>
      </div>
    )
  }

  // Redirect if not logged in or not admin
  if (!user || !user.is_admin) {
    if (typeof window !== "undefined") {
      window.location.href = "/admin/login"
    }
    return null
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="bg-white rounded-lg p-6 border border-gray-200 mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">إدارة الطلبات</h1>
        <p className="text-gray-600">عرض وإدارة جميع الطلبات</p>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-8 text-center">
        <AlertCircle className="w-16 h-16 text-blue-500 mx-auto mb-4" />
        <h2 className="text-xl font-bold text-gray-900 mb-2">قسم الطلبات قيد التطوير</h2>
        <p className="text-gray-600 mb-4">لعرض وإدارة الطلبات، يجب توفير API endpoints التالية من الباك اند:</p>
        <ul className="text-right text-sm text-gray-700 space-y-2 max-w-md mx-auto">
          <li className="flex items-start gap-2">
            <span className="text-blue-500">•</span>
            <span>
              <code className="bg-gray-100 px-2 py-1 rounded">GET /api/orders</code> - لجلب قائمة الطلبات
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-blue-500">•</span>
            <span>
              <code className="bg-gray-100 px-2 py-1 rounded">GET /api/orders/:id</code> - لجلب تفاصيل طلب معين
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-blue-500">•</span>
            <span>
              <code className="bg-gray-100 px-2 py-1 rounded">PUT /api/orders/:id/status</code> - لتحديث حالة الطلب
            </span>
          </li>
        </ul>
      </div>
    </div>
  )
}

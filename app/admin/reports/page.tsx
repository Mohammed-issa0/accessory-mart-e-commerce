"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/lib/contexts/auth-context"
import { AlertCircle, Calendar } from "lucide-react"

export default function ReportsPage() {
  const { user, loading } = useAuth()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

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

  if (!user || !user.is_admin) {
    if (typeof window !== "undefined") {
      window.location.href = "/admin/login"
    }
    return null
  }

  const today = new Date()

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">التقارير والإحصائيات</h1>
          <p className="text-gray-600 mt-1">تحليل شامل لأداء المتجر</p>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Calendar className="w-4 h-4" />
          <span>{today.toLocaleDateString("ar-SA", { month: "long", year: "numeric" })}</span>
        </div>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-8 text-center">
        <AlertCircle className="w-16 h-16 text-blue-500 mx-auto mb-4" />
        <h2 className="text-xl font-bold text-gray-900 mb-2">قسم التقارير قيد التطوير</h2>
        <p className="text-gray-600 mb-4">لعرض التقارير والإحصائيات، يجب توفير API endpoints التالية من الباك اند:</p>
        <ul className="text-right text-sm text-gray-700 space-y-2 max-w-md mx-auto">
          <li className="flex items-start gap-2">
            <span className="text-blue-500">•</span>
            <span>
              <code className="bg-gray-100 px-2 py-1 rounded">GET /api/orders/stats</code> - لجلب إحصائيات الطلبات
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-blue-500">•</span>
            <span>
              <code className="bg-gray-100 px-2 py-1 rounded">GET /api/revenue/monthly</code> - لجلب الإيرادات الشهرية
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-blue-500">•</span>
            <span>
              <code className="bg-gray-100 px-2 py-1 rounded">GET /api/customers/count</code> - لجلب عدد العملاء
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-blue-500">•</span>
            <span>
              <code className="bg-gray-100 px-2 py-1 rounded">GET /api/products/stats</code> - لجلب إحصائيات المنتجات
            </span>
          </li>
        </ul>
      </div>
    </div>
  )
}

"use client"

import { useEffect, useState } from "react"
import { useAuth } from "@/lib/contexts/auth-context"
import { TrendingUp, Package, ShoppingCart, Users } from "lucide-react"
import DashboardStats from "@/components/admin/dashboard-stats"
import SuccessMetrics from "@/components/admin/success-metrics"
import VisitorsChart from "@/components/admin/visitors-chart"
import LatestOrders from "@/components/admin/latest-orders"
import TopProducts from "@/components/admin/top-products"
import SalesByCategory from "@/components/admin/sales-by-category"

export default function AdminDashboardPage() {
  const { user } = useAuth()
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalOrders: 0,
    totalCustomers: 0,
    totalRevenue: 0,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchStats() {
      try {
        const productsRes = await fetch("/api/products")
        const productsData = await productsRes.json()
        const totalProducts = productsData.data?.length || 0

        setStats({
          totalProducts,
          totalOrders: 0, // Will be connected when API endpoint is available
          totalCustomers: 0, // Will be connected when API endpoint is available
          totalRevenue: 0, // Will be connected when API endpoint is available
        })
      } catch (error) {
        console.error(" Error fetching admin stats:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p className="text-gray-600">جاري التحميل...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-white rounded-lg p-6 border border-gray-200">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">مرحباً بك {user?.name || "في لوحة التحكم"} 👋</h1>
        <p className="text-gray-600">إليك ملخص أداء متجرك اليوم</p>
      </div>

      {/* Success Metrics */}
      <SuccessMetrics />

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <DashboardStats
          title="الأرباح"
          value={`${stats.totalRevenue.toLocaleString("ar-SA")} ريال`}
          subtitle="عرض التفاصيل"
          icon={TrendingUp}
          trend="up"
        />
        <DashboardStats
          title="الطلبات"
          value={`${stats.totalOrders} طلب`}
          subtitle="عرض التفاصيل"
          icon={ShoppingCart}
          trend="up"
        />
        <DashboardStats
          title="العملاء"
          value={`${stats.totalCustomers} عميل`}
          subtitle="عرض التفاصيل"
          icon={Users}
          trend="neutral"
        />
        <DashboardStats
          title="المنتجات"
          value={`${stats.totalProducts} منتج`}
          subtitle="عرض التفاصيل"
          icon={Package}
          trend="neutral"
        />
      </div>

      {/* Visitors Chart */}
      <VisitorsChart />

      {/* Latest Orders */}
      <LatestOrders />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Products */}
        <TopProducts />

        {/* Sales by Category */}
        <SalesByCategory />
      </div>
    </div>
  )
}

import { createClient } from "@/lib/supabase/server"
import { TrendingUp, Package, ShoppingCart, Users } from "lucide-react"
import DashboardStats from "@/components/admin/dashboard-stats"
import SuccessMetrics from "@/components/admin/success-metrics"
import VisitorsChart from "@/components/admin/visitors-chart"
import LatestOrders from "@/components/admin/latest-orders"
import TopProducts from "@/components/admin/top-products"
import SalesByCategory from "@/components/admin/sales-by-category"

export default async function AdminDashboardPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  let admin = null
  if (user?.id) {
    const { data: adminData } = await supabase.from("admins").select("full_name").eq("user_id", user.id).single()
    admin = adminData
  }

  // Get statistics
  const { count: totalProducts } = await supabase.from("products").select("*", { count: "exact", head: true })

  const { count: totalOrders } = await supabase.from("orders").select("*", { count: "exact", head: true })

  const { count: totalCustomers } = await supabase.from("customers").select("*", { count: "exact", head: true })

  const { data: revenueData } = await supabase.from("orders").select("total").eq("status", "completed")

  const totalRevenue = revenueData?.reduce((sum, order) => sum + Number(order.total), 0) || 0

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-white rounded-lg p-6 border border-gray-200">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">مرحباً بك {admin?.full_name || "في لوحة التحكم"} 👋</h1>
        <p className="text-gray-600">إليك ملخص أداء متجرك اليوم</p>
      </div>

      {/* Success Metrics */}
      <SuccessMetrics />

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <DashboardStats
          title="الأرباح"
          value={`${totalRevenue.toLocaleString("ar-SA")} ريال`}
          subtitle="عرض التفاصيل"
          icon={TrendingUp}
          trend="up"
        />
        <DashboardStats
          title="الطلبات"
          value={`${totalOrders || 0} طلب`}
          subtitle="عرض التفاصيل"
          icon={ShoppingCart}
          trend="up"
        />
        <DashboardStats
          title="الأرباح"
          value={`${totalCustomers || 0} عميل`}
          subtitle="عرض التفاصيل"
          icon={Users}
          trend="neutral"
        />
        <DashboardStats
          title="المنتجات"
          value={`${totalProducts || 0} منتج`}
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

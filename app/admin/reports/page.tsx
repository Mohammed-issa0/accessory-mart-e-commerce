import { createClient } from "@/lib/supabase/server"
import { Calendar, TrendingUp, Package, Users, DollarSign, ShoppingCart } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import RevenueChart from "@/components/admin/revenue-chart"
import ProductPerformance from "@/components/admin/product-performance"

export default async function ReportsPage() {
  const supabase = await createClient()

  // Get date ranges
  const today = new Date()
  const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1)
  const startOfLastMonth = new Date(today.getFullYear(), today.getMonth() - 1, 1)
  const endOfLastMonth = new Date(today.getFullYear(), today.getMonth(), 0)

  // Get current month orders
  const { data: currentMonthOrders } = await supabase
    .from("orders")
    .select("total, created_at, status")
    .gte("created_at", startOfMonth.toISOString())

  // Get last month orders
  const { data: lastMonthOrders } = await supabase
    .from("orders")
    .select("total")
    .gte("created_at", startOfLastMonth.toISOString())
    .lte("created_at", endOfLastMonth.toISOString())

  // Calculate metrics
  const currentMonthRevenue = currentMonthOrders?.reduce((sum, order) => sum + Number(order.total), 0) || 0
  const lastMonthRevenue = lastMonthOrders?.reduce((sum, order) => sum + Number(order.total), 0) || 0
  const revenueGrowth = lastMonthRevenue > 0 ? ((currentMonthRevenue - lastMonthRevenue) / lastMonthRevenue) * 100 : 0

  const currentMonthOrdersCount = currentMonthOrders?.length || 0
  const lastMonthOrdersCount = lastMonthOrders?.length || 0
  const ordersGrowth =
    lastMonthOrdersCount > 0 ? ((currentMonthOrdersCount - lastMonthOrdersCount) / lastMonthOrdersCount) * 100 : 0

  // Get completed orders
  const completedOrders = currentMonthOrders?.filter((o) => o.status === "completed").length || 0
  const completionRate = currentMonthOrdersCount > 0 ? (completedOrders / currentMonthOrdersCount) * 100 : 0

  // Get total customers
  const { count: totalCustomers } = await supabase.from("customers").select("*", { count: "exact", head: true })

  // Get total products
  const { count: totalProducts } = await supabase.from("products").select("*", { count: "exact", head: true })

  // Get low stock products
  const { count: lowStockProducts } = await supabase
    .from("products")
    .select("*", { count: "exact", head: true })
    .lt("stock_quantity", 10)

  return (
    <div className="space-y-6">
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

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">إجمالي الإيرادات</CardTitle>
            <DollarSign className="w-4 h-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{currentMonthRevenue.toLocaleString("ar-SA")} ج.س</div>
            <p className={`text-xs mt-1 ${revenueGrowth >= 0 ? "text-green-600" : "text-red-600"}`}>
              {revenueGrowth >= 0 ? "+" : ""}
              {revenueGrowth.toFixed(1)}% عن الشهر الماضي
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">عدد الطلبات</CardTitle>
            <ShoppingCart className="w-4 h-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{currentMonthOrdersCount}</div>
            <p className={`text-xs mt-1 ${ordersGrowth >= 0 ? "text-green-600" : "text-red-600"}`}>
              {ordersGrowth >= 0 ? "+" : ""}
              {ordersGrowth.toFixed(1)}% عن الشهر الماضي
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">معدل الإتمام</CardTitle>
            <TrendingUp className="w-4 h-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{completionRate.toFixed(1)}%</div>
            <p className="text-xs text-gray-600 mt-1">
              {completedOrders} من {currentMonthOrdersCount} طلب
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">إجمالي العملاء</CardTitle>
            <Users className="w-4 h-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalCustomers || 0}</div>
            <p className="text-xs text-gray-600 mt-1">عميل نشط</p>
          </CardContent>
        </Card>
      </div>

      {/* Revenue Chart */}
      <RevenueChart />

      {/* Product Performance */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>حالة المخزون</CardTitle>
            <CardDescription>نظرة عامة على المنتجات</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Package className="w-5 h-5 text-gray-600" />
                <span className="text-sm text-gray-600">إجمالي المنتجات</span>
              </div>
              <span className="text-lg font-bold">{totalProducts || 0}</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Package className="w-5 h-5 text-red-600" />
                <span className="text-sm text-gray-600">منتجات منخفضة المخزون</span>
              </div>
              <span className="text-lg font-bold text-red-600">{lowStockProducts || 0}</span>
            </div>
          </CardContent>
        </Card>

        <ProductPerformance />
      </div>
    </div>
  )
}

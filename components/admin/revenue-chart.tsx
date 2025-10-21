import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import RevenueChartClient from "./revenue-chart-client"

export default async function RevenueChart() {
  const supabase = await createClient()

  // Get last 7 days of orders
  const sevenDaysAgo = new Date()
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)

  const { data: orders } = await supabase
    .from("orders")
    .select("total, created_at")
    .gte("created_at", sevenDaysAgo.toISOString())
    .order("created_at", { ascending: true })

  // Group by day
  const dailyRevenue: { [key: string]: number } = {}
  orders?.forEach((order) => {
    const date = new Date(order.created_at).toLocaleDateString("ar-SA", { month: "short", day: "numeric" })
    dailyRevenue[date] = (dailyRevenue[date] || 0) + Number(order.total)
  })

  const chartData = Object.entries(dailyRevenue).map(([date, revenue]) => ({
    date,
    revenue,
  }))

  return (
    <Card>
      <CardHeader>
        <CardTitle>الإيرادات اليومية</CardTitle>
        <CardDescription>آخر 7 أيام</CardDescription>
      </CardHeader>
      <CardContent>
        <RevenueChartClient data={chartData} />
      </CardContent>
    </Card>
  )
}

import { createClient } from "@/lib/supabase/server"
import VisitorsChartClient from "./visitors-chart-client"

export default async function VisitorsChart() {
  const supabase = await createClient()

  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const { data: orders } = await supabase
    .from("orders")
    .select("created_at")
    .gte("created_at", today.toISOString())
    .order("created_at")

  // Group orders by 3-hour intervals
  const hourlyData = Array.from({ length: 8 }, (_, i) => ({
    time: `${i * 3} ${i * 3 < 12 ? "AM" : "PM"}`,
    orders: 0,
  }))

  orders?.forEach((order) => {
    const hour = new Date(order.created_at).getHours()
    const interval = Math.floor(hour / 3)
    if (interval < 8) {
      hourlyData[interval].orders++
    }
  })

  return <VisitorsChartClient data={hourlyData} />
}

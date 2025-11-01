"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import RevenueChartClient from "./revenue-chart-client"

export default function RevenueChart() {
  // Mock data for revenue chart (will be replaced when API has orders endpoint)
  const chartData = [
    { date: "١٥ يناير", revenue: 4500 },
    { date: "١٥ يناير", revenue: 5200 },
    { date: "٢٠ يناير", revenue: 4800 },
    { date: "٢٢ يناير", revenue: 6100 },
    { date: "٢٤ يناير", revenue: 5500 },
    { date: "٢٥ يناير", revenue: 7200 },
    { date: "٢٥ يناير", revenue: 6800 },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle>الإيرادات اليومية</CardTitle>
        <CardDescription>آخر 7 أيام (بيانات تجريبية)</CardDescription>
      </CardHeader>
      <CardContent>
        <RevenueChartClient data={chartData} />
      </CardContent>
    </Card>
  )
}

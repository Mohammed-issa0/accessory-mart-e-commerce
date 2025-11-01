"use client"

import VisitorsChartClient from "./visitors-chart-client"

export default function VisitorsChart() {
  // Mock data for visitors chart (will be replaced when API has orders endpoint)
  const hourlyData = [
    { time: "0 AM", orders: 5 },
    { time: "3 AM", orders: 2 },
    { time: "6 AM", orders: 8 },
    { time: "9 AM", orders: 15 },
    { time: "12 PM", orders: 22 },
    { time: "3 PM", orders: 18 },
    { time: "6 PM", orders: 12 },
    { time: "9 PM", orders: 7 },
  ]

  return <VisitorsChartClient data={hourlyData} />
}

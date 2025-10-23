"use client"

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts"

interface RevenueChartClientProps {
  data: { date: string; revenue: number }[]
}

export default function RevenueChartClient({ data }: RevenueChartClientProps) {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date" />
        <YAxis />
        <Tooltip
          formatter={(value: number) => [`${value.toLocaleString("ar-SA")} ريال`, "الإيرادات"]}
          labelStyle={{ direction: "rtl" }}
        />
        <Bar dataKey="revenue" fill="#000000" radius={[8, 8, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  )
}

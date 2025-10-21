"use client"

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

interface VisitorsChartClientProps {
  data: Array<{ time: string; orders: number }>
}

export default function VisitorsChartClient({ data }: VisitorsChartClientProps) {
  return (
    <div className="bg-white rounded-lg p-6 border border-gray-200">
      <h2 className="text-lg font-bold text-gray-900 mb-6">الطلبات اليوم</h2>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="time" stroke="#9ca3af" style={{ fontSize: "12px" }} />
            <YAxis stroke="#9ca3af" style={{ fontSize: "12px" }} />
            <Tooltip
              contentStyle={{
                backgroundColor: "#fff",
                border: "1px solid #e5e7eb",
                borderRadius: "8px",
              }}
            />
            <Line type="monotone" dataKey="orders" stroke="#000" strokeWidth={2} dot={{ fill: "#000", r: 4 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>
      <p className="text-sm text-gray-500 text-center mt-4">عرض التقارير</p>
    </div>
  )
}

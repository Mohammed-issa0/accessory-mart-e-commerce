"use client"

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

const data = [
  { time: "12 AM", visitors: 45 },
  { time: "3 AM", visitors: 32 },
  { time: "6 AM", visitors: 28 },
  { time: "9 AM", visitors: 65 },
  { time: "12 PM", visitors: 88 },
  { time: "3 PM", visitors: 92 },
  { time: "6 PM", visitors: 78 },
  { time: "9 PM", visitors: 56 },
]

export default function VisitorsChart() {
  return (
    <div className="bg-white rounded-lg p-6 border border-gray-200">
      <h2 className="text-lg font-bold text-gray-900 mb-6">الزوار الحاليون</h2>
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
            <Line type="monotone" dataKey="visitors" stroke="#000" strokeWidth={2} dot={{ fill: "#000", r: 4 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>
      <p className="text-sm text-gray-500 text-center mt-4">عرض التقارير</p>
    </div>
  )
}

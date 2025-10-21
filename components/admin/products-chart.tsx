"use client"

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from "recharts"

const data = [
  { category: "اكسسوارات", value: 45 },
  { category: "حقائب", value: 35 },
  { category: "نظارات", value: 52 },
  { category: "مجوهرات", value: 28 },
  { category: "ساعات", value: 42 },
]

export default function ProductsChart() {
  return (
    <div className="bg-white rounded-lg p-6 border border-gray-200">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-bold text-gray-900">توزيع المنتجات حسب الفئة</h2>
        <div className="flex items-center gap-2">
          <button className="text-sm text-gray-600 hover:text-gray-900">تصدير</button>
          <button className="text-sm text-gray-600 hover:text-gray-900">استيراد</button>
        </div>
      </div>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="category" stroke="#9ca3af" style={{ fontSize: "12px" }} />
            <YAxis stroke="#9ca3af" style={{ fontSize: "12px" }} />
            <Bar dataKey="value" fill="#000" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

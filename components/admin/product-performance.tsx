"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function ProductPerformance() {
  // Mock data for top products (will be replaced when API has sales data)
  const topProducts = [
    { name: "سماعات لاسلكية", quantity: 145 },
    { name: "حافظة هاتف", quantity: 132 },
    { name: "شاحن سريع", quantity: 98 },
    { name: "كابل USB-C", quantity: 87 },
    { name: "حامل هاتف للسيارة", quantity: 76 },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle>أكثر المنتجات مبيعاً</CardTitle>
        <CardDescription>حسب الكمية المباعة (بيانات تجريبية)</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {topProducts.map((product, index) => (
            <div key={index} className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-sm font-bold">
                  {index + 1}
                </div>
                <span className="text-sm font-medium">{product.name}</span>
              </div>
              <span className="text-sm text-gray-600">{product.quantity} قطعة</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

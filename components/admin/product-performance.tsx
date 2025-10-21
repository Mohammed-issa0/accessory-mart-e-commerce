import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default async function ProductPerformance() {
  const supabase = await createClient()

  // Get top selling products from order items
  const { data: orderItems } = await supabase
    .from("order_items")
    .select("product_id, quantity, products(name_ar)")
    .limit(100)

  // Aggregate by product
  const productSales: { [key: string]: { name: string; quantity: number } } = {}
  orderItems?.forEach((item) => {
    const productName = (item.products as any)?.name_ar || "منتج غير معروف"
    if (!productSales[item.product_id]) {
      productSales[item.product_id] = { name: productName, quantity: 0 }
    }
    productSales[item.product_id].quantity += item.quantity
  })

  // Sort and get top 5
  const topProducts = Object.values(productSales)
    .sort((a, b) => b.quantity - a.quantity)
    .slice(0, 5)

  return (
    <Card>
      <CardHeader>
        <CardTitle>أكثر المنتجات مبيعاً</CardTitle>
        <CardDescription>حسب الكمية المباعة</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {topProducts.length > 0 ? (
            topProducts.map((product, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-sm font-bold">
                    {index + 1}
                  </div>
                  <span className="text-sm font-medium">{product.name}</span>
                </div>
                <span className="text-sm text-gray-600">{product.quantity} قطعة</span>
              </div>
            ))
          ) : (
            <p className="text-sm text-gray-500 text-center py-4">لا توجد بيانات مبيعات حتى الآن</p>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

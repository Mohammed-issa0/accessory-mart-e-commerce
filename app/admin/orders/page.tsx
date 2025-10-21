import { createClient } from "@/lib/supabase/server"
import { Plus, Search, Filter, ArrowUpDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import OrdersTable from "@/components/admin/orders-table"

export default async function OrdersPage() {
  const supabase = await createClient()

  const { data: orders } = await supabase.from("orders").select("*").order("created_at", { ascending: false })

  const { count: totalOrders } = await supabase.from("orders").select("*", { count: "exact", head: true })

  const { count: newOrders } = await supabase
    .from("orders")
    .select("*", { count: "exact", head: true })
    .eq("status", "new")

  const { count: processingOrders } = await supabase
    .from("orders")
    .select("*", { count: "exact", head: true })
    .eq("status", "processing")

  const { count: readyOrders } = await supabase
    .from("orders")
    .select("*", { count: "exact", head: true })
    .eq("status", "ready")

  const { count: shippingOrders } = await supabase
    .from("orders")
    .select("*", { count: "exact", head: true })
    .eq("status", "shipping")

  const { count: completedOrders } = await supabase
    .from("orders")
    .select("*", { count: "exact", head: true })
    .eq("status", "completed")

  const { count: cancelledOrders } = await supabase
    .from("orders")
    .select("*", { count: "exact", head: true })
    .eq("status", "cancelled")

  const { count: refundPendingOrders } = await supabase
    .from("orders")
    .select("*", { count: "exact", head: true })
    .eq("status", "refund_pending")

  const { count: refundedOrders } = await supabase
    .from("orders")
    .select("*", { count: "exact", head: true })
    .eq("status", "refunded")

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg p-6 border border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">قائمة الطلبات</h1>
            <p className="text-gray-600">جميع طلبات متجرك هنا</p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline">تصدير الطلبات</Button>
            <Button className="gap-2">
              <Plus className="w-4 h-4" />
              إنشاء
            </Button>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center gap-2 flex-wrap">
          <Button variant="default" size="sm">
            الكل
          </Button>
          <Button variant="outline" size="sm">
            جديد
          </Button>
          <Button variant="outline" size="sm">
            جاري التجهيز
          </Button>
          <Button variant="outline" size="sm">
            جاهز
          </Button>
          <Button variant="outline" size="sm">
            جاري التوصيل
          </Button>
          <Button variant="outline" size="sm">
            مكتمل
          </Button>
          <Button variant="outline" size="sm">
            ملغي
          </Button>
          <Button variant="outline" size="sm">
            قيد الاسترجاع
          </Button>
          <Button variant="outline" size="sm">
            مسترجع
          </Button>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-lg p-6 border border-gray-200">
        <div className="flex items-center gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <Input placeholder="بحث..." className="pr-10" />
          </div>
          <Button variant="outline" size="icon">
            <Filter className="w-5 h-5" />
          </Button>
          <Button variant="outline" size="icon">
            <ArrowUpDown className="w-5 h-5" />
          </Button>
        </div>

        {/* Orders Table */}
        <OrdersTable orders={orders || []} />
      </div>
    </div>
  )
}

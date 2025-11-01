"use client"
import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import OrdersPageClient from "@/components/admin/orders-page-client"
import { AlertCircle } from "lucide-react"

export default async function OrdersPage({
  searchParams,
}: {
  searchParams: { status?: string; search?: string }
}) {
  const supabase = await createClient()

  // Check if user is admin
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/admin/login")
  }

  const { data: userData } = await supabase.from("users").select("is_admin").eq("id", user.id).single()

  if (!userData?.is_admin) {
    redirect("/")
  }

  // Fetch orders with filters
  let query = supabase
    .from("orders")
    .select(
      `
      *,
      order_items (
        id,
        product_name,
        product_image,
        quantity,
        price,
        total
      ),
      receipt_url,
      delivery_address,
      customer_whatsapp
    `,
    )
    .order("created_at", { ascending: false })

  if (searchParams.status && searchParams.status !== "all") {
    query = query.eq("status", searchParams.status)
  }

  if (searchParams.search) {
    query = query.or(
      `order_number.ilike.%${searchParams.search}%,customer_name.ilike.%${searchParams.search}%,customer_email.ilike.%${searchParams.search}%`,
    )
  }

  const { data: orders } = await query

  // Get counts for each status
  const { count: totalCount } = await supabase.from("orders").select("*", { count: "exact", head: true })

  const { count: newCount } = await supabase
    .from("orders")
    .select("*", { count: "exact", head: true })
    .eq("status", "new")

  const { count: processingCount } = await supabase
    .from("orders")
    .select("*", { count: "exact", head: true })
    .eq("status", "processing")

  const { count: readyCount } = await supabase
    .from("orders")
    .select("*", { count: "exact", head: true })
    .eq("status", "ready")

  const { count: shippingCount } = await supabase
    .from("orders")
    .select("*", { count: "exact", head: true })
    .eq("status", "shipping")

  const { count: completedCount } = await supabase
    .from("orders")
    .select("*", { count: "exact", head: true })
    .eq("status", "completed")

  const { count: cancelledCount } = await supabase
    .from("orders")
    .select("*", { count: "exact", head: true })
    .eq("status", "cancelled")

  const statusCounts = {
    all: totalCount || 0,
    new: newCount || 0,
    processing: processingCount || 0,
    ready: readyCount || 0,
    shipping: shippingCount || 0,
    completed: completedCount || 0,
    cancelled: cancelledCount || 0,
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="bg-white rounded-lg p-6 border border-gray-200 mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">إدارة الطلبات</h1>
        <p className="text-gray-600">عرض وإدارة جميع الطلبات</p>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-8 text-center">
        <AlertCircle className="w-16 h-16 text-blue-500 mx-auto mb-4" />
        <h2 className="text-xl font-bold text-gray-900 mb-2">قسم الطلبات قيد التطوير</h2>
        <p className="text-gray-600 mb-4">لعرض وإدارة الطلبات، يجب توفير API endpoints التالية من الباك اند:</p>
        <ul className="text-right text-sm text-gray-700 space-y-2 max-w-md mx-auto">
          <li className="flex items-start gap-2">
            <span className="text-blue-500">•</span>
            <span>
              <code className="bg-gray-100 px-2 py-1 rounded">GET /api/orders</code> - لجلب قائمة الطلبات
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-blue-500">•</span>
            <span>
              <code className="bg-gray-100 px-2 py-1 rounded">GET /api/orders/:id</code> - لجلب تفاصيل طلب معين
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-blue-500">•</span>
            <span>
              <code className="bg-gray-100 px-2 py-1 rounded">PUT /api/orders/:id/status</code> - لتحديث حالة الطلب
            </span>
          </li>
        </ul>
      </div>

      <OrdersPageClient orders={orders || []} statusCounts={statusCounts} />
    </div>
  )
}

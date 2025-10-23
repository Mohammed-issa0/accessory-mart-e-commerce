import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import OrdersPageClient from "@/components/admin/orders-page-client"

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
      )
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

  return <OrdersPageClient orders={orders || []} statusCounts={statusCounts} />
}

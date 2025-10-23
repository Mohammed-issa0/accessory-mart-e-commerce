import { createClient } from "@/lib/supabase/server"
import { redirect, notFound } from "next/navigation"
import OrderDetailsClient from "@/components/admin/order-details-client"

export default async function OrderDetailPage({ params }: { params: { id: string } }) {
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

  // Fetch order details
  const { data: order } = await supabase
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
    .eq("id", params.id)
    .single()

  if (!order) {
    notFound()
  }

  return <OrderDetailsClient order={order} />
}

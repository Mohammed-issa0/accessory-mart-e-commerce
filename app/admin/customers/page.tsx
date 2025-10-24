import { createClient } from "@/lib/supabase/server"
import CustomersPageClient from "@/components/admin/customers-page-client"

export default async function CustomersPage() {
  const supabase = await createClient()

  const { data: users } = await supabase.from("users").select("*").order("created_at", { ascending: false })

  // Get order counts for each user by joining through customers table
  const customersWithOrders = await Promise.all(
    (users || []).map(async (user) => {
      // Find customer record for this user
      const { data: customer } = await supabase.from("customers").select("id").eq("user_id", user.id).maybeSingle()

      let orderCount = 0
      if (customer) {
        // Count orders for this customer
        const { count } = await supabase
          .from("orders")
          .select("*", { count: "exact", head: true })
          .eq("customer_id", customer.id)

        orderCount = count || 0
      }

      return {
        id: user.id,
        full_name: user.full_name || "غير محدد",
        email: user.email || "",
        phone: user.phone || "",
        avatar_url: user.avatar_url || "",
        created_at: user.created_at,
        updated_at: user.updated_at,
        total_orders: orderCount,
        is_admin: user.is_admin || false,
      }
    }),
  )

  return <CustomersPageClient customers={customersWithOrders || []} />
}

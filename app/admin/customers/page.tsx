import { createClient } from "@/lib/supabase/server"
import CustomersPageClient from "@/components/admin/customers-page-client"

export default async function CustomersPage() {
  const supabase = await createClient()

  const { data: users } = await supabase
    .from("users")
    .select(
      `
      *,
      orders:orders(count)
    `,
    )
    .order("created_at", { ascending: false })

  const customers = users?.map((user) => ({
    id: user.id,
    full_name: user.full_name || "غير محدد",
    email: user.email || "",
    phone: user.phone || "",
    created_at: user.created_at,
    total_orders: user.orders?.[0]?.count || 0,
    is_admin: user.is_admin || false,
  }))

  return <CustomersPageClient customers={customers || []} />
}

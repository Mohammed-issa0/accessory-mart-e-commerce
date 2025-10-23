import { createClient } from "@/lib/supabase/server"
import { notFound } from "next/navigation"
import CustomerDetailsClient from "@/components/admin/customer-details-client"

type Props = {
  params: Promise<{ id: string }>
}

export default async function CustomerDetailPage({ params }: Props) {
  const { id } = await params
  const supabase = await createClient()

  // Fetch customer details
  const { data: customer } = await supabase.from("customers").select("*").eq("id", id).maybeSingle()

  if (!customer) {
    notFound()
  }

  // Fetch customer orders
  const { data: orders } = await supabase
    .from("orders")
    .select(`
      *,
      items:order_items(*)
    `)
    .eq("customer_id", id)
    .order("created_at", { ascending: false })

  return <CustomerDetailsClient customer={customer} orders={orders || []} />
}

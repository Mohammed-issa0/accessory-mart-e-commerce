import { createClient } from "@/lib/supabase/server"
import CustomersPageClient from "@/components/admin/customers-page-client"

export default async function CustomersPage() {
  const supabase = await createClient()

  // Fetch customers with their order counts and last order date
  const { data: customers } = await supabase.from("customers").select("*").order("created_at", { ascending: false })

  return <CustomersPageClient customers={customers || []} />
}

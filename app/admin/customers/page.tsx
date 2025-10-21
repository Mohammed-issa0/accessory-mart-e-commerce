import { createClient } from "@/lib/supabase/server"
import { Search, Filter, ArrowUpDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import CustomersTable from "@/components/admin/customers-table"

export default async function CustomersPage() {
  const supabase = await createClient()

  const { data: customers } = await supabase.from("customers").select("*").order("created_at", { ascending: false })

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg p-6 border border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">قائمة عملائك</h1>
            <p className="text-gray-600">إدارة عملاء متجرك</p>
          </div>
          <Button>إنشاء</Button>
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center gap-2">
          <Button variant="default" size="sm">
            الكل
          </Button>
          <Button variant="outline" size="sm">
            مفصل
          </Button>
          <Button variant="outline" size="sm">
            محظور
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

        {/* Customers Table */}
        <CustomersTable customers={customers || []} />
      </div>
    </div>
  )
}

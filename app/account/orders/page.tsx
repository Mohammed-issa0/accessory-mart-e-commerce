"use client"

import { useEffect, useState } from "react"
import { createBrowserClient } from "@/lib/supabase/client"
import { Package, Eye } from "lucide-react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { format } from "date-fns"
import { ar } from "date-fns/locale"

type Order = {
  id: string
  order_number: string
  created_at: string
  status: string
  total: number
  customer_name: string
  shipping_address: string
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createBrowserClient()

  useEffect(() => {
    fetchOrders()
  }, [])

  const fetchOrders = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) return

    const { data, error } = await supabase
      .from("orders")
      .select("*")
      .eq("customer_email", user.email)
      .order("created_at", { ascending: false })

    if (error) {
      console.error("Error fetching orders:", error)
    } else {
      setOrders(data || [])
    }
    setLoading(false)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "processing":
        return "bg-blue-100 text-blue-800"
      case "shipped":
        return "bg-purple-100 text-purple-800"
      case "delivered":
        return "bg-green-100 text-green-800"
      case "cancelled":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case "pending":
        return "قيد الانتظار"
      case "processing":
        return "قيد المعالجة"
      case "shipped":
        return "تم الشحن"
      case "delivered":
        return "تم التوصيل"
      case "cancelled":
        return "ملغي"
      default:
        return status
    }
  }

  if (loading) {
    return <div className="text-center py-8">جاري التحميل...</div>
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg p-6">
        <h1 className="text-2xl font-bold mb-2 text-right">طلباتي</h1>
        <p className="text-gray-600 text-right">عرض وإدارة طلباتك</p>
      </div>

      {orders.length === 0 ? (
        <div className="bg-white rounded-lg p-12 text-center">
          <Package className="w-16 h-16 mx-auto text-gray-400 mb-4" />
          <p className="text-gray-600 mb-4">لا توجد طلبات بعد</p>
          <Link href="/products">
            <Button>تصفح المنتجات</Button>
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order, index) => (
            <motion.div
              key={order.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className="bg-white rounded-lg p-6"
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="text-right flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="font-semibold">طلب #{order.order_number}</h3>
                    <span className={`text-xs px-2 py-1 rounded ${getStatusColor(order.status)}`}>
                      {getStatusText(order.status)}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600">
                    {format(new Date(order.created_at), "dd MMMM yyyy", { locale: ar })}
                  </p>
                  <p className="text-sm text-gray-600 mt-1">{order.shipping_address}</p>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="text-sm text-gray-600">المجموع</p>
                    <p className="text-xl font-bold text-primary">${order.total.toFixed(2)}</p>
                  </div>
                  <Link href={`/account/orders/${order.id}`}>
                    <Button size="sm" variant="outline">
                      <Eye className="w-4 h-4 ml-1" />
                      عرض
                    </Button>
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  )
}

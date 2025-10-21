"use client"

import { useEffect, useState } from "react"
import { createBrowserClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import Image from "next/image"

interface Order {
  id: string
  order_number: string
  total_amount: number
  status: string
  created_at: string
  order_items: {
    quantity: number
    price: number
    products: {
      name: string
      image_url: string
    }
  }[]
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const supabase = createBrowserClient()

  useEffect(() => {
    checkUserAndLoadOrders()
  }, [])

  const checkUserAndLoadOrders = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) {
      router.push("/auth/login")
      return
    }

    const { data, error } = await supabase
      .from("orders")
      .select(`
        id,
        order_number,
        total_amount,
        status,
        created_at,
        order_items (
          quantity,
          price,
          products (
            name,
            image_url
          )
        )
      `)
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })

    if (!error && data) {
      setOrders(data as any)
    }
    setLoading(false)
  }

  const getStatusBadge = (status: string) => {
    const statusMap: Record<string, { label: string; className: string }> = {
      pending: { label: "قيد الانتظار", className: "bg-yellow-100 text-yellow-800" },
      processing: { label: "قيد المعالجة", className: "bg-blue-100 text-blue-800" },
      shipped: { label: "تم الشحن", className: "bg-purple-100 text-purple-800" },
      delivered: { label: "تم التوصيل", className: "bg-green-100 text-green-800" },
      cancelled: { label: "ملغي", className: "bg-red-100 text-red-800" },
    }

    const statusInfo = statusMap[status] || { label: status, className: "bg-gray-100 text-gray-800" }

    return (
      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${statusInfo.className}`}>{statusInfo.label}</span>
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">جاري تحميل الطلبات...</p>
        </div>
      </div>
    )
  }

  if (orders.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4" dir="rtl">
        <div className="text-center space-y-4">
          <h2 className="text-2xl font-bold">لا توجد طلبات</h2>
          <p className="text-muted-foreground">لم تقم بأي طلبات بعد</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background py-12 px-4" dir="rtl">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">طلباتي</h1>

        <div className="space-y-6">
          {orders.map((order) => (
            <div key={order.id} className="bg-card border rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="font-bold text-lg">طلب رقم {order.order_number}</h3>
                  <p className="text-sm text-muted-foreground">
                    {new Date(order.created_at).toLocaleDateString("ar-SA")}
                  </p>
                </div>
                {getStatusBadge(order.status)}
              </div>

              <div className="space-y-3 mb-4">
                {order.order_items.map((item, index) => (
                  <div key={index} className="flex items-center gap-4">
                    <div className="relative w-16 h-16 flex-shrink-0">
                      <Image
                        src={item.products.image_url || "/placeholder.svg?height=64&width=64"}
                        alt={item.products.name}
                        fill
                        className="object-cover rounded-md"
                      />
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold">{item.products.name}</p>
                      <p className="text-sm text-muted-foreground">
                        الكمية: {item.quantity} × {item.price} ريال
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-t pt-4 flex justify-between items-center">
                <span className="font-bold text-lg">المجموع الكلي</span>
                <span className="font-bold text-lg text-primary">{order.total_amount.toFixed(2)} ريال</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

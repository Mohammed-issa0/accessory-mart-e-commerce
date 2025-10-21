"use client"

import { useEffect, useState } from "react"
import { createBrowserClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { motion } from "framer-motion"
import { useToast } from "@/hooks/use-toast"
import Header from "@/components/1-header"
import Footer from "@/components/8-footer"
import { Package, CheckCircle, Clock, Truck, AlertCircle } from "lucide-react"

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
  const { toast } = useToast()

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

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return <Clock className="h-5 w-5 text-yellow-500" />
      case "processing":
        return <Package className="h-5 w-5 text-blue-500" />
      case "shipped":
        return <Truck className="h-5 w-5 text-purple-500" />
      case "delivered":
        return <CheckCircle className="h-5 w-5 text-green-500" />
      case "cancelled":
        return <AlertCircle className="h-5 w-5 text-red-500" />
      default:
        return <Package className="h-5 w-5 text-gray-500" />
    }
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
      <div className="min-h-screen flex flex-col">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
            className="text-center"
          >
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-muted-foreground">جاري تحميل الطلبات...</p>
          </motion.div>
        </div>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 pt-32 pb-16">
        <div className="max-w-6xl mx-auto px-4 w-full">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-3xl font-bold mb-8"
          >
            طلباتي
          </motion.h1>

          {orders.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="text-center py-16"
            >
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
                className="mb-6"
              >
                <Package className="h-16 w-16 text-gray-300 mx-auto" />
              </motion.div>
              <h2 className="text-2xl font-bold mb-2">لا توجد طلبات</h2>
              <p className="text-muted-foreground">لم تقم بأي طلبات بعد</p>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="space-y-6"
            >
              {orders.map((order, index) => (
                <motion.div
                  key={order.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className="bg-card border rounded-lg p-6 hover:shadow-lg transition-shadow"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="font-bold text-lg">طلب رقم {order.order_number}</h3>
                      <p className="text-sm text-muted-foreground">
                        {new Date(order.created_at).toLocaleDateString("ar-SA")}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      {getStatusIcon(order.status)}
                      {getStatusBadge(order.status)}
                    </div>
                  </div>

                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3, delay: index * 0.1 + 0.1 }}
                    className="space-y-3 mb-4"
                  >
                    {order.order_items.map((item, itemIndex) => (
                      <motion.div
                        key={itemIndex}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.2, delay: index * 0.1 + 0.1 + itemIndex * 0.05 }}
                        className="flex items-center gap-4"
                      >
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
                        <p className="font-semibold text-primary">{(item.quantity * item.price).toFixed(2)} ريال</p>
                      </motion.div>
                    ))}
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3, delay: index * 0.1 + 0.2 }}
                    className="border-t pt-4 flex justify-between items-center"
                  >
                    <span className="font-bold text-lg">المجموع الكلي</span>
                    <span className="font-bold text-lg text-primary">{order.total_amount.toFixed(2)} ريال</span>
                  </motion.div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  )
}

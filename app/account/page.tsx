"use client"

import { useEffect, useState } from "react"
import { createBrowserClient } from "@/lib/supabase/client"
import { Package, Heart, MapPin, DollarSign } from "lucide-react"
import { motion } from "framer-motion"

export default function AccountDashboard() {
  const [stats, setStats] = useState({
    orders: 0,
    wishlist: 0,
    addresses: 0,
    totalSpent: 0,
  })
  const supabase = createBrowserClient()

  useEffect(() => {
    fetchStats()
  }, [])

  const fetchStats = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) return

    // Fetch orders count
    const { count: ordersCount } = await supabase
      .from("orders")
      .select("*", { count: "exact", head: true })
      .eq("customer_email", user.email)

    // Fetch wishlist count
    const { count: wishlistCount } = await supabase
      .from("wishlist")
      .select("*", { count: "exact", head: true })
      .eq("user_id", user.id)

    // Fetch addresses count
    const { count: addressesCount } = await supabase
      .from("addresses")
      .select("*", { count: "exact", head: true })
      .eq("user_id", user.id)

    // Fetch total spent
    const { data: orders } = await supabase.from("orders").select("total").eq("customer_email", user.email)

    const totalSpent = orders?.reduce((sum, order) => sum + (order.total || 0), 0) || 0

    setStats({
      orders: ordersCount || 0,
      wishlist: wishlistCount || 0,
      addresses: addressesCount || 0,
      totalSpent,
    })
  }

  const statCards = [
    {
      title: "إجمالي الطلبات",
      value: stats.orders,
      icon: Package,
      color: "from-blue-500 to-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      title: "المفضلة",
      value: stats.wishlist,
      icon: Heart,
      color: "from-red-500 to-red-600",
      bgColor: "bg-red-50",
    },
    {
      title: "العناوين المحفوظة",
      value: stats.addresses,
      icon: MapPin,
      color: "from-green-500 to-green-600",
      bgColor: "bg-green-50",
    },
    {
      title: "إجمالي المشتريات",
      value: `$${stats.totalSpent.toFixed(2)}`,
      icon: DollarSign,
      color: "from-purple-500 to-purple-600",
      bgColor: "bg-purple-50",
    },
  ]

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-primary to-primary/80 rounded-2xl p-8 text-white shadow-lg"
      >
        <h1 className="text-3xl font-bold mb-2 text-right">لوحة حسابي</h1>
        <p className="text-white/90 text-right">مرحباً بك في لوحة التحكم الخاصة بك</p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat, index) => {
          const Icon = stat.icon
          return (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              whileHover={{ y: -5, scale: 1.02 }}
              className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-lg transition-all"
            >
              <div className="flex items-center justify-between mb-4">
                <motion.div
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.5 }}
                  className={`bg-gradient-to-br ${stat.color} w-14 h-14 rounded-xl flex items-center justify-center shadow-md`}
                >
                  <Icon className="w-7 h-7 text-white" />
                </motion.div>
              </div>
              <p className="text-gray-600 text-sm mb-1 text-right">{stat.title}</p>
              <p className="text-3xl font-bold text-right">{stat.value}</p>
            </motion.div>
          )
        })}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-white rounded-2xl p-8 shadow-sm"
      >
        <h2 className="text-xl font-bold mb-4 text-right">نظرة عامة على الحساب</h2>
        <div className="space-y-4 text-right">
          <p className="text-gray-600 leading-relaxed">
            من هنا يمكنك إدارة حسابك بالكامل، عرض طلباتك، إدارة عناوينك، وتحديث معلوماتك الشخصية.
          </p>
          <p className="text-gray-600 leading-relaxed">استخدم القائمة الجانبية للتنقل بين الأقسام المختلفة.</p>
        </div>
      </motion.div>
    </div>
  )
}

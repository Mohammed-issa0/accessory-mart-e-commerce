"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter, usePathname } from "next/navigation"
import { useAuth } from "@/lib/contexts/auth-context"
import Header from "@/components/1-header"
import Footer from "@/components/8-footer"
import Link from "next/link"
import { MapPin, Heart, Package, Settings, LogOut, User, LayoutDashboard, ShoppingCart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { motion, AnimatePresence } from "framer-motion"

export default function AccountLayout({ children }: { children: React.ReactNode }) {
  const { user, loading, logout } = useAuth()
  const [isNavigating, setIsNavigating] = useState(false)
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    if (!loading && !user) {
      router.push("/auth/login")
    }
  }, [user, loading, router])

  useEffect(() => {
    setIsNavigating(true)
    const timer = setTimeout(() => setIsNavigating(false), 300)
    return () => clearTimeout(timer)
  }, [pathname])

  const handleSignOut = async () => {
    await logout()
    router.push("/")
  }

  const menuItems = [
    {
      href: "/account",
      label: "لوحة حسابي",
      icon: LayoutDashboard,
    },
    {
      href: "/account/cart",
      label: "السلة",
      icon: ShoppingCart,
    },
    {
      href: "/account/wishlist",
      label: "المفضلة",
      icon: Heart,
    },
    {
      href: "/account/orders",
      label: "طلباتي",
      icon: Package,
    },
    {
      href: "/account/addresses",
      label: "العنوان",
      icon: MapPin,
    },
    {
      href: "/account/settings",
      label: "الإعدادات",
      icon: Settings,
    },
  ]

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">جاري التحميل...</p>
        </motion.div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-50 to-gray-100">
      <Header />

      <main className="flex-1 pt-32 pb-16">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-4 gap-6">
            {/* Sidebar - Desktop */}
            <aside className="hidden lg:block lg:col-span-1">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
                className="bg-white rounded-2xl p-6 sticky top-36 shadow-lg border border-gray-100"
              >
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="flex items-center gap-3 mb-6 pb-6 border-b"
                >
                  <motion.div
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    className="w-14 h-14 rounded-full bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center shadow-md"
                  >
                    <User className="w-7 h-7 text-white" />
                  </motion.div>
                  <div className="text-right flex-1">
                    <p className="font-bold text-lg">{user?.name || "المستخدم"}</p>
                   
                  </div>
                </motion.div>

                <nav className="space-y-2">
                  {menuItems.map((item, index) => {
                    const Icon = item.icon
                    const isActive = pathname === item.href
                    return (
                      <motion.div
                        key={item.href}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 * index }}
                      >
                        <Link
                          href={item.href}
                          className={cn(
                            "flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all duration-300 group relative overflow-hidden",
                            isActive
                              ? "bg-gradient-to-r from-primary to-primary/80 text-white shadow-lg shadow-primary/30"
                              : "text-gray-700 hover:bg-gray-50 hover:shadow-md",
                          )}
                        >
                          {isActive && (
                            <motion.div
                              layoutId="activeTab"
                              className="absolute inset-0 bg-gradient-to-r from-primary to-primary/80 rounded-xl"
                              transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                            />
                          )}
                          <Icon
                            className={cn(
                              "w-5 h-5 relative z-10 transition-transform group-hover:scale-110",
                              isActive && "drop-shadow-md",
                            )}
                          />
                          <span className="font-medium relative z-10">{item.label}</span>
                        </Link>
                      </motion.div>
                    )
                  })}

                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 * menuItems.length }}
                    className="pt-4 border-t"
                  >
                    <Button
                      onClick={handleSignOut}
                      variant="ghost"
                      className="w-full justify-start gap-3 px-4 py-3.5 text-red-600 hover:bg-red-50 hover:text-red-700 rounded-xl transition-all duration-300 group"
                    >
                      <LogOut className="w-5 h-5 transition-transform group-hover:scale-110" />
                      <span className="font-medium">تسجيل الخروج</span>
                    </Button>
                  </motion.div>
                </nav>
              </motion.div>
            </aside>

            {/* Sidebar - Mobile (Icon Only) */}
            <aside className="lg:hidden">
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-2xl p-3 mb-6 shadow-lg"
              >
                <nav className="flex items-center justify-around">
                  {menuItems.map((item) => {
                    const Icon = item.icon
                    const isActive = pathname === item.href
                    return (
                      <Link key={item.href} href={item.href} className="relative">
                        <motion.div
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.95 }}
                          className={cn(
                            "flex flex-col items-center gap-1 p-2 rounded-xl transition-all relative",
                            isActive ? "text-primary" : "text-gray-600",
                          )}
                        >
                          {isActive && (
                            <motion.div
                              layoutId="activeMobileTab"
                              className="absolute inset-0 bg-primary/10 rounded-xl"
                              transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                            />
                          )}
                          <Icon className={cn("w-6 h-6 relative z-10", isActive && "scale-110")} />
                          <span className="text-xs relative z-10 font-medium">{item.label}</span>
                        </motion.div>
                      </Link>
                    )
                  })}
                </nav>
              </motion.div>
            </aside>

            {/* Main Content */}
            <div className="lg:col-span-3 relative">
              <AnimatePresence>
                {isNavigating && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 bg-white/80 backdrop-blur-sm rounded-2xl  flex items-center justify-center"
                  >
                    <div className="text-center">
                      <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary mx-auto mb-3"></div>
                      <p className="text-sm text-gray-600">جاري التحميل...</p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <AnimatePresence mode="wait">
                <motion.div
                  key={pathname}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  {children}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}

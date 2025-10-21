"use client"

import { useCart } from "@/lib/context/cart-context"
import Header from "@/components/1-header"
import Footer from "@/components/8-footer"
import { Button } from "@/components/ui/button"
import { Trash2, Plus, Minus } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { useToast } from "@/hooks/use-toast"

export default function CartPage() {
  const { cart, removeFromCart, updateQuantity, clearCart, totalPrice } = useCart()
  const [loading, setLoading] = useState(false)
  const [showCheckoutForm, setShowCheckoutForm] = useState(false)
  const [customerInfo, setCustomerInfo] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    notes: "",
  })
  const router = useRouter()
  const { toast } = useToast()

  const handleCheckout = async () => {
    if (cart.length === 0) return

    if (
      !customerInfo.name ||
      !customerInfo.email ||
      !customerInfo.phone ||
      !customerInfo.address ||
      !customerInfo.city
    ) {
      toast({
        title: "خطأ",
        description: "يرجى ملء جميع الحقول المطلوبة",
        variant: "destructive",
      })
      return
    }

    setLoading(true)
    try {
      const response = await fetch("/api/orders/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: cart.map((item) => ({
            id: item.id,
            name_ar: item.name,
            image: item.image,
            quantity: item.quantity,
            price: item.price,
          })),
          total: totalPrice * 1.15,
          customerName: customerInfo.name,
          customerEmail: customerInfo.email,
          customerPhone: customerInfo.phone,
          shippingAddress: customerInfo.address,
          shippingCity: customerInfo.city,
          paymentMethod: "cash",
          notes: customerInfo.notes,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to create order")
      }

      clearCart()
      toast({
        title: "تم إنشاء الطلب بنجاح",
        description: `رقم الطلب: ${data.orderNumber}`,
      })
      router.push("/orders")
    } catch (error: any) {
      console.error("Error creating order:", error)
      toast({
        title: "خطأ",
        description: error.message,
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 pt-32 pb-16">
        <div className="container mx-auto px-4">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-3xl font-bold mb-8"
          >
            سلة التسوق
          </motion.h1>

          {cart.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="text-center py-16"
            >
              <p className="text-gray-600 text-lg mb-6">سلة التسوق فارغة</p>
              <Link href="/products">
                <Button>تصفح المنتجات</Button>
              </Link>
            </motion.div>
          ) : (
            <div className="grid lg:grid-cols-3 gap-8">
              {/* Cart Items */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
                className="lg:col-span-2 space-y-4"
              >
                {cart.map((item, index) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    className="bg-white border rounded-lg p-4 flex gap-4"
                  >
                    <div className="relative w-24 h-24 flex-shrink-0">
                      <Image
                        src={item.image || "/placeholder.svg"}
                        alt={item.name}
                        fill
                        className="object-cover rounded-md"
                      />
                    </div>

                    <div className="flex-1">
                      <h3 className="font-semibold mb-2">{item.name}</h3>
                      <p className="text-lg font-bold text-primary">{item.price.toFixed(2)} ريال</p>

                      <div className="flex items-center gap-2 mt-4">
                        <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                          <Button
                            size="icon"
                            variant="outline"
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            disabled={item.quantity <= 1}
                          >
                            <Minus className="h-4 w-4" />
                          </Button>
                        </motion.div>
                        <span className="w-12 text-center font-semibold">{item.quantity}</span>
                        <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                          <Button
                            size="icon"
                            variant="outline"
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          >
                            <Plus className="h-4 w-4" />
                          </Button>
                        </motion.div>
                      </div>
                    </div>

                    <div className="flex flex-col items-end justify-between">
                      <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => {
                            removeFromCart(item.id)
                            toast({
                              title: "تم الحذف من السلة",
                              description: `تم حذف ${item.name} من سلة التسوق`,
                            })
                          }}
                        >
                          <Trash2 className="h-5 w-5 text-destructive" />
                        </Button>
                      </motion.div>
                      <p className="font-bold text-lg">{(item.price * item.quantity).toFixed(2)} ريال</p>
                    </div>
                  </motion.div>
                ))}
              </motion.div>

              {/* Order Summary */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
                className="lg:col-span-1"
              >
                <div className="bg-white border rounded-lg p-6 sticky top-36">
                  <h2 className="text-xl font-bold mb-4">ملخص الطلب</h2>

                  <div className="space-y-3 mb-6">
                    <div className="flex justify-between">
                      <span className="text-gray-600">المجموع الفرعي</span>
                      <span className="font-semibold">{totalPrice.toFixed(2)} ريال</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">الضريبة (15%)</span>
                      <span className="font-semibold">{(totalPrice * 0.15).toFixed(2)} ريال</span>
                    </div>
                    <div className="border-t pt-3 flex justify-between text-lg font-bold">
                      <span>المجموع الكلي</span>
                      <span className="text-primary">{(totalPrice * 1.15).toFixed(2)} ريال</span>
                    </div>
                  </div>

                  {!showCheckoutForm ? (
                    <>
                      <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                        <Button className="w-full" size="lg" onClick={() => setShowCheckoutForm(true)}>
                          متابعة إلى الدفع
                        </Button>
                      </motion.div>
                      <Link href="/products">
                        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                          <Button variant="outline" className="w-full mt-3 bg-transparent">
                            متابعة التسوق
                          </Button>
                        </motion.div>
                      </Link>
                    </>
                  ) : (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                      className="space-y-4"
                    >
                      <h3 className="font-semibold text-lg mb-4">معلومات التوصيل</h3>

                      <div>
                        <label className="block text-sm font-medium mb-2">الاسم الكامل *</label>
                        <input
                          type="text"
                          className="w-full border rounded-md px-3 py-2"
                          value={customerInfo.name}
                          onChange={(e) => setCustomerInfo({ ...customerInfo, name: e.target.value })}
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-2">البريد الإلكتروني *</label>
                        <input
                          type="email"
                          className="w-full border rounded-md px-3 py-2"
                          value={customerInfo.email}
                          onChange={(e) => setCustomerInfo({ ...customerInfo, email: e.target.value })}
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-2">رقم الهاتف *</label>
                        <input
                          type="tel"
                          className="w-full border rounded-md px-3 py-2"
                          value={customerInfo.phone}
                          onChange={(e) => setCustomerInfo({ ...customerInfo, phone: e.target.value })}
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-2">المدينة *</label>
                        <input
                          type="text"
                          className="w-full border rounded-md px-3 py-2"
                          value={customerInfo.city}
                          onChange={(e) => setCustomerInfo({ ...customerInfo, city: e.target.value })}
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-2">عنوان التوصيل *</label>
                        <textarea
                          className="w-full border rounded-md px-3 py-2"
                          rows={3}
                          value={customerInfo.address}
                          onChange={(e) => setCustomerInfo({ ...customerInfo, address: e.target.value })}
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-2">ملاحظات (اختياري)</label>
                        <textarea
                          className="w-full border rounded-md px-3 py-2"
                          rows={2}
                          value={customerInfo.notes}
                          onChange={(e) => setCustomerInfo({ ...customerInfo, notes: e.target.value })}
                        />
                      </div>

                      <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                        <Button className="w-full" size="lg" onClick={handleCheckout} disabled={loading}>
                          {loading ? "جاري المعالجة..." : "تأكيد الطلب"}
                        </Button>
                      </motion.div>

                      <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                        <Button
                          variant="outline"
                          className="w-full bg-transparent"
                          onClick={() => setShowCheckoutForm(false)}
                        >
                          رجوع
                        </Button>
                      </motion.div>
                    </motion.div>
                  )}
                </div>
              </motion.div>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  )
}

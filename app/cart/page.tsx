"use client"

import { useCart } from "@/lib/context/cart-context"
import Header from "@/components/1-header"
import Footer from "@/components/8-footer"
import { Button } from "@/components/ui/button"
import { Trash2, Plus, Minus } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { useToast } from "@/hooks/use-toast"
import { createClient } from "@/lib/supabase/client"

export default function CartPage() {
  const { cart, removeFromCart, updateQuantity, totalPrice } = useCart()
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [discountCode, setDiscountCode] = useState("")
  const [discount, setDiscount] = useState(0)
  const router = useRouter()
  const { toast } = useToast()
  const supabase = createClient()

  useEffect(() => {
    const checkUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      setUser(user)
      setLoading(false)
    }
    checkUser()
  }, [])

  const subtotal = totalPrice
  const tax = subtotal * 0.14
  const shipping = 0
  const total = subtotal + tax - discount + shipping

  const applyDiscount = () => {
    if (discountCode === "SAVE18") {
      setDiscount(subtotal * 0.18)
      toast({
        title: "تم تطبيق الخصم",
        description: "تم تطبيق خصم 18%",
      })
    } else {
      toast({
        title: "رمز خاطئ",
        description: "رمز الخصم غير صحيح",
        variant: "destructive",
      })
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 pt-32 pb-16 flex items-center justify-center">
          <div className="text-center">جاري التحميل...</div>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />

      <main className="flex-1 pt-32 pb-16">
        <div className="container mx-auto px-4">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm text-gray-600 mb-6">
            <Link href="/" className="hover:text-primary">
              الرئيسية
            </Link>
            <span>&lt;</span>
            <span className="text-black">عربة التسوق</span>
          </div>

          {!user && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white border border-gray-200 rounded-lg p-4 mb-6 text-center"
            >
              <p className="text-gray-700">
                يرجى تسجيل الدخول لإكمال عملية الشراء!{" "}
                <Link href="/auth/login" className="text-primary font-semibold hover:underline">
                  سجل الدخول من هنا
                </Link>
              </p>
            </motion.div>
          )}

          {cart.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="text-center py-16 bg-white rounded-lg"
            >
              <p className="text-gray-600 text-lg mb-6">سلة التسوق فارغة</p>
              <Link href="/products">
                <Button>تصفح المنتجات</Button>
              </Link>
            </motion.div>
          ) : (
            <div className="grid lg:grid-cols-3 gap-6 md:gap-8">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
                className="lg:col-span-2"
              >
                <div className="bg-white rounded-lg overflow-hidden">
                  {/* Desktop Table Header */}
                  <div className="hidden md:grid bg-gray-800 text-white grid-cols-6 gap-4 p-4 text-sm font-medium">
                    <div className="col-span-2 text-right">تفاصيل المنتج</div>
                    <div className="text-center">المجموع الفرعي</div>
                    <div className="text-center">الكمية</div>
                    <div className="text-center">الشحن</div>
                    <div className="text-center">السعر</div>
                  </div>

                  {/* Cart Items */}
                  <div className="divide-y">
                    {cart.map((item, index) => (
                      <motion.div
                        key={item.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.05 }}
                        className="p-4"
                      >
                        {/* Mobile Layout */}
                        <div className="md:hidden space-y-4">
                          <div className="flex gap-4">
                            <div className="relative w-20 h-20 flex-shrink-0 bg-gray-100 rounded-md">
                              <Image
                                src={item.image || "/placeholder.svg"}
                                alt={item.name}
                                fill
                                className="object-contain p-2"
                              />
                            </div>
                            <div className="flex-1 text-right">
                              <h3 className="font-semibold text-sm mb-1">{item.name}</h3>
                              <p className="text-lg font-bold text-primary">
                                ${(item.price * item.quantity).toFixed(2)}
                              </p>
                            </div>
                            <Button
                              size="icon"
                              variant="ghost"
                              onClick={() => {
                                removeFromCart(item.id)
                                toast({
                                  title: "تم الحذف",
                                  description: "تم حذف المنتج من السلة",
                                })
                              }}
                              className="h-8 w-8"
                            >
                              <Trash2 className="h-4 w-4 text-red-500" />
                            </Button>
                          </div>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <Button
                                size="icon"
                                variant="outline"
                                className="h-8 w-8 bg-transparent"
                                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                disabled={item.quantity <= 1}
                              >
                                <Minus className="h-3 w-3" />
                              </Button>
                              <span className="w-8 text-center font-semibold">{item.quantity}</span>
                              <Button
                                size="icon"
                                variant="outline"
                                className="h-8 w-8 bg-transparent"
                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              >
                                <Plus className="h-3 w-3" />
                              </Button>
                            </div>
                            <p className="text-sm text-gray-600">سعر الوحدة: ${item.price.toFixed(2)}</p>
                          </div>
                        </div>

                        {/* Desktop Layout */}
                        <div className="hidden md:grid grid-cols-6 gap-4 items-center">
                          <div className="col-span-2 flex items-center gap-4">
                            <div className="relative w-20 h-20 flex-shrink-0 bg-gray-100 rounded-md">
                              <Image
                                src={item.image || "/placeholder.svg"}
                                alt={item.name}
                                fill
                                className="object-contain p-2"
                              />
                            </div>
                            <div className="text-right">
                              <h3 className="font-semibold text-sm">{item.name}</h3>
                            </div>
                          </div>

                          <div className="text-center">
                            <p className="font-semibold">${item.price.toFixed(2)}</p>
                          </div>

                          <div className="flex items-center justify-center gap-2">
                            <Button
                              size="icon"
                              variant="outline"
                              className="h-8 w-8 bg-transparent"
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            >
                              <Plus className="h-3 w-3" />
                            </Button>
                            <span className="w-8 text-center font-semibold">{item.quantity}</span>
                            <Button
                              size="icon"
                              variant="outline"
                              className="h-8 w-8 bg-transparent"
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              disabled={item.quantity <= 1}
                            >
                              <Minus className="h-3 w-3" />
                            </Button>
                          </div>

                          <div className="text-center text-sm text-gray-600">مجاناً</div>

                          <div className="text-center font-bold">${(item.price * item.quantity).toFixed(2)}</div>

                          <div className="text-center">
                            <Button
                              size="icon"
                              variant="ghost"
                              onClick={() => {
                                removeFromCart(item.id)
                                toast({
                                  title: "تم الحذف",
                                  description: "تم حذف المنتج من السلة",
                                })
                              }}
                            >
                              <Trash2 className="h-5 w-5 text-red-500" />
                            </Button>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </motion.div>

              {/* Order Summary */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
                className="lg:col-span-1 space-y-6"
              >
                {/* Summary Card */}
                <div className="bg-white rounded-lg p-6">
                  <div className="space-y-4 mb-6">
                    <div className="flex justify-between text-right">
                      <span className="text-gray-600">المجموع الفرعي:</span>
                      <span className="font-semibold">${subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-right">
                      <span className="text-gray-600">الشحن:</span>
                      <span className="font-semibold">${shipping.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-right">
                      <span className="text-gray-600">الضريبة %14:</span>
                      <span className="font-semibold">${tax.toFixed(2)}</span>
                    </div>
                    {discount > 0 && (
                      <div className="flex justify-between text-right text-green-600">
                        <span>خصم %18-:</span>
                        <span className="font-semibold">-${discount.toFixed(2)}</span>
                      </div>
                    )}
                    <div className="border-t pt-4 flex justify-between text-right text-lg font-bold">
                      <span>المجموع الكلي:</span>
                      <span className="text-primary">${total.toFixed(2)}</span>
                    </div>
                  </div>

                  <Button
                    className="w-full mb-3"
                    size="lg"
                    onClick={() => {
                      if (!user) {
                        toast({
                          title: "يرجى تسجيل الدخول",
                          description: "يجب تسجيل الدخول لإتمام عملية الشراء",
                          variant: "destructive",
                        })
                        router.push("/auth/login")
                        return
                      }
                      router.push("/checkout")
                    }}
                  >
                    إتمام الشراء
                  </Button>

                  <Link href="/products">
                    <Button variant="outline" className="w-full bg-transparent">
                      متابعة التسوق
                    </Button>
                  </Link>
                </div>

                {/* Discount Code */}
                <div className="bg-white rounded-lg p-6">
                  <h3 className="font-semibold mb-4 text-right">رموز الخصم</h3>
                  <p className="text-sm text-gray-600 mb-4 text-right">أدخل رمز الخصومة إذا كان لديك واحد</p>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="SAVE18"
                      className="flex-1 border rounded-md px-3 py-2 text-right"
                      value={discountCode}
                      onChange={(e) => setDiscountCode(e.target.value)}
                    />
                    <Button onClick={applyDiscount}>تطبيق</Button>
                  </div>
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

"use client"

import type React from "react"

import { useCart } from "@/lib/context/cart-context"
import Header from "@/components/1-header"
import Footer from "@/components/8-footer"
import { Button } from "@/components/ui/button"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import Image from "next/image"
import Link from "next/link"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { useToast } from "@/hooks/use-toast"
import { createClient } from "@/lib/supabase/client"
import { Upload, Copy } from "lucide-react"

export default function CheckoutPage() {
  const { cart, clearCart, totalPrice } = useCart()
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [shippingMethod, setShippingMethod] = useState("same")
  const [paymentReceipt, setPaymentReceipt] = useState<File | null>(null)
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    company: "",
    city: "",
    address: "",
    state: "",
    postalCode: "",
    phone: "",
  })
  const router = useRouter()
  const { toast } = useToast()
  const supabase = createClient()

  const subtotal = totalPrice
  const tax = subtotal * 0.14
  const discount = subtotal * 0.18
  const shipping = 0
  const total = subtotal + tax - discount + shipping

  useEffect(() => {
    const checkUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) {
        toast({
          title: "يرجى تسجيل الدخول",
          description: "يجب تسجيل الدخول لإتمام عملية الشراء",
          variant: "destructive",
        })
        router.push("/auth/login")
        return
      }
      setUser(user)
      setFormData((prev) => ({
        ...prev,
        email: user.email || "",
      }))
    }
    checkUser()
  }, [])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setPaymentReceipt(e.target.files[0])
    }
  }

  const handleSubmit = async () => {
    if (!formData.fullName || !formData.email || !formData.phone || !formData.address || !formData.city) {
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
          total: total,
          customerName: formData.fullName,
          customerEmail: formData.email,
          customerPhone: formData.phone,
          shippingAddress: formData.address,
          shippingCity: formData.city,
          paymentMethod: "cash",
          notes: `Company: ${formData.company}, State: ${formData.state}, Postal: ${formData.postalCode}`,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to create order")
      }

      clearCart()
      router.push(`/checkout/confirmation?orderNumber=${data.orderNumber}`)
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

  if (!user) {
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

  if (cart.length === 0) {
    router.push("/cart")
    return null
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
            <Link href="/cart" className="hover:text-primary">
              عربة التسوق
            </Link>
            <span>&lt;</span>
            <span className="text-black">الدفع</span>
          </div>

          <h1 className="text-3xl font-bold mb-8 text-right">الدفع</h1>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Checkout Form */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="lg:col-span-2 space-y-6"
            >
              {/* Billing Information */}
              <div className="bg-white rounded-lg p-6">
                <h2 className="text-xl font-bold mb-6 text-right">بيانات الفواتير</h2>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="text-right">
                    <label className="block text-sm font-medium mb-2">الاسم الأول*</label>
                    <input
                      type="text"
                      className="w-full border rounded-md px-3 py-2 text-right"
                      value={formData.fullName}
                      onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                      required
                    />
                  </div>
                  <div className="text-right">
                    <label className="block text-sm font-medium mb-2">اسم العائلة*</label>
                    <input type="text" className="w-full border rounded-md px-3 py-2 text-right" />
                  </div>
                  <div className="text-right md:col-span-2">
                    <label className="block text-sm font-medium mb-2">اسم الشركة</label>
                    <input
                      type="text"
                      className="w-full border rounded-md px-3 py-2 text-right"
                      value={formData.company}
                      onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                    />
                  </div>
                  <div className="text-right">
                    <label className="block text-sm font-medium mb-2">البلد / المنطقة*</label>
                    <input
                      type="text"
                      className="w-full border rounded-md px-3 py-2 text-right"
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      required
                    />
                  </div>
                  <div className="text-right">
                    <label className="block text-sm font-medium mb-2">عنوان الشارع*</label>
                    <input
                      type="text"
                      className="w-full border rounded-md px-3 py-2 text-right"
                      value={formData.address}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                      required
                    />
                  </div>
                  <div className="text-right">
                    <label className="block text-sm font-medium mb-2">شقة / جناح / وحدة</label>
                    <input type="text" className="w-full border rounded-md px-3 py-2 text-right" />
                  </div>
                  <div className="text-right">
                    <label className="block text-sm font-medium mb-2">المدينة*</label>
                    <input
                      type="text"
                      className="w-full border rounded-md px-3 py-2 text-right"
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      required
                    />
                  </div>
                  <div className="text-right">
                    <label className="block text-sm font-medium mb-2">الولاية / المحافظة*</label>
                    <input
                      type="text"
                      className="w-full border rounded-md px-3 py-2 text-right"
                      value={formData.state}
                      onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                    />
                  </div>
                  <div className="text-right">
                    <label className="block text-sm font-medium mb-2">الرمز البريدي*</label>
                    <input
                      type="text"
                      className="w-full border rounded-md px-3 py-2 text-right"
                      value={formData.postalCode}
                      onChange={(e) => setFormData({ ...formData, postalCode: e.target.value })}
                    />
                  </div>
                  <div className="text-right">
                    <label className="block text-sm font-medium mb-2">رقم الهاتف*</label>
                    <input
                      type="tel"
                      className="w-full border rounded-md px-3 py-2 text-right"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div className="mt-6 flex items-center gap-2">
                  <Checkbox id="terms" />
                  <label htmlFor="terms" className="text-sm text-gray-600">
                    احفظ معلوماتي لتسريع عملية الشراء في المرات القادمة
                  </label>
                </div>
              </div>

              {/* Shipping Address */}
              <div className="bg-white rounded-lg p-6">
                <h2 className="text-xl font-bold mb-6 text-right">عنوان الشحن</h2>
                <p className="text-sm text-gray-600 mb-4 text-right">
                  اختر العنوان الذي يطابق بطاقة الدفع أو طريقة الدفع الخاصة بك.
                </p>
                <RadioGroup value={shippingMethod} onValueChange={setShippingMethod}>
                  <div className="flex items-center space-x-2 space-x-reverse mb-3">
                    <RadioGroupItem value="same" id="same" />
                    <Label htmlFor="same" className="cursor-pointer">
                      نفس عنوان الفاتورة
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2 space-x-reverse">
                    <RadioGroupItem value="different" id="different" />
                    <Label htmlFor="different" className="cursor-pointer">
                      استخدم عنوان شحن مختلف
                    </Label>
                  </div>
                </RadioGroup>
              </div>

              {/* Shipping Method */}
              <div className="bg-white rounded-lg p-6">
                <h2 className="text-xl font-bold mb-6 text-right">طريقة الشحن</h2>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-sm text-gray-700 text-right mb-2">يصل بتاريخ وقت الاثنين 7 أكتوبر</p>
                  <div className="flex justify-between items-center">
                    <span className="font-bold">$0.00</span>
                    <span className="text-sm text-gray-600">رسوم التوصيل</span>
                  </div>
                  <p className="text-xs text-gray-500 mt-2 text-right">قد تطبق رسوم إضافية</p>
                </div>
              </div>

              {/* Payment Method */}
              <div className="bg-white rounded-lg p-6">
                <h2 className="text-xl font-bold mb-6 text-right">طريقة الدفع</h2>
                <p className="text-sm text-gray-600 mb-4 text-right">جميع المعاملات آمنة ومشفرة.</p>

                <div className="border-2 border-black rounded-lg p-4 mb-4">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-black rounded-full"></div>
                    </div>
                    <span className="font-semibold">بنك الراجحي</span>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                    <p className="text-sm text-gray-700 text-right">مؤسسة متجر الاكسسوارات</p>

                    <div className="flex items-center justify-between bg-white rounded-md p-3">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => {
                          navigator.clipboard.writeText("123456790")
                          toast({ title: "تم النسخ", description: "تم نسخ رقم الحساب" })
                        }}
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                      <span className="font-mono">123456790</span>
                    </div>

                    <p className="text-xs text-gray-600 text-right">يرجى كتابة "دفع محمد سعيد" في معلومات التحويل.</p>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      className="flex-1 bg-transparent"
                      onClick={() => document.getElementById("receipt")?.click()}
                    >
                      <Upload className="h-4 w-4 ml-2" />
                      إرفاق إيصال التحويل (اختياري)
                    </Button>
                    <input id="receipt" type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
                    <Button variant="outline">اختيار ملف</Button>
                  </div>
                  {paymentReceipt && (
                    <p className="text-sm text-green-600 text-right">تم إرفاق: {paymentReceipt.name}</p>
                  )}
                </div>
              </div>

              <Button className="w-full" size="lg" onClick={handleSubmit} disabled={loading}>
                {loading ? "جاري المعالجة..." : "تأكيد دفع"}
              </Button>
            </motion.div>

            {/* Order Summary */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="lg:col-span-1"
            >
              <div className="bg-white rounded-lg p-6 sticky top-36">
                <h2 className="text-xl font-bold mb-6 text-right">ملخص الطلب</h2>

                <div className="space-y-4 mb-6">
                  {cart.map((item) => (
                    <div key={item.id} className="flex items-center gap-3">
                      <div className="relative w-16 h-16 flex-shrink-0">
                        <Image
                          src={item.image || "/placeholder.svg"}
                          alt={item.name}
                          fill
                          className="object-cover rounded-md"
                        />
                      </div>
                      <div className="flex-1 text-right">
                        <h3 className="font-semibold text-sm">{item.name}</h3>
                        <p className="text-xs text-gray-500">المقاس: M</p>
                        <p className="text-xs text-gray-500">اللون: أسود</p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">${(item.price * item.quantity).toFixed(2)}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="space-y-3 border-t pt-4">
                  <div className="flex justify-between text-right">
                    <span className="text-gray-600">المجموع الفرعي (3 منتجات)</span>
                    <span className="font-semibold">${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-right">
                    <span className="text-gray-600">الضريبة</span>
                    <span className="font-semibold">${tax.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-right text-green-600">
                    <span>الخصم</span>
                    <span className="font-semibold">-${discount.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-right">
                    <span className="text-gray-600">الشحن</span>
                    <span className="font-semibold">${shipping.toFixed(2)}</span>
                  </div>
                  <div className="border-t pt-3 flex justify-between text-right text-lg font-bold">
                    <span>الإجمالي</span>
                    <span className="text-primary">${total.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
